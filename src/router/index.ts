import {
	createRouter,
	createWebHistory
} from 'vue-router'
import {
	cPath
} from '@/utils/constant'
import {reactive} from 'vue'
/* Layout */
import Layout from '@/layout/index.vue'
/* Router Modules */

const baseRoute:any = reactive({
	path: cPath,
	component: Layout,
	name: 'index',
	meta: {
		title: '首页'
	},
	redirect: `${cPath}/index`,
	children: []
})

//获取moudules文件下所有ts文件；
const context:any = import.meta.glob('./modules/*.ts', {
	eager: true
  })

// 用于存储module下的路由信息到baseRoute的children下
for (let item in context){
	//将路由对象加入baseRoute的children中
	baseRoute.children.push(context[item].default)
}
export const asyncRoutes = [
	baseRoute
]

export const constantRoutes:any = [{
		path: '/',
		name: 'login',
		redirect: '/login'
	}, {
		path: '/login',
		name: 'UserLogin',
		component: () => import('@/views/login/index.vue'),
		hidden: true,
		meta: {
			title: '登录'
		}
	},
	{
		path: '/screen',
		name: 'screen',
		meta: {
			title: '大屏图表'
		},
		component: () => import('@/views/screen/index.vue'),
		hidden: true
	},
	{
		path: '/adm:catchAll(.*)',
		name: '404',
		component: () => import('@/views/error-pages/404.vue'),
		hidden: true,
		meta: {
			title: '未找到'
		}
	}
]
import type { RouterScrollBehavior, RouterOptions } from 'vue-router'
const scrollBehavior: RouterScrollBehavior = async (to:any, from:any, savedPosition:any) => {
  if (savedPosition) {
    return savedPosition
  } else if (to.hash) {
    return { el: to.hash }
  } else {
    return { top: 0 }
  }
}
const createARouter = () => {
	let newRouter:any = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes: constantRoutes,
		scrollBehavior: scrollBehavior
	})
	const originalPush = newRouter.push
	newRouter.push = function push(location:any, onResolve:any, onReject:any) {
		if (onResolve || onReject) {
			return originalPush.call(this, location, onResolve, onReject)
		}
		return originalPush.call(this, location).catch((err:any) => err)
	}
	newRouter.addRoutes = function(routeList:any[]) {
		for (const route of routeList) {
			newRouter.addRoute(route)
		}
	}
	newRouter.onError((e:any) => {
		console.log(e)
	})
	return newRouter
}


const router = createARouter()

export function resetRouter() {
	const newRouter = createARouter()
	router.matcher = newRouter.matcher // the relevant part
	router.options.routes = []
}

export default router
