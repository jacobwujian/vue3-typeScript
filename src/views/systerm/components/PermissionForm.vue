<template>
	<a-form ref="permissionForm" :model="form" :rules="rules" v-bind="formItemLayout">
		<a-form-item label="角色名称" prop="roleName">
			<a-input v-model:value.trim="form.roleName" :disabled="notEditable" placeholder="请输入角色名称" />
		</a-form-item>

		<a-form-item label="角色权限" prop="menuPermissionCodes">
			<a-spin :spinning="loading">
				<a-descriptions layout="vertical" bordered size="middle">
					<a-descriptions-item v-for="(item, index) in checkOptions" :key="index" :span="3">
						<template slot="label">
							<a-checkbox :indeterminate="item.indeterminate" :checked="item.checkAll"
								:disabled="notEditable" @change="onCheckAllChange($event, index)">
								{{ item.label }}
							</a-checkbox>
						</template>
						<a-checkbox-group v-model:value="item.checkedList" :options="item.options"
							:disabled="notEditable" @change="onCheckChange($event, index)" />
					</a-descriptions-item>
				</a-descriptions>
			</a-spin>
		</a-form-item>

		<a-divider />

		<a-row class="btns-row">
			<a-col class="text-center">
				<a-space size="large">
					<a-button v-if="modalName !== 'view'" type="primary" html-type="submit" :loading="loading"
						@click="submitForm">
						确定
					</a-button>
					<a-button @click="$emit('close')">
						取消
					</a-button>
				</a-space>
			</a-col>
		</a-row>
	</a-form>
</template>

<script>
	import {
		validateZhEnNum
	} from '@/utils/validate'
	import api from '@/api'
	const formItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 18
		}
	}

	export default {
		props: {
			detail: {
				type: Object,
				default: null
			},
			modalName: {
				type: String,
				default: 'add'
			}
		},
		data() {
			return {
				formItemLayout,
				form: {
					roleName: '',
					menuPermissionCodes: [],
					menuElementPermissionCodes: []
				},
				checkOptions: [],
				detailActionCodes: [], // 修改、详情已选操作
				detailChecked: [],
				menuChild: [],
				loading: false
			}
		},
		computed: {
			rules() {
				return {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							validator: validateZhEnNum,
							trigger: 'blur'
						}
					],
					menuPermissionCodes: [{
						type: 'array',
						required: true,
						message: '请选择角色权限',
						trigger: 'change'
					}]
				}
			},
			notEditable() {
				return this.modalName === 'view'
			}
		},
		async created() {
			if (this.modalName !== 'add' && Object.keys(this.detail).length) {
				this.initForm()
				const res = await this.getRoleDetail()
			}

			this.getMenulist()
		},
		methods: {
			getRoleDetail() {
				return this.$api.role.getRoleDetail({
						id: this.detail.id
					})
					.then(res => {
						if (!res) return false

						if (res.menuElementPermissionCodeList && res.menuElementPermissionCodeList.length) {
							this.detailActionCodes = res.menuElementPermissionCodeList
						}
						if (res.menuElementList && res.menuElementList.length) {
							this.detailChecked = res.menuElementList
						}
						return true
					})
			},
			getMenulist() {
				this.loading = true
				api.menu.getMenuList()
					.then(res => {
						const menus = res && res.childMenu
						if (menus && menus.length) {
							this.formatCheckOptions(menus)
						}
					})
					.finally(() => {
						this.loading = false
					})
			},
			// 格式化checkoption
			formatCheckOptions(menus) {
				let count = 0
				for (let i = 0; i < menus.length; i++) {
					const parent = menus[i]
					if (parent.level === 2) {
						this.menuChild.push(parent)
						continue
					}
					this.checkOptions[count] = {
						label: parent && parent.menuItem,
						value: parent && parent.permissionCode,
						indeterminate: false,
						checkAll: false,
						level: parent && parent.level,
						checkedList: [],
						options: []
					}
					let options = [],
						checkedList = []
					const menuElementList = parent.menuElementList
					for (let j = 0; j < menuElementList.length; j++) {
						const item = menuElementList[j]
						if (!item || !item.menuElementItem || !item.permissionCode) {
							return false
						}

						options.push({
							label: item.menuElementItem,
							value: item.permissionCode
						})

						// 选中项
						if (this.modalName !== 'add' && this.detailActionCodes.includes(item.permissionCode)) {
							checkedList.push(item.permissionCode)
						}
					}
					this.checkOptions[count]['checkedList'] = checkedList
					this.checkOptions[count]['options'] = options
					count++
				}
				for (let i = 0; i < this.checkOptions.length; i++) {
					const par = this.checkOptions[i]
					let checkedList = par.checkedList
					let options = par.options
					for (let j = 0; j < this.menuChild.length; j++) {
						const chr = this.menuChild[j]
						if (par.value.includes(chr.topMenuItemCode)) {
							options.push({
								label: chr.menuItem,
								value: chr.permissionCode
							})
							if (this.detailChecked.toString().includes(chr.permissionCode)) {
								checkedList.push(chr.permissionCode)
							}
						}
					}
					this.checkOptions[i]['checkedList'] = checkedList
					this.checkOptions[i]['options'] = options
					this.checkOptions[i]['indeterminate'] = !!checkedList.length && checkedList.length < options.length
					this.checkOptions[i]['checkAll'] = checkedList.length === options.length && (options.length > 0 || this
						.detailChecked.toString().includes(par.value))
				}
			},
			// 初始化表单
			initForm() {
				for (const key in this.form) {
					if (key in this.detail) {
						this.form[key] = this.detail[key]
					}
				}
			},
			getPermission() {
				let obj = {
					menuPermissionCodes: [],
					menuElementPermissionCodes: []
				}
				this.checkOptions.forEach((item, index) => {
					if (!item.checkedList.length && !item.checkAll) return

					obj.menuPermissionCodes.push(item.value)
					obj.menuElementPermissionCodes.push(...item.checkedList)
				})

				return obj
			},
			submitForm() {
				const {
					menuPermissionCodes,
					menuElementPermissionCodes
				} = this.getPermission()
				this.form.menuPermissionCodes = menuPermissionCodes
				this.form.menuElementPermissionCodes = menuElementPermissionCodes
				this.$refs.permissionForm.validate(valid => {
					if (!valid) return false
					if (this.modalName === 'add') this.add()
					else if (this.modalName === 'edit') this.edit()
				})
			},
			add() {
				this.loading = true

				this.$api.role.addRole(this.form)
					.then(res => {
						this.$message.success('新增成功')
						this.$emit('close', true)
					})
					.finally(() => {
						this.loading = false
					})
			},
			edit() {
				this.loading = true

				this.$api.role.updateRole({
					id: this.detail.id,
					...this.form
				}).then(res => {
					this.$message.success('修改成功')
					this.$emit('close', true)
				}).finally(() => {
					this.loading = false
				})
			},
			onCheckChange(checkedList, index) {
				const options = this.checkOptions[index].options
				this.checkOptions[index].indeterminate = !!checkedList.length && checkedList.length < options.length
				this.checkOptions[index].checkAll = checkedList.length === options.length
			},
			onCheckAllChange(e, index) {
				const options = this.checkOptions[index].options
				const optionsVal = options.map(item => item.value)

				Object.assign(this.checkOptions[index], {
					checkedList: e.target.checked ? optionsVal : [],
					indeterminate: false,
					checkAll: e.target.checked
				})
			}
		}
	}
</script>
