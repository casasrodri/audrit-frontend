import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMigajasStore = defineStore('migajas', () => {
  const items = ref([
    // { nombre: 'Auditorías', url: '/auditorias' },
    // { nombre: 'Plan anual 2024', url: '/auditorias/2024/plan-anual-2024', title: 'Auditoría' },
    // { nombre: 'Cuenta Corriente', url: '/auditorias/2024/revisiones/CC', title: 'Revisión },
    // { nombre: 'Riesgos', url: '/auditorias/2024/revisiones/CC/riesgos', title: 'Listado de riesgos' },
  ])
  return { items }
})

export const clearMigajas = () => {
  useMigajasStore().items = []
}

export const addMigaja = (migaja) => {
  useMigajasStore().items.push(migaja)
}
