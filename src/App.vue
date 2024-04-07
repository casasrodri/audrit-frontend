<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { verificarSesionPeriodicamente } from '@/utils/sesion.js'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  verificarSesionPeriodicamente(10, router, route)
})

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

toast.add({ severity: 'warn', summary: 'Atención!', detail: `Ingresaste a Audrit"`, life: 3000 });

</script>

<template>
  <Toast />
  <RouterView />
</template>
