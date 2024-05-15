<script setup>

import { ref, watchEffect } from 'vue';
import api from '@/services/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { adaptarTextoParaUrl } from '@/utils/helpers.js'
import { useRouter, useRoute } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';

const props = defineProps({
    ids: Object,
})

const router = useRouter();
const route = useRoute();
const controles = ref([]);

async function getControles() {
    const { data: listControles } = await api.get(`/controles/revision/${props.ids.revision.id}`);
    controles.value = listControles;
}

watchEffect(() => {

    route.params

    if (props.ids.revision.id != null) {
        getControles()
    }

    if (props.ids.revision.obj) {
        setTitulo(props.ids.revision.obj.nombre)
    }
})


const onRowSelect = (row) => {
    const siglaAudit = props.ids.auditoria.sigla;
    const siglaRevision = props.ids.revision.sigla;
    const idControl = row.data.id;
    const nombre = adaptarTextoParaUrl(row.data.nombre);

    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/controles/${idControl}/${nombre}`);
};


const colores = {
    'Permanente': 'success',
    'Periódico': 'warning',
    'Ocasional': 'danger',

    'Preventivo': 'success',
    'Correctivo': 'warning',
    'Detectivo': 'danger',

    'Automatizado': 'success',
    'Semi-automatizado': 'warning',
    'Manual': 'danger',
}

</script>

<template>
    <DataTable id="tablaControles" :value="controles" tableStyle="min-width: 50rem" stripedRows selectionMode="single"
        @rowSelect="onRowSelect">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column header="Periodicidad">
            <template #body="slotProps">
                <Tag :severity="colores[slotProps.data.periodicidad]" :value="slotProps.data.periodicidad"></Tag>
            </template>
        </Column>
        <Column header="Oportunidad">
            <template #body="slotProps">
                <Tag :severity="colores[slotProps.data.oportunidad]" :value="slotProps.data.oportunidad"></Tag>
            </template>
        </Column>
        <Column header="Automatización">
            <template #body="slotProps">
                <Tag :severity="colores[slotProps.data.automatizacion]" :value="slotProps.data.automatizacion"></Tag>
            </template>
        </Column>
    </DataTable>
</template>


<style>
#tablaControles thead>tr>th,
#tablaControles tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
