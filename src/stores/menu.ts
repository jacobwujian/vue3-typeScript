import {
	cPath
} from '@/utils/constant'

import {
	defineStore
} from 'pinia'
import { reactive } from 'vue'

function formatChildren(list:any[], path?:any): any[] {
	const Clist= list.filter(it => !it.hidden)
	return Clist.map(item => {
		const obj:any = {
			name: item.meta.title,
			path: `${(path || cPath)}/${item.path}`,
			icon: item.meta.icon || 'dashboard',
			order: item.order
		}
		if (!item.children) return obj
		const childrenlist = (<any[]>item.children)?.filter(it => !it.hidden)
		if (childrenlist && childrenlist.length) {
			obj.children = formatChildren(childrenlist, obj.path)
		}
		return obj
	}).sort((a, b) => a.order - b.order)
}

export const menuStore:Function = defineStore('menuStore', () => {
	const menulist = reactive<any>([])

	function setMenulist(data:any[]) {
		menulist.splice(0, menulist.length)
		menulist.push(...formatChildren(data[0].children))
	}
	return {
		menulist,
		setMenulist
	}
})
