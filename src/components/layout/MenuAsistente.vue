<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'

import { useMenuStore } from '@/stores/menuLateral.js'
const menuStore = useMenuStore()

const config = {
    texto: 'Asistente',
    icono: 'ri:robot-3-line',
}

const visible = ref(false)
const textoBuscado = ref('')
watch(visible, () => textoBuscado.value = '')

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const alertame = () => alert('Consultando!!')

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'a') {
        visible.value = true
        e.preventDefault();
    }

    return true
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

    <Dialog v-model:visible="visible" :draggable="false" modal dismissableMask :closable="false"
        :pt="{ mask: 'bg-black/20 backdrop-blur-[0.5px]' }">
        <template #header>
            <!-- <span class="relative w-full">
                <InputText v-model="textoBuscado" placeholder="Buscar" class="pl-10 w-full" />
                <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
            </span> -->

            <IconField class="relative w-full">
                <InputIcon @click="alertame">
                    <i class="pi pi-send" />
                </InputIcon>
                <InputText v-model="textoBuscado" placeholder="Hazme una pregunta..." @keyup.enter="alertame"
                    @keyup.escape="visible = false" autofocus />
            </IconField>
        </template>
        <p class="m-0">
            {{ textoBuscado === '' ? '' : `Consultando: ${textoBuscado}...` }}
        </p>
    </Dialog>

</template>
