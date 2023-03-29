<template>
	<div class="org-form">
		<p v-if="formType === 'review'" class="text-center fs-16">审核类型（{{ checkTypeInfo }}）</p>
		<a-form ref="editForm" :model="form" :rules="rules" v-bind="formItemLayout">
			<a-row :gutter="16">
				<a-col v-for="(item, index) in formItems" :key="index" :span="8">
					<a-form-item :label="item.label" :name="item.params"
						:label-col="item.labelCol || formItemLayout.labelCol"
						:wrapper-col="item.wrapperCol || formItemLayout.wrapperCol">
						<a-input v-if="item.type === 'input'" v-model:value.trim="form[item.params]"
							:max-length="item.max || -1" :placeholder="`请输入${item.label}`"
							:disabled="notEditable || item.disabled == true" />

						<a-textarea v-if="item.type === 'textarea'" v-model:value.trim="form[item.params]"
							:auto-size="{ minRows: 3, maxRows: 5 }" :placeholder="`请输入${item.label}`"
							:disabled="notEditable || item.disabled == true" />

						<a-input-number v-if="item.type === 'inputNumber'" v-model:value="form[item.params]"
							:precision="0" :placeholder="`请输入${item.label}`" style="width: 100%" />

						<a-select v-if="item.type === 'select'" v-model:value="form[item.params]"
							:placeholder="`请选择${item.label}`" :disabled="notEditable || item.disabled == true">
							<a-select-option v-for="(op, i) in item.data" :key="`${i}-${op.value}`" :value="op.value">
								{{ op.name }}
							</a-select-option>
						</a-select>

						<a-radio-group v-if="item.type === 'radio'" v-model:value="form[item.params]"
							:disabled="formType === 'edit'">
							<a-radio v-for="(op, i) in item.data" :key="`${i}-${op.value}`" :value="op.value">
								{{ op.name }}
							</a-radio>
						</a-radio-group>

						<div v-if="item.type === 'upload1'">
							<CUpload ref="cUpload" :disabled="notEditable" :file-id="item.params && form[item.params]"
								:file-type="item.fileType" :file-suffix="item.fileSuffix"
								:file-suffix1="item.fileSuffix1" @on-success="onUploadSuccess1" />
							<a-button v-if="item.type === 'upload1'" type="link" @click="download(form[item.params])">
								查看历史图片
							</a-button>
						</div>
						<div v-if="item.type === 'upload2'">
							<CUpload ref="cUpload" :disabled="notEditable" :file-id="item.params && form[item.params]"
								:file-type="item.fileType" :file-suffix="item.fileSuffix"
								:file-suffix1="item.fileSuffix1" @on-success="onUploadSuccess2" />
							<a-button v-if="item.type === 'upload2'" type="link" @click="download(form[item.params])">
								查看历史图片
							</a-button>
						</div>

						<div v-if="item.type === 'info'" class="empty-item">
							{{ item.params && form[item.params] }}
						</div>

						<a-cascader v-if="item.type === 'areaPicker'" v-model:value="form[item.params]"
							:options="areaOptions" :placeholder="`请选择${item.label}`"
							:disabled="notEditable || item.disabled == true" />
						<a-cascader v-if="item.type === 'companyType' && orgInfo.type == 1"
							v-model:value="form[item.params]" :options="getCompanyType"
							:placeholder="`请选择${item.label}`" :disabled="notEditable || item.disabled == true" />
						<a-select v-if="item.type === 'companyType' && orgInfo.type == 2"
							v-model:value="form[item.params]" :placeholder="`请选择${item.label}`"
							:disabled="notEditable || item.disabled == true">
							<a-select-option v-for="(op, i) in item.data2" :key="`${i}-${op.value}`" :value="op.value">
								{{ op.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="审核备注" name="approveRemark" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
						<a-textarea v-model:value.trim="form.approveRemark" :auto-size="{ minRows: 3, maxRows: 5 }"
							placeholder="请输入审核备注" :disabled="formType === 'edit'" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-divider />
			<a-row class="btns-row">
				<a-col class="text-center">
					<a-space size="large">
						<a-button type="primary" html-type="submit" :loading="loading" @click="submitForm">
							提交
						</a-button>
						<a-button type="primary" @click="resetForm">
							重置
						</a-button>
						<a-button @click="$emit('close')">
							取消
						</a-button>
					</a-space>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script lang="ts">
	import CUpload from '@/components/base/c-upload.vue'
	import {
		validateZhEnNum,
		validateSocialCode,
		validateIdCard,
		validatePhone,
		validateEmail
	} from '@/utils/validate'
	import {
		orgTypes,
		reviewType,
		companyProp,
		getCompanyType,
		companyType2
	} from '@/utils/typeEnum'
	import {
		ZJoptions
	} from '@/utils/cascader-address-options'
	import {
		baseURL,
		accessToken
	} from '@/utils/constant'
	import app from '@/main'
	import api from '@/api'
	const formItemLayout = {
		labelCol: {
			span: 6
		},
		wrapperCol: {
			span: 18
		}
	}
	// 1企业 2个人
	const baseFormType1 = [{
			type: 'select',
			label: '角色权限',
			params: 'roleName',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'input',
			label: '机构名称',
			params: 'companyName',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'select',
			label: '单位性质',
			params: 'companyProp',
			data: companyProp,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'companyType',
			label: '单位类型',
			params: 'companyType',
			data2: companyType2,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '统一社会信用代码',
			params: 'socialCreditCode',
			max: 18,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'areaPicker',
			label: '单位注册地区',
			params: 'companyArea',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '公司地址',
			params: 'address',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '法人姓名',
			params: 'legalPerson',
			max: 20,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '法人身份证号码',
			params: 'legalPersonIdCard',
			max: 18,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '联系人名称',
			params: 'contact',
			max: 20,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '联系人身份证',
			params: 'personIdCard',
			max: 18,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},

		{
			type: 'input',
			label: '联系人电话',
			params: 'phone',
			max: 11,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '邮编',
			params: 'zipCode',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'input',
			label: '电子邮件',
			params: 'mail',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'upload1',
			label: '营业执照',
			params: 'businessLicense',
			fileType: ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'],
			fileSuffix: ['jpg', 'jpeg', 'png'],
			fileSuffix1: ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'],
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		},
		{
			type: 'upload2',
			label: '补充材料',
			params: 'otherMaterial',
			fileType: ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG',
				'application/pdf', 'application/PDF'
			],
			fileSuffix: ['jpg', 'jpeg', 'png', 'pdf'],
			fileSuffix1: ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG', 'pdf', 'PDF'],
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			}
		}
	]
	const baseFormType2 = [{
			type: 'select',
			label: '角色权限',
			params: 'roleName',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'input',
			label: '机构名称',
			params: 'companyName',
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'input',
			label: '联系人名称',
			params: 'contact',
			max: 20,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},
		{
			type: 'input',
			label: '联系人身份证',
			params: 'personIdCard',
			max: 18,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		},

		{
			type: 'input',
			label: '联系人电话',
			params: 'phone',
			max: 11,
			labelCol: {
				span: 9
			},
			wrapperCol: {
				span: 15
			},
			disabled: true
		}
	]
	const reviewFormType = [{
		type: 'radio',
		label: '审核结果',
		params: 'approveResult',
		data: reviewType,
		labelCol: {
			span: 9
		},
		wrapperCol: {
			span: 15
		}
	}]

	export default {
		components: {
			CUpload
		},
		props: {
			formType: {
				type: String,
				default: 'edit'
			},
			id: {
				type: String,
				default: ''
			},
			orgTypeVal: {
				type: Number,
				default: undefined
			},
			userType: {
				type: String,
				default: '1'
			},
			detail: {
				type: Object,
				default: () => <any>{}
			}
		},
		data() {
			return {
				getCompanyType,
				areaOptions: ZJoptions,
				orgTypes,
				formItemLayout,
				approveType: undefined, // 审核类型 0-项目审核 1-核销审核 2-机构审核 3-机构修改审核
				loading: false,
				loginVal: {},
				orgInfo: <any>{},
				form: <any>{}
			}
		},
		computed: {
			checkTypeInfo() {
				let info = ''
				switch (this.approveType) {
					case 0:
						info = '项目审核'
						break
					case 1:
						info = '核销审核'
						break
					case 2:
						info = '机构审核'
						break
					case 3:
						info = '机构修改审核'
						break
					default:
						info = '注册审核'
						break
				}

				return info
			},
			formItems():any {
				// 1企业 2个人
				let orgInfo = JSON.parse(app.ls.get('orgInfo'))
				let formArr
				if (this.formType === 'review') {
					// 审核
					if (orgInfo.userType == '1' || orgInfo.userType == null) {
						formArr = [...baseFormType1, ...reviewFormType]
					} else if (orgInfo.userType == '2') {
						formArr = [...baseFormType2, ...reviewFormType]
					}
				} else {
					// 修改
					if (orgInfo.userType == '1' || orgInfo.userType == null) {
						formArr = [...baseFormType1, ...reviewFormType]
					} else if (orgInfo.userType == '2') {
						formArr = [...baseFormType2, ...reviewFormType]
					}
				}

				return formArr
			},
			rules() {
				return this.formType === 'review' ? this.reviewRules : this.baseRules
			},
			baseRules() {
				return {
					companyName: [{
						required: true,
						message: '请输入公司名称',
						trigger: 'blur'
					}],
					socialCreditCode: [{
							required: true,
							message: '请输入统一社会信用代码',
							trigger: 'blur'
						},
						{
							validator: validateSocialCode,
							trigger: 'blur'
						}
					],
					companyArea: [{
						type: 'array',
						required: true,
						message: '请选择公司地区',
						trigger: 'change'
					}],
					legalPerson: [{
							required: true,
							message: '请输入法人姓名',
							trigger: 'blur'
						},
						{
							validator: validateZhEnNum,
							trigger: 'blur'
						}
					],
					legalPersonIdCard: [{
							required: true,
							message: '请输入法人身份证号',
							trigger: 'blur'
						},
						{
							validator: validateIdCard,
							trigger: 'blur'
						}
					],
					businessLicense: [{
						required: true,
						message: '请上传营业执照',
						trigger: 'blur'
					}],
					contact: [{
							required: true,
							message: '请输入联系人姓名',
							trigger: 'blur'
						},
						{
							validator: validateZhEnNum,
							trigger: 'blur'
						}
					],
					phone: [{
							required: true,
							message: '请输入联系方式',
							trigger: 'blur'
						},
						{
							validator: validatePhone,
							trigger: 'blur'
						}
					],
					mail: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: validateEmail,
							trigger: 'blur'
						}
					],
					roleName: [{
						required: true,
						message: '请选择角色权限',
						trigger: 'change'
					}],
					companyProp: [{
						required: true,
						message: '请选择单位性质',
						trigger: 'change'
					}],
					companyType: [{
						required: true,
						message: '请选择单位类型',
						trigger: 'change'
					}],
					address: [{
						required: true,
						message: '请输入公司地址',
						trigger: 'blur'
					}],
					zipCode: [{
						required: true,
						message: '请输入邮编',
						trigger: 'blur'
					}],
					// otherMaterial: [{ required: true, message: '请选择补充材料', trigger: 'blur' }],
					personIdCard: [{
							required: true,
							message: '请输入联系人身份证号',
							trigger: 'blur'
						},
						{
							validator: validateIdCard,
							trigger: 'blur'
						}
					]
				}
			},
			reviewRules() {
				return {
					approveResult: [{
						required: true,
						message: '请选择审核结果',
						trigger: 'change'
					}],
					approveRemark: [{
						required: true,
						message: '请填写审核备注',
						trigger: 'change'
					}]
				}
			},
			notEditable() {
				return this.formType === 'review'
			},
			// 修改 或 审核 时显示
			isShowApproveResult() {
				return this.formType === 'review' || this.formType === 'edit'
			},
			isShowApproveRemark() {
				return this.isShowApproveResult && this.form.approveResult === 0
			}
		},
		created() {
			let orgInfo = JSON.parse(window.sessionStorage.getItem('orgInfo'))

			this.orgInfo = orgInfo
			this.initForm()
			//if (this.id) this.getDetail()
		},
		mounted() {
			this.loginVal = JSON.parse(window.sessionStorage.getItem('loginVal'))
		},
		methods: {
			choose(orgInfo:any) {
				if (orgInfo.userType == '1' || orgInfo.userType == null) {
					this.form = {
						roleName: null,
						companyName: '',
						companyProp: '',
						companyType: null,
						socialCreditCode: '',
						companyArea: null,
						address: '',
						legalPerson: '',
						legalPersonIdCard: '',
						contact: '',
						personIdCard: '',
						phone: '',
						zipCode: '',
						mail: '',
						businessLicense: '',
						otherMaterial: '',
						approveResult: '',
						approveRemark: ''
					}
				} else if (orgInfo.userType == '2') {
					this.form = {
						roleName: null,
						companyName: '',
						contact: '',
						personIdCard: '',
						phone: '',
						approveResult: '',
						approveRemark: ''
					}
				}
			},
			download(file:any) {
				if (file) {
					const endPre = file.substring(file.indexOf('.'), file.length)
					let type = 'application/pdf'
					if (endPre.includes('.jpg')) {
						type = 'image/jpg'
					} else if (endPre.includes('.jpeg')) {
						type = 'image/jpeg'
					} else if (endPre.includes('.png')) {
						type = 'image/png'
					} else {
						type = 'application/pdf'
					}
					let oReq = new XMLHttpRequest()
					oReq.open('POST', baseURL + '/api/common/oss/getOssImageUrls', true)
					oReq.responseType = 'blob'
					oReq.setRequestHeader('Authorization', app.ls.get(accessToken))
					oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

					oReq.onload = function() {
						let file1 = new Blob([oReq.response], {
							type: type
						})

						if ('msSaveBlob' in navigator) {
							return (<any>navigator).msSaveBlob(file1, file)
						}

						window.open(window.URL.createObjectURL(file1))
					}
					oReq.send(
						JSON.stringify({
							urls: [file]
						})
					)
				}
			},
			// 获取机构详情
			getDetail() {
				this.loading = true
				let detail;
				api.company
					.baseInfoCompany({
						id: this.id
					})
					.then((res:any) => {
						let val = {
							...res
						}
						if (val && Object.keys(val).length) {
							if (this.formType === 'review' && val.approveType === 3) {
								// 机构修改审核 时详情使用 approveParam
								this.approveType = val.approveType
								detail = {
									type: this.orgTypeVal,
									...JSON.parse(val.approveParam),
									roleName: val.roleName
								}
							} else {
								detail = val
							}
							this.initForm()
						}
					})
					.finally(() => {
						this.loading = false
					})
			},
			initForm():void {
				for (const key in this.form) {
					if (key === 'type') {
						this.form.type = +this.detail.type
						continue
					}

					if (key === 'companyArea' || key === 'companyType') {
						if (this.detail[key]) this.form[key] = this.detail[key].split(',')
						continue
					}

					// 审核时无需填充审核信息
					if ((key === 'approveResult' || key === 'approveRemark') && this.formType === 'review') {
						continue
					}

					if (key in this.detail) {
						this.form[key] = this.detail[key]
					}
				}
			},
			// 格式化form参数
			getParams() {
				let params = <any>{}
				for (const key in this.form) {
					if ((key === 'approveResult' || key === 'approveRemark') && this.formType !== 'review') continue

					if (key === 'companyArea') {
						params[key] = this.form[key].join(',')
						continue
					}

					if (key === 'annual') {
						let annual = this.form[key]
						if (annual || !isNaN(annual)) {
							annual = annual * 100
						}

						params[key] = annual
						continue
					}

					params[key] = this.form[key]
				}

				return params
			},
			submitForm() {
				return
				(<any>this.$refs.editForm).validate((valid:any) => {
					if (!valid) return false

					if (this.formType === 'review') this.review()
					else this.edit()
				})
			},
			// 修改
			edit() {
				return
				let params = this.getParams()

				this.loading = true
				// if (this.loginVal.userType == 1) {
				//   if (params.companyType != null && params.companyType != '') {
				//     params.companyType = params.companyType.join(',')
				//   }
				// }
				if (this.formType === 'edit' && params.companyType != null && params.companyType != '') {
					params.companyType = params.companyType.join(',')
				}

				api.company
					.updateCompany({
						id: this.id,
						...params
					})
					.then((res:any) => {
						(<any>this).$message.success('修改成功')
						this.$emit('close', true)
					})
					.finally(() => {
						this.loading = false
					})
			},
			// 审核
			review() {
				return
				this.loading = true

				let apiName = 'checkCompany'
				if (this.approveType === 3) {
					apiName = 'auditUpdateCompany'
				}

				api.company[apiName]({
						id: this.id,
						annual: this.form.annual * 100,
						approveResult: this.form.approveResult,
						approveRemark: this.form.approveRemark
					})
					.then((res:any) => {
						(<any>this).$message.success('审核成功')
						this.$emit('close', true)
					})
					.finally(() => {
						this.loading = false
					})
			},
			/**
			 * 上传成功
			 * @param {Object} data 上传结果
			 */
			onUploadSuccess1(data:any) {
				return
				this.form.businessLicense = data
				(<any>this.$refs.editForm).validateField('businessLicense')
			},
			onUploadSuccess2(data:any) {
				return
				this.form.otherMaterial = data
				(<any>this.$refs.editForm).validateField('otherMaterial')
			},
			resetForm() {
				return
				if (this.formType === 'review') {
					this.form.annual = undefined
					this.form.approveResult = undefined
					this.form.approveRemark = ''
				} else {
					(<any>this.$refs.editForm).resetFields()
					this.$refs.cUpload && (<any>this.$refs.cUpload)[0].reset()

					this.$nextTick(() => {
						if (this.formType === 'edit') {
							this.initForm();
							(<any>this.$refs.editForm).validateField('businessLicense')
						}
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.org-form {
		.empty-item {
			height: 40px;
			line-height: 40px;
		}
	}
</style>
