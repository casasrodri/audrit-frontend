<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { verificarSesionPeriodicamente } from '@/utils/sesion.js'
import DynamicDialog from 'primevue/dynamicdialog';
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  verificarSesionPeriodicamente(10, router, route)
})

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();


</script>

<template>
  <DynamicDialog />
  <Toast />
  <RouterView />
</template>
