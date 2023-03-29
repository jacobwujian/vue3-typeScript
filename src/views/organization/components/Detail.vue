<template>
	<div class="org-detail">
		<template v-for="(item, index) in tempDetail" :key="index">
			<a-descriptions :title="item.title">
				<a-descriptions-item v-for="(child, i) in item.children" :key="`${index}-${i}`" :label="child.label">
					<template v-if="child.dataSource && detail[child.key] !== null">
						{{ EnumMap(child.dataSource, +detail[child.key]) }}
					</template>
					<template v-else-if="child.type === 'areas'">
						{{ codeToText(detail[child.key]) }}
					</template>
					<template v-else-if="child.type === 'companyType' && orgInfo.type == 1">
						{{ companyTypeCodeToText(detail[child.key]) }}
					</template>
					<template
						v-if="child.type === 'companyType' && orgInfo.type == 2 && child.data && detail[child.key] !== null">
						{{ EnumMap(child.data, detail[child.key]) }}
					</template>
					<template v-else-if="child.type === 'precisionNum'">
						{{ (detail[child.key] || 0) / 100 }}
					</template>
					<span v-else-if="child.key != 'companyType' || child.key != 'companyProp'" class="breakText">
						{{ child.key == 'companyType' ? null : child.key == 'companyProp' ? null : child.key == 'companyArea' ? null : child.key == 'approveResult' ? null : detail[child.key] }}

						<template v-if="detail[child.key] && child.unit">
							{{ child.unit }}
						</template>
						<a-button
							v-if="(child.key === 'businessLicense' || child.key === 'otherMaterial') && detail[child.key]"
							type="link" @click="download(detail[child.key])">
							下载
						</a-button>
					</span>
				</a-descriptions-item>
			</a-descriptions>
			<a-divider />
		</template>


		<a-row class="btns-row">
			<a-col class="text-center">
				<a-space size="large">
					<a-button type="primary" @click="$emit('close')">
						返回
					</a-button>
				</a-space>
			</a-col>
		</a-row>
	</div>
</template>

<script lang="ts">
	import {
		orgTypes,
		reviewType,
		EnumMap,
		companyProp,
		companyTypeCodeToText,
		companyType2
	} from '@/utils/typeEnum'
	import {
		codeToText
	} from '@/utils/cascader-address-options'
	import {
		baseURL,
		accessToken
	} from '@/utils/constant'
	import app from '@/main'
	import api from '@/api'
	export default {
		props: {
			id: {
				type: String,
				default: ''
			},
			detail: {
				type: Object,
				default: () => <any>{}
			}
		},
		data() {
			return {
				companyTypeCodeToText,
				orgTypes,
				reviewType,
				EnumMap,
				codeToText,
				detailItems2: null,
				tempDetail: <any>[],
				detailItems: null,
				companyProp,
				orgInfo: <any>{}
			}
		},
		created() {},
		mounted() {
			let orgInfo = JSON.parse(app.ls.get('orgInfo'))
			this.orgInfo = orgInfo
			this.choose(orgInfo)
		},
		methods: {
			choose(orgInfo:any) {
				if (orgInfo.userType == '1' || orgInfo.userType == null) {
					// 企业
					let detailItems1 = [{
							title: '基础信息',
							children: [{
									key: 'roleName',
									label: '角色权限'
								},
								{
									key: 'companyName',
									label: '机构名称'
								},
								{
									key: 'companyProp',
									label: '单位性质',
									dataSource: companyProp
								},
								{
									key: 'companyType',
									label: '单位类型',
									type: 'companyType',
									data: companyType2
								},
								{
									key: 'socialCreditCode',
									label: '统一社会信用代码'
								},
								{
									key: 'companyArea',
									label: '单位注册地区',
									type: 'areas'
								},
								{
									key: 'address',
									label: '公司地址'
								},
								{
									key: 'legalPerson',
									label: '法人姓名'
								},
								{
									key: 'legalPersonIdCard',
									label: '法人身份证号码'
								},
								{
									key: 'contact',
									label: '联系人名称'
								},
								{
									key: 'personIdCard',
									label: '联系人身份证'
								},
								{
									key: 'phone',
									label: '联系人电话'
								},
								{
									key: 'zipCode',
									label: '邮编'
								},
								{
									key: 'mail',
									label: '电子邮件'
								},
								{
									key: 'businessLicense',
									label: '营业执照/事业单位法人证书'
								},
								{
									key: 'otherMaterial',
									label: '信息填报授权书'
								}
							]
						},
						{
							title: '区块链身份信息',
							children: [{
									key: 'chainId',
									label: '账户ID'
								},
								{
									key: 'publicKeyAddress',
									label: '公钥地址'
								},
								{
									key: 'chainAddress',
									label: '身份合约地址'
								}
							]
						}
					]
					if (orgInfo.status != 0) {
						detailItems1.push({
							title: '审核信息',
							children: [{
									key: 'approveResult',
									label: '审核结果',
									dataSource: reviewType
								},
								{
									key: 'approveRemark',
									label: '审核备注'
								}
							]
						})
					}
					this.tempDetail = detailItems1
				} else if (orgInfo.userType == '2') {
					// 个人
					let detailItems2 = <any>[{
							title: '基础信息',
							children: [{
									key: 'roleName',
									label: '角色权限'
								},
								{
									key: 'companyName',
									label: '机构名称'
								},
								{
									key: 'contact',
									label: '联系人名称'
								},
								{
									key: 'personIdCard',
									label: '联系人身份证'
								},
								{
									key: 'phone',
									label: '联系人电话'
								}
							]
						},
						{
							title: '区块链身份信息',
							children: [{
									key: 'chainId',
									label: '账户ID'
								},
								{
									key: 'publicKeyAddress',
									label: '公钥地址'
								},
								{
									key: 'chainAddress',
									label: '身份合约地址'
								}
							]
						}
					]
					if (orgInfo.status != 0) {
						detailItems2.push({
							title: '审核信息',
							children: [{
									key: 'approveResult',
									label: '审核结果',
									dataSource: reviewType
								},
								{
									key: 'approveRemark',
									label: '审核备注'
								}
							]
						})
					}
					this.tempDetail = detailItems2
				}
			},
			getDetail() {
				api.company
					.baseInfoCompany({
						id: this.id
					})
					.then((res:any) => {
						let val = {
							...res
						}
						// val.companyType = val.companyType.split(',')
						if (val && Object.keys(val).length) {
							
						}
					})
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
							// ie浏览器兼容
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
			}
		}
	}
</script>
