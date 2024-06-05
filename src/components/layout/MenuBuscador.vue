<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { useMenuStore } from '@/stores/menuLateral.js'
import SeccionRtdoBusqueda from './SeccionRtdoBusqueda.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuStore = useMenuStore()

const config = {
    texto: 'Buscar',
    icono: 'iconamoon:search',
}

const visible = ref(false)
const textoBuscado = ref('')


watch(visible, () => textoBuscado.value = '')

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        visible.value = true
    }
    return true
})
// --------------

const filtrosBusq = ref([
    { nombre: 'Archivos', activo: false },
    { nombre: 'Auditorías', activo: true },
    { nombre: 'Controles', activo: true },
    { nombre: 'Observaciones', activo: true },
    { nombre: 'Requerimientos', activo: true },
    { nombre: 'Pruebas', activo: true },
    { nombre: 'Relevamientos', activo: true },
    { nombre: 'Revisiones', activo: true },
    { nombre: 'Riesgos', activo: true },
    { nombre: 'Usuarios', activo: false },
    { nombre: 'Normativas', activo: true },
    { nombre: 'Organigrama', activo: true },
    { nombre: 'Aplicaciones', activo: true },
])

const mostrarFiltroTipos = ref(false)

function handleLinkApretado(e) {
    visible.value = false
    router.push(e)
}

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


        <!-- FILTRO DEL BUSCADOR -->
        <div id="selectorBusqueda" class="flex justify-end text-[0.75rem]">
            <div class="flex gap-2 bg-slate-100 dark:bg-slate-700 max-w-min p-[0.2rem] rounded-md px-1">
                <template v-if="!mostrarFiltroTipos">
                    <div class="text-gray-500 cursor-pointer flex items-center"
                        @click="mostrarFiltroTipos = !mostrarFiltroTipos">
                        <Icon icon="ri:filter-2-fill" width="20" />
                    </div>
                </template>
                <template v-else>
                    <div class="text-gray-500 cursor-pointer flex items-center"
                        @click="mostrarFiltroTipos = !mostrarFiltroTipos">
                        <Icon icon="ri:arrow-right-s-line" width="20" />
                    </div>
                    <div class="min-w-max grid grid-cols-5 gap-1">
                        <div v-for="fi in filtrosBusq" @click="fi.activo = !fi.activo"
                            :class="{ 'bg-primary-200 dark:bg-primary-700 font-semibold': fi.activo }"
                            class="rounded-md p-1 px-1 cursor-pointer text-center">
                            {{ fi.nombre }}
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <SeccionRtdoBusqueda v-for="tipo in filtrosBusq" :titulo="tipo.nombre" :filtros="filtrosBusq"
            :textoBuscado="textoBuscado" @cerrar-modal="visible = false" />

    </Dialog>

</template>
