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
const observaciones = ref([]);

async function getObservaciones() {
    const { data: listObservaciones } = await api.get(`/observaciones/revision/${props.ids.revision.id}`);
    observaciones.value = listObservaciones;
}

watchEffect(() => {

    route.params

    if (props.ids.revision.id != null) {
        getObservaciones()
    }

    if (props.ids.revision.obj) {
        setTitulo(props.ids.revision.obj.nombre)
    }
})


const colores = {
    'Bajo': 'success',
    'Medio': 'warning',
    'Alto': 'danger',
}

const onRowSelect = (row) => {
    const siglaAudit = props.ids.auditoria.sigla;
    const siglaRevision = props.ids.revision.sigla;
    const idObserv = row.data.id;
    const nombre = adaptarTextoParaUrl(row.data.nombre);

    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/observaciones/${idObserv}/${nombre}`);
};


</script>

<template>
    <DataTable id="tablaObservaciones" :value="observaciones" tableStyle="min-width: 50rem" stripedRows
        selectionMode="single" @rowSelect="onRowSelect">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column header="Riesgo">
            <template #body="slotProps">
                <Tag :severity="colores[slotProps.data.riesgo]" :value="slotProps.data.riesgo"></Tag>
            </template>
        </Column>
    </DataTable>
</template>


<style>
#tablaObservaciones thead>tr>th,
#tablaObservaciones tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
