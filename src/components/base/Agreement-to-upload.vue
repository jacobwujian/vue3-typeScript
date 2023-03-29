<template>
  <a-upload class="c-upload" :action="action" :before-upload="beforeUpload" :file-list="fileList" :disabled="disabled" :multiple="multiple" @change="handleUploadChange">
    <slot name="upload">
      <a-button> <a-icon type="upload" /> 上传 </a-button>
    </slot>

    <slot name="tip">
      <span class="upload-tip"> 支持文件格式：全部，文件不能超过{{ fileSize }}MB </span>
    </slot>
  </a-upload>
</template>

<script>
export default {
  props: {
    // 地址
    action: {
      type: String,
      default: function() {
        return this.$api.login.uploadOSS()
      }
    },
    // 更改每个文件上传大小限制
    fileSize: {
      type: Number,
      default: 1
    },
    // 控制上传文件类型
    // fileType: {
    //   type: Array,
    //   default: () => ['image/jpg', 'image/jpeg', 'image/png']
    // },
    // 上传类型
    // fileSuffix: {
    //   type: Array,
    //   default: () => ['jpg', 'jpeg', 'png']
    // },
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
      default: true
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
      flag: true,
      // 传个数组出去
      files: []
    }
  },
  computed: {
    // 上传类型
    // accept() {
    //   return this.fileType.join(',')
    // }
    // fileTypeStr() {
    //   let str = ''
    //   for (const item of this.fileSuffix) {
    //     str += `.${item} `
    //   }
    //   return str
    // }
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
      // 更改上传文件个数限制
      fileList = fileList.slice(-5)
      fileList = fileList.map(file => {
        if (file.response) {
          this.$emit('on-success', file.response.data)
        }
        return file
      })
      this.files = this.fileList
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
      // const isJpgOrPng = this.fileSuffix.includes(suffix[1])

      // 不做文件格式限制
      // if (!isJpgOrPng) {
      //   this.$message.error(`请上传${this.fileTypeStr}格式文件`)
      // }

      const isLt2M = file.size / 1024 / 1024 < this.fileSize
      if (!isLt2M) {
        this.$message.error(`文件不能超过 ${this.fileSize}MB`)
        this.flag = false
      }

      if (!this.isAutoUpload) {
        this.$emit('on-file', file)
      }
      // 不做全部清空
      // if (this.fileList.length > 0) {
      //   this.delFileInOSS(this.fileList[0], 'replace')
      // }
      return this.flag
    },
    getFileUrl(fileId) {
      if (fileId) {
        this.$api.ossCommon
          .ossgetOssImageUrls({
            urls: [fileId]
          })
          .then(res => {
            if (!res || !res.length) return false

            if (this.fileList.length > 0) {
              this.$set(this.fileList[0], 'url', res[0])
            } else {
              this.fileList = [
                {
                  uid: fileId,
                  name: fileId,
                  url: res[0]
                }
              ]
            }
          })
      }
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
