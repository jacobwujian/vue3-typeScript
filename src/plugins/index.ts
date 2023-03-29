import auth from './auth'
import local from './vuels'
import antd from './antd'
import custom from './custom'

export default (app:any) => {
	auth(app)
	antd(app)
	local(app)
	custom(app)
}