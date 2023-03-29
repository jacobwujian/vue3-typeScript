import request from '@/utils/request'
const obj:any = {}

/**
 * 买方注册
 * @method
 */
obj.submitBuyerRegister = function(data:any) {
  return request({
    url: '/api/register/submitBuyerRegister',
    method: 'post',
    data,
    domain: 'wx'
  })
}
/**
 * 卖方注册
 * @method
 */
obj.submitSellerRegister = function(data:any) {
  return request({
    url: '/api/register/submitSellerRegister',
    method: 'post',
    data,
    domain: 'wx'
  })
}

/**
 * 账户明细
 * @method
 * @name accountDetail

 */
obj.accountDetail = function(params:any) {
  return request({
    url: '/api/user/accountDetail',
    method: 'get',
    params,
    domain: 'wx'
  })
}

/**
 * 通过用户UsrId 获取用户信息
 * @method
 * @name findUserById
 * @param {} id -id
 */
obj.findUserById = function(params:any) {
  return request({
    url: '/api/user/findUserById',
    method: 'get',
    params,
    domain: 'wx'
  })
}

/**
 * 注销登录
 * @method
 * @name logout
 */
obj.logout = function() {
  return request({
    url: '/api/loginOut/loginOut',
    method: 'get',
    domain: 'wx'
  })
}

/**
 * 用户注册
 * @method
 * @name registerUser
 * @param {} registerUserDto -registerUserDto
 */
obj.registerUser = function(data:any) {
  return request({
    url: '/api/user/registerUser',
    method: 'post',
    data,
    domain: 'wx'
  })
}

/**
 * 查询用户列表
 * @method
 * @name selectList

 */
obj.selectList = function(params:any) {
  return request({
    url: '/api/user/selectList',
    method: 'get',
    params,
    domain: 'wx'
  })
}

/**
 * 更改密码
 * @method
 * @name updatePassword
 * @param {} updatePasswordDto -updatePasswordDto
 */
obj.updatePassword = function(params) {
  return request({
    url: '/api/user/updatePassword',
    method: 'get',
    params,
    domain: 'wx'
  })
}

export default obj
