import dayjs from 'dayjs'
import {EnumMap } from '@/utils/typeEnum'

export function formFlag(list:any, res:any){
  function strFormat(value:any, sitem:any){
    let val = ''
    switch(sitem.type){
      case 'time':
        val = value && dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        break
      case 'select':
        val = EnumMap(sitem.data, value)
        break
      case 'array':
        val = Array.isArray(value) ? value.join('，') : value
        break
      default:
        val = value
    }
    // if(val && sitem.unit) return val + sitem.unit
    return val
  }
  list.forEach((item:any) => {
      if(item.children){
        formFlag(item.children, res)
      }else{
        item.list.forEach((sitem:any) => {
          if(item.flag){
            if(!res[item.flag]) return
            sitem.value = strFormat(res[item.flag][sitem.key], sitem)
          }else{
            if(sitem.flag){
              if(!res[sitem.flag]) return
              sitem.value = strFormat(res[sitem.flag][sitem.key], sitem)
            }else{
              sitem.value = strFormat(res[sitem.key], sitem)
            }
          }
        })
      }
  })
}

export function localeString(num:any) {
  return (num+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
}