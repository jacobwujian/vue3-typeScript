export default {
  path: 'statistical',
  name: 'statisticalManagement',
  meta: {
    title: '监控大屏管理',
    icon: 'securityscan'
  },
  order: 499,
  component: () => import('@/views/statistical/manage.vue'),
  children: []
}
