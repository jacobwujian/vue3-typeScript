import Storage from 'vue-ls'

let options = {
  namespace: '_', // key键前缀
  name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  storage: 'session' // 存储名称: session, local, memory
}

export default (app:any) => {
	app.use(Storage, options)
}