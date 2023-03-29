import request from '@/utils/request'
const obj:any = {}

/**
 * 文件下载
 * @method
 * @name download
 * @param {} fileQueryDto -fileQueryDto
 */
obj.download=function(data:any) {
  return request({
    url: '/api/common/download',
    method: 'post',
    data
  })
}

/**
 * 获取验证码
 * @method
 * @name getValidCode

 */
obj.getValidCode=function(data:any) {
  return request({
    url: '/api/common/getValidCode',
    method: 'post',
    data
  })
}

/**
 * 文件上传
 * @method
 * @name upload
 * @param {file} file -file
 */
obj.upload=function(data:any) {
  return request({
    url: '/api/common/upload',
    method: 'post',
    data
  })
}

export default obj