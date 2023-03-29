<template>
	<a-layout id="components-layout-demo-custom-trigger" class="c-layout-index">
		<Cside :collapsed="collapsed" />
		<a-layout>
			<a-layout-header class="layout-header">
				<a-icon class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'"
					@click="() => (collapsed = !collapsed)" />
				<Cuser />
			</a-layout-header>
			<Cbreadcrumb class="c-bread-crumb" />

			<a-layout-content class="c-layout-content" :style="changeMainStyle">
				<router-view  v-if="route.meta && route.meta.noLayout" v-slot="{ Component }">
					<keep-alive>
						<transition name="fade-transform" mode="out-in">
							<component :is="Component" />
						</transition>
					</keep-alive>
				</router-view>
				<a-card v-else class="c-card">
					<div class="c-card-title">
						{{ route.meta.title }}
					</div>
					<router-view v-slot="{ Component }">
						<keep-alive>
							<transition>
								<component :is="Component" />
							</transition>
						</keep-alive>
					</router-view>
				</a-card>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>
<script  lang="ts" >
	import Cside from './components/Cside.vue'
	import {
		useRoute
	} from 'vue-router'
	import {
		provide,
		ref,
		reactive
	} from 'vue'
	import Cbreadcrumb from './components/Cbreadcrumb.vue'
	import Cuser from './components/Cuser.vue'
	import {
		watch
	} from 'vue'
	export default {
		components: {
			Cside,
			Cbreadcrumb,
			Cuser
		},
		setup(props, ctx) {
			const collapsed = ref(false)
			const route = useRoute()
			const changeMainStyle = reactive({})
			provide('changeMainStyle', changeMainStyle)
			provide('collapsed', collapsed)
			return {
				collapsed,
				route,
				changeMainStyle
			}
		}
	}
</script>

<style scoped lang="less">
	.c-layout-index {
		.c-bread-crumb {
			padding: 10px 24px;
		}

		.c-layout-content {
			height: 100%;
			padding: 0 24px 24px 24px;
			overflow: initial;
		}

		.c-card {
			min-height: calc(100% - 32px);

			.c-card-title {
				font-size: 18px;
				margin-bottom: 10px;
			}
		}
	}

	#components-layout-demo-custom-trigger {
		height: 100%;

		.layout-header {
			background: #fff;
			padding: 0 24px 0 24px;
			display: flex;
			justify-content: space-between;
		}
	}

	#components-layout-demo-custom-trigger .trigger {
		font-size: 18px;
		line-height: 64px;
		cursor: pointer;
		transition: color 0.3s;
	}

	#components-layout-demo-custom-trigger .trigger:hover {
		color: #1890ff;
	}
</style>
