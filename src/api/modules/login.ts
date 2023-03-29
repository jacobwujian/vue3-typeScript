import request from '@/utils/request'

function login(data:any) {
	return request({
		url: '/login',
		method: 'post',
		data,
		noToken: true
	})
}

function logout() {
	return request({
		url: '/auth/logout',
		method: 'post'
	})
}

function updatePassword(data:any) {
	return request({
		url: '/api/user/updatePassword',
		method: 'post',
		data
	})
}

function checkExistUsername(data:any) {
	return request({
		url: '/api/register/checkExistUsername',
		method: 'post',
		data
	})
}

function checkExistContactWay(data:any) {
	return request({
		url: '/api/register/checkExistContactWay',
		method: 'post',
		data
	})
}


export default {
	login,
	logout,
	updatePassword,
	checkExistUsername,
	checkExistContactWay
}
