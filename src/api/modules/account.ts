import request from '@/utils/request'
const obj:any = {}
/**
 * 添加账户
 * @method
 * @name addAccount
 * @param {} addAccountDto -addAccountDto
 */
obj.addAccount=function(data:any) {
  return request({
    url: '/api/account/addAccount',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 通过条件查询账户信息
 * @method
 * @name allAccount
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} realName -用户名称
 * @param {string} username -登录账户
 * @param {integer} status -状态
 * @param {string} createTimeStart -开始时间
 * @param {string} createTimeEnd -结束时间
 * @param {integer} companyId -所属公司
 */
obj.allAccount=function(params:any) {
  return request({
    url: '/api/account/allAccount',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 账户详情
 * @method
 * @name baseInfoAccount
 * @param {integer} id -id
 */
obj.baseInfoAccount=function(params:any) {
  return request({
    url: '/api/account/baseInfoAccount',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 启用账户
 * @method
 * @name startAccount
 * @param {integer} id -id
 */
obj.startAccount=function(data:any) {
  return request({
    url: '/api/account/startAccount',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 暂停账户
 * @method
 * @name stopAccount
 * @param {integer} id -id
 */
obj.stopAccount=function(data:any) {
  return request({
    url: '/api/account/stopAccount',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 修改账户
 * @method
 * @name updateAccount
 * @param {} updateAccountDto -updateAccountDto
 */
obj.updateAccount=function(data:any) {
  return request({
    url: '/api/account/updateAccount',
    method: 'post',
    data,
    domain: 'cw'
  })
}

export default obj