import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const abierto = ref(false)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
  function abrir() {
    abierto.value = true
  }

  function cerrar() {
    abierto.value = false
  }

  function alternar() {
    abierto.value = !abierto.value
  }

  return { abierto, abrir, cerrar, alternar }
})
