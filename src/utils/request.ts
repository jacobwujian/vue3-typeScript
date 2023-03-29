import axios from 'axios'
import Vue from '@/main'
import {
	message
} from 'ant-design-vue'
import {userStore} from '@/stores/user'
import {
	baseURL,
	accessToken
} from '@/utils/constant'
import type {AxiosRequestConfig} from 'axios'
let prod = false
if (import.meta.env.NODE_ENV === 'production') {
	prod = true
}

const service = axios.create({
	baseURL: 'http://127.0.0.1:8888', //prod ? baseURL : 'http://121.5.150.148:8000',
	timeout: 30000,
	withCredentials: false
})
// 测试后端地址  http://121.5.150.148:8000
// 生产后端地址  http://120.27.232.217:9090
const domain:any = {
	cw: 'http://127.0.0.1:8888', //http://121.5.150.148:8000',
	wx: 'http://127.0.0.1:8888' //'http://121.5.150.148:8000'
}

service.interceptors.request.use(
	(config:any) => {
		if (!prod) {
			config.url = (config.domain ? domain[config.domain] : 'http://127.0.0.1:8888') + config.url
		}
		const token = Vue.ls.get(accessToken)
		if (token && !config.noToken) {
			config.headers['Authorization'] = token
		}
		config.headers['RequestTime'] = new Date().getTime()
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	(response) => {
		const {
			data,
			config
		} = response
		if (data.status === 200) {
			return data.data
		} else if (data.status === 401) {
			message.error('登录已超时')
			userStore().logout()
			return Promise.reject(new Error(data.error || 'Error'))
		} else {
			if (!config&&!(<any>config).noMessage) message.error(data.message || 'Error')
			return Promise.reject(new Error(data.error || 'Error'))
		}
	},
	(error) => {
		console.log(error)
		message.error('操作太频繁，请稍后重试！')
		return Promise.reject(error)
	}
)

export default  function (obj:any){ return service(obj as AxiosRequestConfig)}
