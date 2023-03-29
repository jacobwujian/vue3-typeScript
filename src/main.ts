import Icon from '@/components/plugins/a-icon.vue';
import "default-passive-events";
import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import dayjs from 'dayjs'
import {
	cPath
} from '@/utils/constant'
import api from '@/api'
import plugins from '@/plugins'
import '@/styles/index.less'
import './permission'
import 'ant-design-vue/dist/antd.css'
const app:any = createApp(App)
store(app)
app.use(router)
app.component('a-icon', Icon)
app.provide('$dayjs', dayjs)
app.provide('$api', api)
app.provide('$cPath', cPath)
plugins(app)
app.mount('#app')
export default app
