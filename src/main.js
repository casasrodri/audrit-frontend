import './assets/main.css'
import 'primeicons/primeicons.css'

// Application
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// Pinia
import { createPinia } from 'pinia'
app.use(createPinia())

// Router
import router from './router'
app.use(router)

// PrimeVue
import PrimeVue from 'primevue/config'
import Lara from '@/presets/lara'

app.use(PrimeVue, {
  unstyled: true,
  pt: Lara,
  ripple: true,
})

// Toast
import ToastService from 'primevue/toastservice';
app.use(ToastService);

// Components
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

app.component('PrimeDialog', Dialog)
app.component('PrimeButton', Button)

// Mount
app.mount('#app')
