import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const abierto = ref(false)
  const cerrado = ref(true)
  //   const doubleCount = computed(() => count.value * 2)
  //   function increment() {
  //     count.value++
  //   }
  function abrir() {
    abierto.value = true
    cerrado.value = false
  }

  function cerrar() {
    abierto.value = false
    cerrado.value = true
  }

  function alternar() {
    abierto.value = !abierto.value
    cerrado.value = !cerrado.value
  }

  return { abierto, cerrado, abrir, cerrar, alternar }
})
