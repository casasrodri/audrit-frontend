<script setup>
document.title = 'Observaciones'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
const visible = ref(false)
const value1 = ref('')
</script>

<template>
  Observaciones

  <div class="card flex justify-center">
    <div class="card flex justify-center">
      <PrimeButton label="Modal" icon="pi pi-external-link" @click="visible = true" />
      <PrimeDialog
        v-model:visible="visible"
        :draggable="false"
        modal
        dismissableMask
        closeOnEscape
        :closable="false"
      >
        <template #header>
          <span class="relative w-full">
            <i
              class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
            />
            <InputText v-model="value1" placeholder="Buscar" class="pl-10 w-full" />
          </span>
        </template>
        <p class="m-0">
          {{ value1 === '' ? 'Sin resultados' : `Buscando: ${value1}...` }}
        </p>
      </PrimeDialog>
    </div>

    <!-- <i class="pi pi-check"></i> -->
  </div>
</template>
