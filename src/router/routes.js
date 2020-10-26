
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: 'home', name: 'user', component: () => import('pages/User.vue') },
      { path: 'admin', name: 'admin', component: () => import('pages/Admin.vue') }
    ]
  }

  // Always leave this as last one,
  // but you can also remove it
]

export default routes
