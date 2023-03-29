import request from '@/utils/request'
const obj:any = {}

/**
 * 增加统计管理数据
 * @method
 * @name addStatisticsManage
 * @param {} statisticsManageDto -statisticsManageDto
 */
obj.addStatisticsManage=function(data:any) {
  return request({
    url: '/api/statisticsManage/addStatisticsManage',
    method: 'post',
    data
  })
}

/**
 * 修改统计管理数据
 * @method
 * @name findStatisticsManageList

 */
obj.findStatisticsManageList=function(params:any) {
  return request({
    url: '/api/statisticsManage/findStatisticsManageList',
    method: 'get',
    params
  })
}

/**
 * 修改统计管理数据
 * @method
 * @name updateStatisticsManage
 * @param {} statisticsManageDto -statisticsManageDto
 */
obj.updateStatisticsManage=function(data:any) {
  return request({
    url: '/api/statisticsManage/updateStatisticsManage',
    method: 'post',
    data
  })
}

export default obj