<script setup>
import { inject, ref, watchEffect, onMounted } from "vue";
import api from "@/services/api.js";
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import TreeSelect from 'primevue/treeselect';

const dialogRef = inject('dialogRef');
const toast = useToast();

const relevamiento = ref({
    sigla: '',
    nombre: '',
    descripcion: '',
    padre: {},
})
const nodos = ref([])

async function crearRelevamiento() {
    const revision_id = dialogRef.value.data.id
    const idPadre = Object.keys(relevamiento.value.padre)[0] || null
    const dataEnviar = {
        tipo: tipoElemento.value === 'documento' ? 'documento' : 'proceso',
        sigla: relevamiento.value.sigla,
        nombre: relevamiento.value.nombre,
        padre_id: idPadre,
        revision_id: revision_id,
    }

    const url = `/relevamientos/revision/${revision_id}`

    try {
        const { data } = await api.post(url, dataEnviar)

        toast.add({ severity: 'success', summary: 'Relevamiento', detail: 'El relevamiento se ha creado con éxito.', life: 3000 });

        dialogRef.value.close()

    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el relevamiento.' + error.response.data, life: 3000 });
    }
}

watchEffect(() => {
    relevamiento.value.sigla = relevamiento.value.sigla.toUpperCase()
})

const getNodos = async () => {
    const res = await api.get(`/relevamientos/revision/${dialogRef.value.data.id}/nodos?solo_agrupadores=true`)
    nodos.value = res.data

}


onMounted(() => {
    getNodos()
})


const tipoElemento = ref('documento')
const tipoOpts = ['agrupador', 'documento']

</script>

<template>
    <!-- {{ revision }} -->
    <!-- <hr> -->
    <!-- {{ dialogRef.data }} -->
    <!-- <hr> -->
    <div class="w-full min-w-full mt-1 flex flex-col gap-3">
        <div class="flex flex-col">
            <label for="tipo" class="font-semibold">Tipo:</label>
            <Dropdown v-model="tipoElemento" :options="tipoOpts" placeholder="Selecciona un tipo" />
        </div>
        <div class="flex flex-col" v-if="tipoElemento === 'agrupador'">
            <label for="sigla" class="font-semibold">Identificador:</label>
            <InputText type="text" v-model="relevamiento.sigla" />
        </div>

        <div class="flex flex-col">
            <label for="nombre" class="font-semibold">Nombre:</label>
            <InputText type="text" v-model="relevamiento.nombre" />
        </div>

        <div class="flex flex-col">
            <label for="padre" class="font-semibold">Agrupador:</label>
            <TreeSelect v-model="relevamiento.padre" :options="nodos" placeholder="Sin agrupador" />
        </div>
    </div>

    <div class="w-full min-w-full mt-3 flex justify-end">
        <button class="rounded-xl bg-[#40a345] text-white p-1 px-7" @click="crearRelevamiento">
            Crear
        </button>
    </div>
</template>
