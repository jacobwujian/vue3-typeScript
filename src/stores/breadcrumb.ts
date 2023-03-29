/*
 * @created: 2023-03-25 13:36:58
 * @author: wj
 * ---------
 * @desc 路由访问权限配置
 */

/* Layout */

import {
	defineStore
} from 'pinia'
import { reactive } from 'vue'


export const breadcrumbStore:Function = defineStore('breadcrumbStore', () => {
	const breadcrumb = reactive<any>([])
	function setBreadcrumb(data: Array<any>) {
		breadcrumb.splice(0,breadcrumb.length)
		breadcrumb.push(...data)
	}
	return {
		breadcrumb,
		setBreadcrumb
	}
})
