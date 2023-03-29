<template>
	<div>
		<a-form ref="editForm" :model="form" :label-col="{span: 6}" :wrapper-col="{span: 16}" :rules="rules">
			<a-form-item name="username" required label="用户名" validateFirst>
				<a-input v-model:value="form.username" placeholder="请输入用户名" />
			</a-form-item>
			<a-form-item required name="contactWay" label="手机号" validateFirst>
				<a-input v-model:value="form.contactWay" placeholder="请输入手机号" />
			</a-form-item>
			<a-form-item label="验证码" name="smsCode" required validateFirst>
				<a-input v-model:value="form.smsCode" placeholder="请输入验证码" autocomplete>
					<template #addonAfter>
						<a-button class="code-c"
							:disabled="form.contactWay == '' || form.contactWay == undefined || disBut"
							@click="setTime"> {{ disBut ? sTime + '后' : '' }}发送验证码 </a-button>
					</template>
				</a-input>
			</a-form-item>
			<a-form-item required name="password" label="新密码" validateFirst>
				<a-input-password v-model:value="form.password" placeholder="请输入新密码" autocomplete/>
			</a-form-item>
			<a-form-item required name="confirmpwd" label="确认新密码" validateFirst>
				<a-input-password v-model:value="form.confirmpwd" placeholder="请确认新密码" autocomplete/>
			</a-form-item>
		</a-form>
		<div class="model-footer">
			<a-space size="large">
				<a-button @click="close">
					取消
				</a-button>
				<a-button :disabled="!form.phone || !form.code || !form.password || !form.username" type="primary"
					@click="handleOk">
					确定
				</a-button>
			</a-space>
		</div>
	</div>
</template>
<script lang="ts">
	import {
		rules
	} from './modalValidate'
	import Base64JS from "base-64";
	import {
		companyType
	} from '@/utils/typeEnum'
	import api from '@/api'
	import {
		inject,
		ref,
		reactive
	} from 'vue'

	export default {
		setup(props, ctx) {
			const visible:any = inject('visible')
			const loading = ref(false)
			const sTime = ref(60)
			const disBut = ref(false)
			let setIn:any = null
			const form:any = reactive({
				username: '',
				password: '',
				confirmpwd: '',
				contactWay: '',
				smsCode: ''
			})

			function close() {
				visible.value = false
			}
			// VUE3中模板使用ref获取el对象
			const editForm = ref()

			function setTime() {
				editForm.value.validateFields('contactWay').then(() => {
					getCaptchaCode()
				})
			}
			async function getCaptchaCode() {
				if (disBut.value) return
				// const res = await api.sms.send({
				// 	phone: form.contactWay,
				// 	type: 4
				// })
				const res = true
				if (!res) return
				disBut.value = true
				setIn = setInterval(() => {
					if (sTime.value === 0) {
						sTime.value = 60
						disBut.value = false
						return clearInterval(setIn)
					}
					sTime.value--
				}, 1000)
			}
			const $message:any = inject('$message')

			function handleOk() {
				editForm.value.validate().then(() => {
					let newform = {
						...form
					}
					newform.password = Base64JS.encode(newform.password)
					newform.confirmpwd = Base64JS.encode(newform.confirmpwd)
					$message.success('密码重置成功, 请等待管理员审核')

					// api.sms.updatePassword({
					// 		...newform
					// 	})
					// 	.then(res => {
					// 		$message.success('密码重置成功, 请等待管理员审核')
					// 	})
				}).catch((e:any) => {
					return Promise.resolve()
				})
			}

			return {
				loading,
				form,
				setIn: ref(null),
				disBut,
				sTime,
				close,
				handleOk,
				setTime,
				rules: rules(editForm, form),
				editForm
			}
		}
	}
</script>

<style lang="less" scoped>
	:deep(.ant-form-vertical .ant-form-item) {
		padding-bottom: 0;
	}

	.code-c {
		width: 100px;
		height: 30px;
		background: transparent;
		border: none;
		text-align: center;
		padding: 0;
	}
</style>
