<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { useMenuStore } from '@/stores/menuLateral.js'

const menuStore = useMenuStore()

const config = {
    texto: 'Buscar',
    icono: 'iconamoon:search',
}

const visible = ref(false)
const textoBuscado = ref('')


watch(visible, () => textoBuscado.value = '')

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.ctrlKey && e.key === 'k') visible.value = true
})

</script>

<template>
    <div @click="visible = true"
        class="group/itemnav flex flex-row rounded-md border-[1px] max-w-48 my-1 border-transparent hover:border-cyan-200 hover:bg-cyan-100/70 text-gray-600 hover:text-cyan-600 hover:font-medium p-1 dark:hover:border-cyan-800 dark:hover:bg-cyan-900/70 dark:text-gray-400 dark:hover:text-cyan-300">
        <span class="text-gray-400 group-hover/itemnav:text-sky-500 dark:group-hover/itemnav:text-sky-500">
            <Icon :icon="config.icono" width="26" height="26" />
        </span>
        <span v-if="menuStore.abierto" class="justify-center content-center ml-2">
            {{ config.texto }}
        </span>
    </div>

    <Dialog v-model:visible="visible" :draggable="false" dismissableMask :closable="false" modal
        :pt="{ mask: 'bg-black/20 backdrop-blur-[0.5px]' }">
        <template #header>
            <span class="relative w-full">
                <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                <InputText v-model="textoBuscado" placeholder="Buscar" class="pl-10 w-full" autofocus
                    @keyup.escape="visible = false" />
            </span>
        </template>
        <p class="m-0">
            {{ textoBuscado === '' ? '' : `Buscando: ${textoBuscado}...` }}
        </p>
    </Dialog>

</template>
