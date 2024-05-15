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
const pruebas = ref([]);

async function getPruebas() {
    const { data: listPruebas } = await api.get(`/pruebas/revision/${props.ids.revision.id}`);
    pruebas.value = listPruebas;
}

watchEffect(() => {

    route.params

    if (props.ids.revision.id != null) {
        getPruebas()
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

    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/pruebas/${idControl}/${nombre}`);
};


</script>

<template>
    <DataTable id="tablaPruebas" :value="pruebas" tableStyle="min-width: 50rem" stripedRows selectionMode="single"
        @rowSelect="onRowSelect">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column header="Sector">
            <template #body="slotProps">
                {{ slotProps.data.sector }}
            </template>
        </Column>

    </DataTable>
</template>


<style>
#tablaPruebas thead>tr>th,
#tablaPruebas tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
