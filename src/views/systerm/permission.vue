<!--  -->
<template>
	<div>
		<c-page ref="base" :search-type="searchType" :columns="columns" :data="data" @fetch="fetch">
			<template slot="headerLeft">
				<a-button type="primary" @click="showModal('add')">
					新增
				</a-button>
			</template>
			<template #action="{ record }">
				<a-button v-if="record.status === 0" type="link" @click="showConfirm('start', record.id)">
					启用
				</a-button>
				<a-button v-if="record.status === 1" type="link" @click="showConfirm('stop', record.id)">
					停用
				</a-button>
				<a-button v-if="record.roleCode !== 'superadmin'" type="link" @click="showModal('edit', record)">
					修改
				</a-button>
				<a-button type="link" @click="showModal('view', record)">
					详情
				</a-button>
			</template>
		</c-page>

		<a-modal v-model="modalVisible" :title="modalTitle" :width="600" :footer="null" :destroy-on-close="true">
			<PermissionForm ref="permissionForm" :detail="detail" :modal-name="modalName" @close="close" />
		</a-modal>
	</div>
</template>

<script>
	import PermissionForm from './components/PermissionForm.vue'
	import {
		switchStatus
	} from '@/utils/typeEnum'
	import api from '@/api'
	const searchType = [{
		type: 'input',
		label: '角色名称',
		params: 'roleName'
	}, {
		type: 'datePicker',
		label: '创建时间',
		params: 'create'
	}, {
		type: 'select',
		label: '状态',
		params: 'status',
		data: switchStatus
	}]

	const columns = [{
		title: '序号',
		width: 55,
		scopedSlots: {
			customRender: 'no'
		}
	}, {
		title: '角色名称',
		dataIndex: 'roleName'
	}, {
		title: '创建时间',
		dataIndex: 'createTime',
		scopedSlots: {
			customRender: 'createTime',
			type: 'time'
		},
		width: '24%'
	}, {
		title: '状态',
		dataIndex: 'status',
		scopedSlots: {
			customRender: 'status',
			type: 'select',
			data: switchStatus
		}
	}, {
		title: '操作',
		scopedSlots: {
			customRender: 'action'
		}
	}]

	const confirmTypes = {
		stop: {
			api: 'stopRole',
			title: '停用'
		},
		start: {
			api: 'startRole',
			title: '启用'
		}
	}

	const data = []

	export default {
		components: {
			PermissionForm
		},
		data() {
			return {
				switchStatus,
				searchType,
				data,
				columns,
				modalName: '', // view- 详情 add- 新增 edit- 修改
				modalVisible: false,
				detail: ''
			}
		},
		computed: {
			modalTitle() {
				if (this.modalName === 'add') return '权限配置'
				else if (this.modalName === 'edit') return '修改权限'
				else return '权限详情'
			}
		},
		methods: {
			/**
			 * 查询table data
			 * @param {Object} params 查询参数
			 */
			fetch(params, success, fetchFinally) {
				api.role.allRole(params)
					.then(res => {
						if (!res) res = {
							list: [],
							total: 0
						}
						success(res)
					})
					.finally(() => {
						fetchFinally()
					})
			},
			/**
			 * 弹窗open
			 * @param {String} type 操作类型
			 * @param {String} detail 该条数据详情
			 */
			showModal(type, record) {
				this.modalName = type
				this.detail = record
				this.modalVisible = true
			},
			/**
			 * 确认弹窗
			 * @param {string} type 操作类型
			 * @param {string} id
			 */
			showConfirm(type, id) {
				return
				const title = confirmTypes[type].title
				const content = confirmTypes[type].content || `是否确定${title}该角色？`
				const that = this
				this.$confirm({
					title: `${title}提示`,
					content: content,
					onOk() {
						that.confirmActions(type, id)
					},
					onCancel() {}
				})
			},
			// 确认操作
			confirmActions(type, id) {
				const apiName = confirmTypes[type].api
				apiName && this.$api.role[apiName]({
						id
					})
					.then(res => {
						this.$message.success('操作成功')
						this.$refs.base.fetch()
					})
			},
			close(isFetch = false) {
				this.modalVisible = false
				if (isFetch) this.$refs.base.fetch()
			}
		}
	}
</script>
<style lang='less' scoped>
</style>
