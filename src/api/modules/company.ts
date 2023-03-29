import request from '@/utils/request'
const obj:any = {}

/**
 * 公司修改信息审核
 * @method
 * @name auditUpdateCompany
 * @param {} checkCompanyDto -checkCompanyDto
 */
obj.auditUpdateCompany=function(data:any) {
  return request({
    url: '/api/company/auditUpdateCompany',
    method: 'post',
    data
  })
}

/**
 * 公司详情
 * @method
 * @name baseInfoCompany
 * @param {integer} id -id
 */
obj.baseInfoCompany=function(params:any) {
  return request({
    url: '/api/company/baseInfoCompany',
    method: 'get',
    params
  })
}

/**
 * 公司审核
 * @method
 * @name checkCompany
 * @param {} checkCompanyDto -checkCompanyDto
 */
obj.checkCompany=function(data:any) {
  return request({
    url: '/api/company/checkCompany',
    method: 'post',
    data
  })
}

/**
 * 通过条件查询公司信息
 * @method
 * @name findCompany
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} companyName -公司名称
 * @param {string} socialCreditCode -统一社会信用证代码
 * @param {integer} status -状态
 * @param {integer} companyId -所属公司id
 */
obj.findCompany=function(params:any) {
  return request({
    url: '/api/company/findCompany',
    method: 'get',
    params
  })
}

/**
 * 重试公司用户上链
 * @method
 * @name retryToChain
 * @param {} retryToChainDto -retryToChainDto
 */
obj.retryToChain=function(data:any) {
  return request({
    url: '/api/company/retryToChain',
    method: 'post',
    data
  })
}

/**
 * 公司信息修改
 * @method
 * @name updateCompany
 * @param {} companyDto -companyDto
 */
obj.updateCompany=function(data:any) {
  return request({
    url: '/api/company/updateCompany',
    method: 'post',
    data
  })
}

export default obj