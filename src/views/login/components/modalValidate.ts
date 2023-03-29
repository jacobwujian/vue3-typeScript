import {
	validatePhone,
	validateLoginPwd
} from '@/utils/validate.js'

// 为了获取到editForm而作为一个函数暴露
export function rules(editForm:any, form:any) {
	// 密码校验规则
	const validatePass = (rule:any, value:any, callback:any) => {
		if (value === '') {
			return Promise.reject(new Error('请输入密码'))
		} else {
			if (form.password !== '' && form.confirmpwd !== '') {
				editForm.value.validateFields(['confirmpwd'])
			}
			return Promise.resolve()
		}
	}
	// 确认密码校验规则
	const validatePass2 = (rule:any, value:any, callback:any) => {
		if (value === '') {
			return Promise.reject(new Error('请再次输入密码'))
		} else if (value !== form.password) {
			return Promise.reject(new Error('密码输入不正确'))
		} else {
			return Promise.resolve()
		}
	}
	// 表单校验规则
	return {
		password: [{
				validator: validatePass,
				trigger: 'blur'
			},
			{
				validator: validateLoginPwd,
				trigger: 'blur'
			}
		],
		confirmpwd: [{
				required: true,
				message: '请确认密码',
				trigger: 'blur'
			},
			{
				validator: validatePass2,
				trigger: 'blur'
			},
			{
				validator: validateLoginPwd,
				trigger: 'blur'
			}
		],
		contactWay: [{
				required: true,
				message: '请输入手机号',
				trigger: 'blur'
			},
			{
				validator: validatePhone,
				trigger: 'blur'
			}
		],
		username: [
			// message	校验文案
			// pattern	正则表达式校验
			// required	是否必选
			// transform	校验前转换字段值
			// validator	自定义校验（注意，callback 必须被调用）
			// whitespace	必选时，空格是否会被视为错误
			{
				required: true,
				// validator也可以给自定义校验中设置settimeout 用于延时展示msg和图标反馈
				validator: (rule:any, value:any, callback:any) => {
					if (!value) {
						return Promise.reject('请输入用户名')
					} else {
					    /* 这里可以设置用户名校验规则，如后端是否已存在或不存在()取决于注册还是忘记密码*/
						return Promise.resolve()
					}
				},
				trigger: 'blur'
			},
			{
				pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){0,20}$/,
				message: '请输入正确的不超过20位的用户名',
				trigger: 'blur'
			}
		],
		smsCode: [{
			required: true,
			message: '请输入验证码',
			trigger: 'blur'
		}, {
			validator: (rule:any, value:any, callback:any) => {
				return Promise.resolve()
			},
			trigger: 'blur'
		}]
	}
}


// 表单字段信息
export const formList:any = [{
	title: '账户信息',
	formList: [{
			type: 'input',
			params: 'username',
			placeholder: '请输入用户名',
			label: '用户名',
			required: true,
			reg: 'enz-20'
		},
		{
			type: 'pwdIpt',
			params: 'password',
			placeholder: '请输入密码',
			label: '密码',
			required: true
		},
		{
			type: 'pwdIpt',
			params: 'confirmpwd',
			placeholder: '请重复输入密码',
			label: '再次输入密码',
			required: true
		},
		{
			type: 'input',
			params: 'contactWay',
			placeholder: '请输入手机号',
			label: '绑定手机号',
			required: true
		},
		{
			type: 'input',
			params: 'smsCode',
			placeholder: '请输入手机验证码',
			label: '验证码',
			required: true
		}
	]
}]
