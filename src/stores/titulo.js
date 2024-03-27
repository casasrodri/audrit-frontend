import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTituloStore = defineStore('titulo', () => {
  const texto = ref('Audrit')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
  return { texto }
})
