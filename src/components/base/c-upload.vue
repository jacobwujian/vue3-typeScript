<template>
	<a-upload class="c-upload" :action="action" :accept="accept" :before-upload="beforeUpload" :file-list="fileList"
		:disabled="disabled" :multiple="multiple" :remove="delFileInOSS" @change="handleUploadChange">
		<slot name="upload">
			<a-button>
				<a-dayjs type="upload" /> 上传
			</a-button>
		</slot>

		<slot name="tip">
			<span class="upload-tip"> 支持文件格式：{{ fileTypeStr == '' ? '全部' : fileTypeStr }}，文件不能超过{{ fileSize }}MB </span>
		</slot>
	</a-upload>
</template>

<script>
	import api from '@/api'

	export default {
		props: {
			action: {
				type: String,
				default: function() {
					return api.login.uploadOSS()
				}
			},
			fileSize: {
				type: Number,
				default: 5
			},
			fileType: {
				type: Array,
				default: () => ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG']
			},
			fileSuffix: {
				type: Array,
				default: () => ['jpg', 'jpeg', 'png']
			},
			fileSuffix1: {
				type: Array,
				default: () => ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']
			},
			isAutoUpload: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			multiple: {
				type: Boolean,
				default: false
			},
			fileId: {
				type: String,
				default: ''
			},
			fileRemove: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				fileList: [],
				flag: true
			}
		},
		computed: {
			accept() {
				return this.fileType.join(',')
			},
			fileTypeStr() {
				let str = ''
				for (const item of this.fileSuffix) {
					str += `.${item} `
				}
				return str
			}
		},
		watch: {
			fileId: {
				handler(newVal) {
					if (newVal) this.getFileUrl(newVal)
				},
				immediate: true
			}
		},
		methods: {
			/**
			 * 上传触发
			 * @param {Object} info 上传信息
			 */
			handleUploadChange(info) {
				if (!this.flag) return
				let fileList = [...info.fileList]
				fileList = fileList.slice(-1)
				fileList = fileList.map(file => {
					if (file.response) {
						this.$emit('on-success', file.response.data)
					}
					return file
				})
				// 上传成功删除fileList
				if (this.fileRemove) return (this.fileList = [])
				this.fileList = fileList
			},
			/**
			 * 上传检验
			 * @param {Object} file 文件信息
			 */
			beforeUpload(file) {
				const pattern = /\.{1}([A-Za-z]{1,})$/
				const suffix = pattern.exec(file.name)
				const isJpgOrPng = this.fileSuffix1.includes(suffix[1])

				if (this.fileSuffix1.length != 0) {
					if (!isJpgOrPng) {
						this.$message.error(`请上传${this.fileTypeStr}格式文件`)
					}
				}

				const isLt2M = file.size / 1024 / 1024 < this.fileSize
				if (!isLt2M) {
					this.$message.error(`文件不能超过 ${this.fileSize}MB`)
				}

				if (!this.isAutoUpload) {
					this.$emit('on-file', file)
				}

				if (this.fileList.length > 0) {
					this.delFileInOSS(this.fileList[0], 'replace')
				}
				this.flag = this.fileSuffix1.length == 0 ? isLt2M : isJpgOrPng && isLt2M
				return this.fileSuffix1.length == 0 ? isLt2M && this.isAutoUpload : isJpgOrPng && isLt2M && this
					.isAutoUpload
			},
			getFileUrl(fileId) {
				if (fileId) {
					if (this.fileList.length > 0) {
						this.$set(this.fileList[0])
					} else {
						this.fileList = [{
							uid: fileId,
							name: fileId
						}]
					}
				}
			},
			/**
			 * 删除已存在图片
			 * @param {Object} file 已上传文件信息
			 * @param {String} actionType 操作类型 replace/delete
			 */
			delFileInOSS(file, actionType) {
				// 非自动上传 删除fileList
				if (!this.isAutoUpload) {
					this.fileList = []
					return false
				}

				const fileName = file && file.response && file.response.data

				if (!fileName) return false

				this.$api.ossCommon
					.ossdeleteFile({
						fileName
					})
					.then(res => {
						if (!res) return false

						if (actionType !== 'replace') {
							this.reset()
						}
					})
			},
			reset() {
				this.fileList = []
				this.$emit('on-success', '')
			}
		}
	}
</script>

<style lang="less" scoped>
	.c-upload {
		.upload-tip {
			display: inline-block;
			width: 180px;
			line-height: 22px;
			margin-left: 10px;
			font-size: 12px;
			color: #999;
			vertical-align: middle;
		}
	}
</style>
