<template>
	<div class="statistical-form-wrap">
		<a-form ref="form" :model="form" v-bind="formItemLayout">
			<template v-for="(val, index) of formItems">
				<a-row v-if="val && val.list" :key="`form-label-${index}`">
					<a-col v-bind="formItemLayout.labelCol" class="ant-form-item-label" />
					<a-col v-bind="formItemLayout.wrapperCol" class="ant-form-item-control-wrapper">
						<a-row :gutter="16">
							<a-col v-for="(v, i) of val.list" :key="`label-${index}-${i}`" :span="val.colSpan"
								class="font-bold text-center">
								{{ v }}
							</a-col>
						</a-row>
					</a-col>
				</a-row>
				<a-form-item v-else :key="`form-item-${index}`" :label="val.label">
					<template v-if="val && val.children">
						<a-row :gutter="16">
							<a-col v-for="(v, i) of val.children" :key="`input-${index}-${i}`" :span="v.colSpan">
								<a-input disabled v-if="v.type === 'input'" v-model:value.trim="form[val.params][v.params]" />
							</a-col>
						</a-row>
					</template>
					<template v-else>
						<a-input disabled v-if="val.type === 'input'" v-model:value.trim="form[val.params]" />

						<a-textarea disabled v-if="val.type === 'textarea'" v-model:value.trim="form[val.params]"
							:auto-size="{ minRows: 3, maxRows: 5 }" />

						<a-input-number disabled v-if="val.type === 'inputNumber'" v-model:value="form[val.params]" :min="1"
							:precision="0" />

						<div v-if="val && val.tips" class="tips text-gray fs-12">
							{{ val.tips }}
						</div>
					</template>
				</a-form-item>
			</template>
		</a-form>
	</div>
</template>

<script>
	const formItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 20
		}
	}

	export default {
		name: 'ScreenFormItem',
		props: {
			formItems: {
				type: Array,
				default: () => ([])
			},
			formData: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				formItemLayout,
				form: {}
			}
		},
		watch: {
			formData() {
				this.initForm()
			}
		},
		created() {
			this.initForm()
		},
		methods: {
			// 初始化 Form
			initForm() {
				const formItems = this.formItems
				for (const item of formItems) {
					// 除去标签
					if (item.type === 'labels') continue

					if (!item.children) {
						this.form[item.params] = ''
						// 填充数据
						if (this.formData && this.formData[item.params]) {
							this.form[item.params] = this.formData[item.params]
						}
						continue
					}
					this.form[item.params] = {}
					for (const it of item.children) {
						this.form[item.params][it.params] = ''
						// 填充数据
						if (
							this.formData &&
							this.formData[item.params] &&
							this.formData[item.params][it.params]
						) {
							this.form[item.params][it.params] = this.formData[item.params][it.params]
						}
					}
				}
			}
		}
	}
</script>

<style lang='less' scoped>
	.statistical-form-wrap {
		.form-title {
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 30px;
		}

		.tips {
			line-height: 20px;
		}

		/deep/.ant-form-item-label {
			min-width: 80px;
		}
	}
</style>
