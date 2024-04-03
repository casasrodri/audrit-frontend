import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import SesionLayout from '@/layouts/SesionLayout.vue'
import ObservacionesView from '@/views/ObservacionesView.vue'
import DevTools from '@/components/DevTools.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/observaciones',
          name: 'observaciones',
          component: ObservacionesView
        },
        {
          path: '/devtools',
          name: 'devtools',
          component: DevTools
        }
      ]
    },
    {
      path: '/login',
      component: SesionLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/LoginView.vue')
        }
      ]
    },
  ]
})

export default router
