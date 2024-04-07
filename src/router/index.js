import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import HomeView from '@/views/HomeView.vue'
import AppLayout from '@/layouts/AppLayout.vue'

// Views
import AudiView from '@/views/auditorias/AudiView.vue'
import ObservView from '@/views/observaciones/ObservView.vue'
import ReqView from '@/views/requerimientos/ReqView.vue'

import ParamMenu from '@/views/parametros/ParamMenu.vue'
import ParamCiclos from '@/views/parametros/ParamCiclos.vue'
import ParamPeriodos from '@/views/parametros/ParamPeriodos.vue'

import DevTools from '@/components/DevTools.vue'

import ConfigView from '@/views/configuracion/ConfigView.vue'

import LoginView from '@/views/LoginView.vue'

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
          component: HomeView,
        },
        {
          path: '/auditorias',
          name: 'auditorias',
          component: AudiView,
          meta: { title: 'Auditorías' },
        },
        {
          path: '/observaciones',
          name: 'observaciones',
          component: ObservView,
          meta: { title: 'Observaciones' },
        },
        {
          path: '/requerimientos',
          name: 'requerimientos',
          component: ReqView,
          meta: { title: 'Requerimientos' },
        },
        {
          path: '/parametros',
          name: 'parametros',
          component: ParamMenu,
          meta: { title: 'Parámetros' },
          children: [
            {
              path: '/parametros/ciclos',
              name: 'paramCiclos',
              component: ParamCiclos,
              meta: { title: 'Ciclos' },
            },
            {
              path: '/parametros/periodos',
              name: 'paramPeriodos',
              component: ParamPeriodos,
              meta: { title: 'Periodos' },
            },
          ]
        },
        {
          path: '/devtools',
          name: 'devtools',
          component: DevTools,
          meta: { title: 'Herramientas de Desarrollo' },
        },
        {
          path: '/configuracion',
          name: 'configuracion',
          component: ConfigView,
          meta: { title: 'Configuración' },
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // component: () => import('@/views/LoginView.vue'),
      component: LoginView,
      meta: { title: 'Iniciar sesión' },
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Audrit';
  next();
});

export default router
