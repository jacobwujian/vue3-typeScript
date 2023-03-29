<template>
	<div class="statistical-manage">
		<a-row :gutter="40">
			<a-col class="col-left" :span="8">
				<div class="form-title">
					左上图表信息
				</div>
				<FormItem ref="formLeft" :form-items="leftFormItems" :form-data="leftData && leftData.data" />
			</a-col>
			<a-col class="col-middle" :span="8">
				<div class="form-title">
					中间大图
				</div>
				<FormItem ref="formMiddle" :form-items="middleFormItems" :form-data="middleData && middleData.data" />
			</a-col>
			<a-col class="col-right" :span="8">
				<div class="form-title">
					右上图表信息
				</div>
				<FormItem ref="formRight" :form-items="rightFormItems" :form-data="rightData && rightData.data" />
			</a-col>
		</a-row>

		<a-row>
			<a-col class="text-center pt-50">
				<a-button type="primary" html-type="submit" :loading="loading" @click="submitForm">
					确定
				</a-button>
			</a-col>
		</a-row>
	</div>
</template>

<script>
	import FormItem from './components/FormItem.vue'

	import {
		cityCode
	} from '@/utils/typeEnum'

	const codeArr = ['left', 'middle', 'right']

	export default {
		name: 'StatisticalManage',
		components: {
			FormItem
		},
		data() {
			return {
				loading: false,
				leftData: {},
				middleData: {},
				rightData: {}
			}
		},
		computed: {
			leftFormItems() {
				const items = [{
					type: 'input',
					label: '标题',
					params: 'title'
				}, {
					type: 'textarea',
					label: '说明文字',
					params: 'desc'
				}, { // children 框标签
					type: 'labels',
					colSpan: 8,
					list: ['左边展示', '右边展示（值）', '右边展示（单位）']
				}]

				for (let i = 0; i < 6; i++) {
					items.push({
						label: `展示框${i + 1}`,
						params: `item${i}`,
						children: [{
							type: 'input',
							params: 'name',
							colSpan: 8
						}, {
							type: 'input',
							params: 'value',
							colSpan: 8
						}, {
							type: 'input',
							params: 'unit',
							colSpan: 8
						}]
					})
				}
				return items
			},
			middleFormItems() {
				const items = [{
					type: 'input',
					label: '居中标题',
					params: 'title'
				}, {
					type: 'textarea',
					label: '居中小标题',
					params: 'subtitle'
				}, {
					type: 'inputNumber',
					label: '散点比例',
					params: 'proportion',
					tips: '请输入尽可能大的比例，以避免散点过多无法渲染'
				}, { // children 框标签
					type: 'labels',
					colSpan: 12,
					list: ['非水平价绿电积分数量', '普通绿电积分数量']
				}]

				for (const item of cityCode) {
					items.push({
						label: item.name,
						params: item.value,
						children: [{ // 非水平价绿电积分数量
							type: 'input',
							params: 'unusual',
							colSpan: 12
						}, { // 普通绿电积分数量
							type: 'input',
							params: 'usual',
							colSpan: 12
						}]
					})
				}

				return items
			},
			rightFormItems() {
				const items = [{
					type: 'input',
					label: '标题',
					params: 'title'
				}, { // children 框标签
					type: 'labels',
					colSpan: 8,
					list: ['左边展示', '右边展示（值）', '右边展示（单位）']
				}]

				for (let i = 0; i < 3; i++) {
					items.push({
						label: `展示框${i + 1}`,
						params: `item${i}`,
						children: [{
							type: 'input',
							params: 'name',
							colSpan: 8
						}, {
							type: 'input',
							params: 'value',
							colSpan: 8
						}, {
							type: 'input',
							params: 'unit',
							colSpan: 8
						}]
					})
				}
				return items
			}
		},
		created() {
			this.findStatisticsManageList()
		},
		methods: {
			submitForm() {
				if (this.leftData && this.leftData.id) {
					this.updateStatisticsManage()
				} else {
					this.addStatisticsManage()
				}
			},
			// 新增
			addStatisticsManage() {
				return
				this.loading = true
				this.$api.statisticsManage.addStatisticsManage(this.getPostData())
					.then(res => {
						if (res) {
							this.$message.success('新增数据成功')
						}
					}).finally(() => {
						this.loading = false
					})
			},
			// 修改
			updateStatisticsManage() {
				return
				this.loading = true
				this.$api.statisticsManage.updateStatisticsManage(this.getPostData())
					.then(res => {
						if (res) {
							this.$message.success('修改数据成功')
						}
					}).finally(() => {
						this.loading = false
					})
			},
			// 格式化提交参数
			getPostData() {
				let arr = [{
					id: this.leftData && this.leftData.id,
					code: 'left',
					name: '左',
					manageType: 11,
					data: JSON.stringify(this.$refs.formLeft.form)
				}, {
					id: this.middleData && this.middleData.id,
					code: 'middle',
					name: '中',
					manageType: 12,
					data: JSON.stringify(this.$refs.formMiddle.form)
				}, {
					id: this.rightData && this.rightData.id,
					code: 'right',
					name: '右',
					manageType: 13,
					data: JSON.stringify(this.$refs.formRight.form)
				}]

				return arr
			},
			// 获取
			findStatisticsManageList() {
				return
				this.$api.statisticsManage.findStatisticsManageList()
					.then(res => {
						if (!res || !res.length) return false

						for (const item of res) {
							if (!codeArr.includes(item.code) || !item.data) {
								continue
							}

							this[`${item.code}Data`] = {
								id: item.id,
								data: JSON.parse(item.data)
							}
						}
					})
			}
		}
	}
</script>

<style lang='less' scoped>
	.statistical-manage {
		height: 100%;
		.form-title {
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 30px;
		}

		.col-middle {
			height: 800px;
			border-left: 1px solid #d3d3d3;
			border-right: 1px solid #d3d3d3;
			overflow-y: scroll;
		}
	}
</style>
