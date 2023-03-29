<!-- 详情 -->
<template>
	<div>
		<div v-for="(lItem, lIndex) in form" :key="lIndex">
			<a-descriptions :title="lItem.title" :column="lItem.children ? 1 : column || 3" :layout="type">
				<template v-if="lItem.children">
					<a-descriptions-item v-for="(sItem, index) in lItem.children" :key="index">
						<a-descriptions :title="sItem.title" :layout="type">
							<a-descriptions-item v-for="(ssItem, ssIndex) in sItem.list" :key="ssIndex + lIndex"
								:label="ssItem.label">
								<Star v-if="ssItem.type === 'rate'" :count="ssItem.value" />

								<template v-else-if="ssItem.type === 'area'">
									<span class="breakText">{{ codeToText(ssItem.value) }}</span>
								</template>
								<template v-else-if="ssItem.type === 'precisionNum'">
									{{ (ssItem.value || 0) / 100 }}
								</template>
								<span v-else class="breakText">{{ ssItem.value }}</span>
								<template v-if="ssItem.value && ssItem.unit">
									{{ ssItem.unit }}
								</template>
							</a-descriptions-item>
						</a-descriptions>
					</a-descriptions-item>
				</template>
				<template v-else>
					<a-descriptions-item v-for="(sItem, sIndex) in lItem.list" :key="sIndex + lIndex"
						:label="sItem.key.includes('approve') || sItem.key.includes('fileInfos') ? '' : sItem.label">
						<Star v-if="sItem.type === 'rate'" :count="sItem.value" />
						<template v-else-if="sItem.type === 'area'">
							<span class="breakText">{{ codeToText(sItem.value) }}</span>
						</template>
						<template v-else-if="sItem.type === 'precisionNum'">
							{{ (sItem.value || 0) / 100 }}
						</template>
						<template v-else-if="sItem.type === 'approveRemark'">
							<a-form-model ref="approveRemarkRef" :model="sItem">
								<a-form-model-item prop="value" label="审核备注" :rules="reviewRules1.value">
									<a-textarea v-model.trim="sItem.value" property="approveRemark"
										:disabled="sItem.formType !== 'review'" :auto-size="{ minRows: 3, maxRows: 5 }"
										placeholder="请输入审核备注" />
								</a-form-model-item>
							</a-form-model>
						</template>
						<template v-else-if="sItem.type === 'radio'">
							<a-form-model ref="valueRef" :model="sItem">
								<a-form-model-item prop="value" label="审核结果" :rules="reviewRules.value">
									<a-radio-group v-model="sItem.value" :disabled="sItem.formType !== 'review'">
										<a-radio v-for="(op, i) in sItem.dataSource" :key="`${i}-${op.value}`"
											:value="op.value">
											{{ op.name }}
										</a-radio>
									</a-radio-group>
								</a-form-model-item>
							</a-form-model>
						</template>
						<template v-else-if="sItem.type === 'fileInfos'">
							<a-form-model-item label="协议与付款凭证:">
								<p v-for="item in sItem.value" :key="item.id">
									<span>{{ item.fileName }}</span>
									<a-button type="link" @click="download(item)">
										下载
									</a-button>
								</p>
							</a-form-model-item>
						</template>
						<span v-else class="breakText">{{ sItem.value }}</span>
						<template v-if="sItem.value && sItem.unit">
							{{ sItem.unit }}
						</template>
					</a-descriptions-item>
				</template>
			</a-descriptions>
			<a-divider v-if="!hidedivider" />
		</div>
	</div>
</template>

<script>
	import Star from '@/components/base/c-star.vue'
	import {
		codeToText
	} from '@/utils/cascader-address-options'
	import {
		getCurrentInstance
	} from 'vue'
	import {
		baseURL,
		accessToken
	} from '@/utils/constant'
	export default {
		components: {
			Star
		},
		props: {
			form: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'horizontal'
			},
			column: {
				type: Number,
				default: 0
			},
			hidedivider: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				codeToText,
				reviewRules: {
					value: [{
						required: true,
						message: '请选择审核结果',
						trigger: 'change'
					}]
				},
				reviewRules1: {
					value: [{
						required: true,
						message: '请输入审核备注',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			onUploadSuccess() {},
			download(file) {
			const app =	getCurrentInstance().appContext
				if (file) {
					const endPre = file.fileCode.substring(file.fileCode.indexOf('.'), file.fileCode.length)
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

						if (navigator.msSaveBlob) {
							return navigator.msSaveBlob(file1, file.fileCode)
						}

						window.open(window.URL.createObjectURL(file1))
					}
					oReq.send(
						JSON.stringify({
							urls: [file.fileCode]
						})
					)
				}
			}
		}
	}
</script>
