<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const miToggle = () => {
  toggleDark()
  console.log('isDark:', isDark.value)
}
</script>

<template>
  <div @click="miToggle()" class="text-gray-500 dark:text-white">
    <Icon v-if="isDark" icon="material-symbols:light-mode-outline" width="26" height="26" />
    <Icon v-else icon="material-symbols:dark-mode-outline" width="26" height="26" />
  </div>
</template>
