import {
	createPinia
} from 'pinia'

export const pinia = createPinia()

export default function(app: any) {
	app.use(pinia)
	app.config.globalProperties.$store = pinia
}
