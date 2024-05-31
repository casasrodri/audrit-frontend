<script setup>
import { inject, ref, watchEffect } from "vue";
import api from "@/services/api.js";
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';

const dialogRef = inject('dialogRef');
const tipoBuscado = ref('')
const valorBuscado = ref('')
const items = ref([])
const toast = useToast();

const ASOCIACIONES_VALIDAS = {
    riesgo: ['Control', 'Prueba', 'Observación', 'Normativa', 'Aplicación', 'Organigrama'],
    control: ['Riesgo', 'Prueba', 'Observación', 'Normativa', 'Aplicación', 'Organigrama'],
    prueba: ['Riesgo', 'Control', 'Observación', 'Normativa', 'Aplicación', 'Organigrama'],
    observacion: ['Riesgo', 'Control', 'Prueba', 'Normativa', 'Aplicación', 'Organigrama'],
    normativa: ['Riesgo', 'Control', 'Prueba', 'Observación', 'Aplicación', 'Organigrama'],
    aplicacion: ['Riesgo', 'Control', 'Prueba', 'Observación', 'Normativa', 'Organigrama'],
    organigrama: ['Riesgo', 'Control', 'Prueba', 'Observación', 'Normativa', 'Aplicación'],
}

const ENTIDADES = {
    Riesgo: 'riesgos',
    Control: 'controles',
    Prueba: 'pruebas',
    Observación: 'observaciones',
    Normativa: 'normativas',
    Aplicación: 'aplicaciones',
    Organigrama: 'organigramas',
}

const TIPOS = {
    Riesgo: 'riesgo',
    Control: 'control',
    Prueba: 'prueba',
    Observación: 'observacion',
    Normativa: 'normativa',
    Aplicación: 'aplicacion',
    Organigrama: 'organigrama',
}

async function buscar() {
    const entidad = tipoBuscado.value
    const entidades = ENTIDADES[entidad]
    const revisionId = dialogRef.value.data.revisionId
    const texto = valorBuscado.value

    let url
    if (['normativas', 'aplicaciones', 'organigramas'].includes(entidades)) {
        url = `/${entidades}/buscar/${texto}`
    } else {
        url = `/${entidades}/revision/${revisionId}/buscar/${texto}`
    }
    const { data } = await api.get(url)
    items.value = data
}

async function crearAsociacion() {
    const ent1 = dialogRef.value.data.tipo
    const id1 = dialogRef.value.data.id

    const ent2 = TIPOS[tipoBuscado.value]
    const id2 = valorBuscado.value.id


    const url = `/links/${ent1}/${id1}/${ent2}/${id2}`

    try {
        const { data } = await api.post(url)

        toast.add({ severity: 'success', summary: 'Asociación', detail: 'La asociación ha sido realizada con éxito.', life: 3000 });

        dialogRef.value.close()

    } catch (error) {

        if (error.response.data) {
            if (error.response.data.detail === 'Relación existente.') {
                toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'La asociación ya existe.', life: 3000 });
                valorBuscado.value = ''
                return
            };
        }
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear la asociación.' + error, life: 3000 });
    }
}

watchEffect(() => {
    tipoBuscado.value
    valorBuscado.value = ''
})


</script>

<template>

    <div class="w-full min-w-full mt-1 flex flex-col">

        <label for="tipo" class="font-semibold">Tipo:</label>
        <Dropdown v-model="tipoBuscado" :options="ASOCIACIONES_VALIDAS[dialogRef.data.tipo]"
            placeholder="Selecciona un tipo" />

        <label for="tipo" class="font-semibold mt-3">Elemento:</label>
        <AutoComplete
            :pt="{ root: 'min-w-full', container: 'min-w-full', input: 'min-w-full text-base leading-[normal] appearance-none rounded-md m-0 p-2 text-surface-700 dark:text-white/80 border focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50' }"
            v-model="valorBuscado" :suggestions="items" optionLabel="nombre" @complete="buscar"
            :disabled="tipoBuscado === ''" />
    </div>

    <div class="w-full min-w-full mt-3 flex justify-end">
        <button v-if="valorBuscado !== ''" class="rounded-xl bg-[#40a345] text-white p-1 px-7" @click="crearAsociacion">
            Asociar
        </button>
    </div>
</template>
