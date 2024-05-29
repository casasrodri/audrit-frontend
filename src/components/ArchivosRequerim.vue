<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api.js';
import { URL } from '@/services/api.js';

import Badge from 'primevue/badge';
import ArchivoIndividual from '@/components/ArchivoIndividual.vue';
import FileUpload from 'primevue/fileupload';

const route = useRoute();
const toast = useToast();
const mostrarDetalle = ref(true);
const archivos = ref([]);

function toggleDetalle() {
    mostrarDetalle.value = !mostrarDetalle.value;
}


async function obtenerArchivos() {
    const req = route.params.idRequerimiento
    try {
        const { data } = await api.get(`/pedidos/${req}`);
        archivos.value = data.archivos;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron obtener los archivos',
            life: 3000
        });
    }
}

watchEffect(() => {
    if (route.params.idRequerimiento) {
        obtenerArchivos()
    }
})

onMounted(obtenerArchivos)

const urlSubir = `${URL}/pedidos/${route.params.idRequerimiento}/archivos`

const onUpload = (e) => {
    obtenerArchivos()
    toast.add({
        severity: 'success', summary: 'Carga de archivos',
        detail: 'El archivo han sido cargado exitosamente.', life: 3000
    });
};

const onErrorUpload = (e) => {
    toast.add({
        severity: 'error', summary: 'Carga de archivos',
        detail: 'No se ha podido realizada la carga del archivo.', life: 3000
    });
};

const onProgressUpload = (e) => {
    toast.add({
        severity: 'info', summary: 'Carga de archivos',
        detail: 'El archivo se está cargando.', life: 3000
    });
}
</script>

<template>
    <span class="cursor-pointer my-2" @click="toggleDetalle">
        <span class="font-semibold" v-if="mostrarDetalle">
            Archivos:
        </span>
        <span v-else>
            <span class="font-semibold">
                Archivos
            </span>
            <Badge :value="archivos.length" severity="info" />
        </span>
    </span>
    <div id="container" v-if="mostrarDetalle">
        <div v-if="archivos.length > 0" id="container"
            class="flex flex-col px-2 min-w-96 border-[1px] rounded-md bg-slate-50 dark:bg-slate-700 gap-2 py-2">
            <ArchivoIndividual v-for="archivo in archivos" :key="archivo.id" :archivo="archivo" />
        </div>
        <div v-else class="ml-2 text-sm mb-2">
            No hay archivos.
        </div>
        <div class="card flex justify-end">
            <FileUpload mode="basic" name="archivos" :url="urlSubir" withCredentials chooseLabel="Cargar"
                @upload="onUpload" @error="onErrorUpload" @before-upload="onProgressUpload" class="mt-2" />
        </div>
    </div>
</template>
