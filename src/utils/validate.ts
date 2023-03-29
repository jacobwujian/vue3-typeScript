/* 统一社会信用代码 */
export function validateSocialCode(rule:any, value:any, callback:Function) {
  const reg = /^[A-Za-z0-9]{18}$/
  if (value === '' || value === undefined || value === null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入18位有效的统一社会信用代码'))
    } else {
      return Promise.resolve()
    }
  }
}

/* 身份证号校验 */
export function validateIdCard(rule:any, value:any, callback:Function) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入正确的身份证号码'))
    } else {
      return Promise.resolve()
    }
  }
}

/* 手机号码校验 */
export function validatePhone(rule:any, value:any, callback:Function) {
  const reg = /^1[3-9]\d{9}$/
  if (value === '' || value === undefined || value == null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入正确的手机号码'))
    } else {
      return Promise.resolve()
    }
  }
}
/* 登录密码校验 */
export function validateLoginPwd(rule:any, value:any, callback:Function) {
  const reg = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')
  if (value === '' || value === undefined || value == null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('密码需包含大写字母小写字母特殊字符数字,长度8-30位,列如Yhh@2918'))
    } else {
      return Promise.resolve()
    }
  }
}

/* 邮箱地址校验 */
export function validateEmail(rule:any, value:any, callback:Function) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value === '' || value === undefined || value === null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入正确的邮箱地址'))
    } else {
      return Promise.resolve()
    }
  }
}

/* 中、英文、数字组合 */
export function validateZhEnNum(rule:any, value:any, callback:Function) {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  if (value === '' || value === undefined || value == null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入有效的内容（中文、英文、数字组成）'))
    } else {
      return Promise.resolve()
    }
  }
}

/* 英文、数字组合 */
export function validateEnNum(rule:any, value:any, callback:Function) {
  const reg = /^[a-zA-Z0-9]+$/
  if (value === '' || value === undefined || value == null) {
    return Promise.resolve()
  } else {
    if ((!reg.test(value)) && value !== '') {
      return Promise.reject(new Error('请输入有效的内容（英文、数字组成）'))
    } else {
      return Promise.resolve()
    }
  }
}
