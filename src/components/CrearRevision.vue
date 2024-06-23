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

const revision = ref({
    sigla: '',
    nombre: '',
    descripcion: '',
    padre: {},
})
const nodos = ref([])

async function crearRevision() {
    const auditoria_id = dialogRef.value.data.id
    const idPadre = Object.keys(revision.value.padre)[0] || null
    const dataEnviar = {
        sigla: revision.value.sigla,
        nombre: revision.value.nombre,
        descripcion: revision.value.descripcion,
        estado: 'pendiente',
        informe: null,
        padre_id: idPadre,
    }

    const url = `/revisiones/auditoria/${auditoria_id}`

    try {
        const { data } = await api.post(url, dataEnviar)

        toast.add({ severity: 'success', summary: 'Revisión', detail: 'La revisión se ha creado con éxito.', life: 3000 });

        dialogRef.value.close()

    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear la revisión.' + error.response.data, life: 3000 });
    }
}

watchEffect(() => {
    revision.value.sigla = revision.value.sigla.toUpperCase()
})

const getNodos = async () => {
    const res = await api.get(`/revisiones/auditoria/${dialogRef.value.data.id}/nodos`)
    nodos.value = res.data
}


onMounted(() => {
    getNodos()
})


</script>

<template>
    <!-- {{ revision }} -->
    <!-- <hr> -->
    <!-- {{ dialogRef.data }} -->
    <!-- <hr> -->
    <div class="w-full min-w-full mt-1 flex flex-col gap-3">
        <div class="flex flex-col">
            <label for="tipo" class="font-semibold">Identificador:</label>
            <InputText type="text" v-model="revision.sigla" />
        </div>

        <div class="flex flex-col">
            <label for="nombre" class="font-semibold">Nombre:</label>
            <InputText type="text" v-model="revision.nombre" />
        </div>

        <div class="flex flex-col">
            <label for="descripcion" class="font-semibold">Descripción:</label>
            <Textarea v-model="revision.descripcion" rows="5" cols="30" />
        </div>

        <div class="flex flex-col">
            <label for="padre" class="font-semibold">Subciclo de:</label>
            <TreeSelect v-model="revision.padre" :options="nodos" placeholder="No es subciclo" />
        </div>
    </div>

    <div class="w-full min-w-full mt-3 flex justify-end">
        <button class="rounded-xl bg-[#40a345] text-white p-1 px-7" @click="crearRevision">
            Crear
        </button>
    </div>
</template>
