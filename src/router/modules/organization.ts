export default {
        path: 'organization',
        component: () => import('@/views/organization/manage.vue'),
        name: 'organizationalManagement',
        meta: {
          title: '机构管理',
          icon: 'apartment'
        },
        order: 10
      }

