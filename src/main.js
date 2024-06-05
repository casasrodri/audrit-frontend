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

// Dialog Service
import DialogService from 'primevue/dialogservice'
app.use(DialogService)

//ConfirmPopup Service
import ConfirmationService from 'primevue/confirmationservice';
app.use(ConfirmationService);

// Tooltips
import Tooltip from 'primevue/tooltip';
app.directive('tooltip', Tooltip);

// Mount
app.mount('#app')
