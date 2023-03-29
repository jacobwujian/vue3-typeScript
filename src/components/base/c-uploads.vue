<template>
  <a-upload
    class="c-upload"
    :action="action"
    :accept="accept"
    :before-upload="beforeUpload"
    :file-list="fileListWatch"
    :disabled="disabled"
    :multiple="multiple"
    :remove="delFileInOSS"
    @change="handleUploadChange"
  >
  </a-upload>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      default: function(){
        return this.$api.login.uploadOSS()
      }
    },
    fileSize: {
      type: Number,
      default: 5
    },
    fileType: {
      type: Array,
      default: () => (['image/jpg', 'image/jpeg', 'image/png'])
    },
    fileSuffix: {
      type: Array,
      default: () => (['jpg', 'jpeg', 'png'])
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
      type: Array,
      default: () => []
    },
    fileRemove: {
      type: Boolean,
      default: false
    },
    partName: {
      type: String,
      default: ''
    },
  buttonName: {
    type: String,
    default: ''
  }
  },
  data() {
    return {
      flag: true,
      fileList: []
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
    },
    fileListWatch() {
      return this.fileList
    }
  },
  watch: {
    fileId: {
      handler(newVal) {
        this.getFileUrl(newVal)
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
      if (this.fileList.length === 5) return
      let fileList = [...info.fileList]
      fileList = fileList.map(file => {
        if (file.response) {
          this.$emit('on-success', file.response.data)
        }
        return file
      })
      // 上传成功删除fileList
      if(this.fileRemove) return this.fileList = []
      this.fileList = fileList
    },
    /**
     * 上传检验
     * @param {Object} file 文件信息
     */
    beforeUpload(file) {
      if (this.fileList.length === 5){
        this.$message.error(`最多上传5个附件`)
        return false
      }
      const pattern = /\.{1}([A-Za-z]{1,})$/
      const suffix = pattern.exec(file.name)
      const isJpgOrPng = this.fileSuffix.includes(suffix[1])
      if (!isJpgOrPng) {
        this.$message.error(`请上传${this.fileTypeStr}格式文件`)
      }

      const isLt2M = file.size / 1024 / 1024 < this.fileSize
      if (!isLt2M) {
        this.$message.error(`文件不能超过 ${this.fileSize}MB`)
      }
      if (!this.isAutoUpload) {
        this.$emit('on-file', this.fileList)
      }

      this.flag = isJpgOrPng && isLt2M
      return isJpgOrPng && isLt2M && this.isAutoUpload
    },
    getFileUrl(files) {
      let urls = []
      if (files) {
        for (const item in files){
          urls.push(files[item].fileCode)
        }
        this.$api.ossCommon.ossgetOssImageUrls({
          urls: urls
        }).then(res => {
          if (!res || !res.length) return false
          this.fileList = []
            for (const item in files){
              this.fileList.push({
                uid: files[item].fileCode,
                name: files[item].fileName,
                url: res[item]
              })
            }
        })
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

      this.$api.ossCommon.ossdeleteFile({
        fileName
      }).then(res => {
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
    width: 300px;
    line-height: 22px;
    margin-left: 10px;
    font-size: 12px;
    color: #999;
    vertical-align: middle;
  }
}
</style>
