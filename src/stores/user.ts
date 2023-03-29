/*
 * @created: 2023-03-25 13:38:24
 * @author: wj
 * ---------
 * @desc 用户数据
 */

import app from '@/main'
import api from '@/api'
import {
	defineStore
} from 'pinia'
import {
	reactive
} from 'vue'
export const userStore = defineStore('userStore', () => {
	const userInfo = reactive<any>({})
	function setUserInfo(data:any) {
		for (let key in data) {
			userInfo[key] = data[key]
		}
	}

	function logout() {
		app.ls.clear()
		for (let key in userInfo) {
			userInfo[key] = null
		}
		app.config.globalProperties.$router.replace('/login')
	}

	function getUserInfo() {
		return new Promise((resolve, reject) => {
			api.user
				.accountDetail()
				.then((res:any) => {
					app.ls.set('loginVal', JSON.stringify(res))
					if (res.status === 0) {
						res.permissionCodes = ['organizationEdit', 'organizationDetail',
							'dealDetail'
						]
					}
					setUserInfo(res)
					resolve(res)
				})
				.catch((err:any) => {
					reject(err)
				})
		})
	}
	return {
		userInfo,
		setUserInfo,
		logout,
		getUserInfo
	}
})
