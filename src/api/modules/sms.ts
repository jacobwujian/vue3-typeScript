import request from '@/utils/request'
const obj:any = {}

/**
 * 发送验证码
 * @method
 * @name send
 * @param {string} phone -手机号码不能为空
 * @param {string} type -验证码发送类型:0 忘记密码 1 购买绿证 2 充值 3 提现
 * @param {string} username -登录用户名 -> 忘记密码时发送验证码传
 * @param {string} payPassword -支付密码 -> 购买绿证时发送验证码传
 */
obj.send=function(params:any) {
  return request({
    url: '/api/sms/send',
    method: 'get',
    params
  })
}

/**
 * 忘记密码
 * @method
 * @name updatePassword
 * @param {} smsPasswordDto -smsPasswordDto
 */
obj.updatePassword=function(data:any) {
  return request({
    url: '/api/sms/updatePassword',
    method: 'post',
    data
  })
}

export default obj