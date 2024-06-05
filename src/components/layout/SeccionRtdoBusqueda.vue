<script setup>
import { ref, watchEffect } from 'vue';
import ElementoRtdoBusq from './ElementoRtdoBusq.vue';
import api from '@/services/api.js';

const mostrarRtdos = ref(true)
const mostrarSeccion = ref(true)
const resultados = ref([])
const props = defineProps({
    textoBuscado: String,
    titulo: String,
    filtros: Object
})

watchEffect(() => {
    mostrarSeccion.value = props.filtros.find(fi => fi.nombre === props.titulo).activo
    if (props.textoBuscado.length > 0) {
        buscarBackend()
    }
    if (props.textoBuscado === '') {
        resultados.value = []
    }
})

// {{URL}}/archivos/buscarGlobal/gana

const ENDPOINTS = {
    'Archivos': '/archivos',
    'Auditorías': '/auditorias',
    'Controles': '/controles',
    'Observaciones': '/observaciones',
    'Requerimientos': '/pedidos',
    'Pruebas': '/pruebas',
    'Relevamientos': '/relevamientos',
    'Revisiones': '/revisiones',
    'Riesgos': '/riesgos',
    'Usuarios': '/usuarios',
    'Normativas': '/normativas',
    'Organigrama': '/organigramas',
    'Aplicaciones': '/aplicaciones',
}


async function buscarBackend() {
    const endpoint = ENDPOINTS[props.titulo] + '/buscarGlobal/' + encodeURIComponent(props.textoBuscado)
    try {
        const { data } = await api.get(endpoint)
        resultados.value = data
    } catch (error) { }
}

const emit = defineEmits(['cerrarModal'])
function reEmitir(e) {
    emit('cerrarModal')
}

</script>

<template>
    <div class="my-3" v-if="mostrarSeccion && resultados.length > 0">
        <template v-if="!mostrarRtdos">
            <h4 class="font-semibold text-md cursor-pointer" @click="mostrarRtdos = !mostrarRtdos">
                {{ props.titulo }} <span class="font-bold text-gray-300">...</span>
            </h4>
        </template>
        <template v-else>
            <h4 class="font-semibold text-md" @click="mostrarRtdos = !mostrarRtdos">
                {{ props.titulo }}
            </h4>
            <div id="contenedorRtdos" class="flex flex-col gap-1">
                <ElementoRtdoBusq v-for="r in resultados" :buscado="textoBuscado" :resultado="r"
                    @cerrar-modal="reEmitir" :key="r" />
            </div>
        </template>
    </div>

</template>
