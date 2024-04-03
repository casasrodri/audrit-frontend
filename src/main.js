import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Lara from '@/presets/lara'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
  pt: Lara
})

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

app.component('PrimeDialog', Dialog)
app.component('PrimeButton', Button)

app.mount('#app')
