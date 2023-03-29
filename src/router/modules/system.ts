export default {
        path: 'systerm',
        name: 'systemManagement',
        meta: {
          title: '系统管理',
          icon: 'setting',
          noTouch: true
        },
        order: 500,
        component: () => import('@/views/base/index.vue'),
        children: [
          {
            path: 'permission',
            component: () => import('@/views/systerm/permission.vue'),
            name: 'rolePermissionManagement',
            meta: { title: '角色权限' }
          },
          {
            path: 'account',
            component: () => import('@/views/systerm/account.vue'),
            name: 'accountManagement',
            meta: { title: '账户管理' }
          }
        ]
      }

