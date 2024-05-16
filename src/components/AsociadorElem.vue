<script setup>
import { inject, ref } from "vue";
import api from "@/services/api.js";
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';

const dialogRef = inject('dialogRef');
const valorBuscado = ref('')
const items = ref([])
const toast = useToast();

async function buscar() {
    const entidades = dialogRef.value.data.entidades
    const revisionId = dialogRef.value.data.revisionId
    const texto = valorBuscado.value

    const url = `/${entidades}/revision/${revisionId}/buscar/${texto}`
    const { data } = await api.get(url)
    items.value = data
}


async function crearAsociacion() {
    const entidad = dialogRef.value.data.entidad
    const entidadId = valorBuscado.value.id
    const tipoOrigen = dialogRef.value.data.tipoOrigen
    const origenId = dialogRef.value.data.origenId

    const url = `/links/${tipoOrigen}/${origenId}/${entidad}/${entidadId}`

    try {
        const { data } = await api.post(url)

        toast.add({ severity: 'success', summary: 'Asociación', detail: 'La asociación ha sido realizada con éxito.', life: 3000 });

        dialogRef.value.close()

    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear la asociación.' + error, life: 3000 });
    }
}
</script>

<template>

    <div class="w-full min-w-full mt-1">
        <AutoComplete
            :pt="{ root: 'min-w-full', container: 'min-w-full', input: 'min-w-full text-base leading-[normal] appearance-none rounded-md m-0 p-2 text-surface-700 dark:text-white/80 border focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50' }"
            v-model="valorBuscado" :suggestions="items" optionLabel="nombre" @complete="buscar" />
    </div>

    <div class="w-full min-w-full mt-3 flex justify-end">
        <button v-if="valorBuscado !== ''" class="rounded-xl bg-[#40a345] text-white p-1 px-7" @click="crearAsociacion">
            Asociar
        </button>
    </div>
</template>
