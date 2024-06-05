<script setup>
import { Icon } from '@iconify/vue'
import { useMenuStore } from '@/stores/menuLateral.js'
import { useDark, useToggle } from '@vueuse/core'

const menuStore = useMenuStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const miToggle = () => {
    toggleDark()
}


</script>

<template>
    <div @click="miToggle" class=" group/itemnav flex flex-row rounded-md border-[1px] max-w-48 my-1 border-transparent
        hover:border-cyan-200 hover:bg-cyan-100/70 text-gray-600 hover:text-cyan-600 hover:font-medium p-1
        dark:hover:border-cyan-800 dark:hover:bg-cyan-900/70 dark:text-gray-400 dark:hover:text-cyan-300">
        <span class="text-gray-400 group-hover/itemnav:text-sky-500 dark:group-hover/itemnav:text-sky-500">
            <!-- <Icon :icon="config.icono" width="26" height="26" /> -->
            <Icon v-if="isDark" icon="material-symbols:light-mode-outline" width="26" height="26" />
            <Icon v-else icon="material-symbols:dark-mode-outline" width="26" height="26" />
        </span>
        <span v-if="menuStore.abierto" class="justify-center content-center ml-2">
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
        </span>
    </div>
</template>
