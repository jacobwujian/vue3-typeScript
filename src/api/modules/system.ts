import request from '@/utils/request'
const obj:any = {}

/**
 * 各地区绿色电力积分核发数量
 * @method
 * @name cityStockTotal

 */
obj.cityStockTotal=function(param:anys) {
  return request({
    url: '/api/system/cityStockTotal',
    method: 'get',
    params
  })
}

/**
 * 各地市机构注册统计
 * @method
 * @name companyTotal

 */
obj.companyTotal=function(params:any) {
  return request({
    url: '/api/system/companyTotal',
    method: 'get',
    params
  })
}

/**
 * 统计设备绑定数
 * @method
 * @name deviceTotal

 */
obj.deviceTotal=function(params:any) {
  return request({
    url: '/api/system/deviceTotal',
    method: 'get',
    params
  })
}

/**
 * 项目发证小时统计
 * @method
 * @name projectStockTotal
 * @param {} hourStockDto -hourStockDto
 */
obj.projectStockTotal=function(params:any) {
  return request({
    url: '/api/system/projectStockTotal',
    method: 'get',
    params
  })
}

/**
 * 项目申报统计
 * @method
 * @name projectTotal

 */
obj.projectTotal=function(params:any) {
  return request({
    url: '/api/system/projectTotal',
    method: 'get',
    params
  })
}

/**
 * 各月绿色电力积分核发数量
 * @method
 * @name stockTotal

 */
obj.stockTotal=function(params:any) {
  return request({
    url: '/api/system/stockTotal',
    method: 'get',
    params
  })
}

export default obj