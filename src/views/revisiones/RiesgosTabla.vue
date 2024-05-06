<script setup>

import { ref, watchEffect } from 'vue';
import api from '@/services/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { adaptarTextoParaUrl } from '@/utils/helpers.js'
import { useRouter } from 'vue-router';

const props = defineProps({
    ids: Object,
})

const router = useRouter();
const riesgos = ref([]);

async function getRiesgos() {
    const { data: listRiesgos } = await api.get(`/riesgos/revision/${props.ids.revision.id}`);
    riesgos.value = listRiesgos;
}

watchEffect(() => {
    if (props.ids.revision.id != null) {
        getRiesgos()
    }
})


const onRowSelect = (row) => {
    const siglaAudit = props.ids.auditoria.sigla;
    const siglaRevision = props.ids.revision.sigla;
    const idRiesgo = row.data.id;
    const nombre = adaptarTextoParaUrl(row.data.nombre);

    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/riesgos/${idRiesgo}/${nombre}`);
};

</script>

<template>
    <DataTable :value="riesgos" tableStyle="min-width: 50rem" stripedRows selectionMode="single"
        @rowSelect="onRowSelect">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <!-- <Column header="Estado">
            <template #body="slotProps">
                <Tag :value="tagStyles.estados[slotProps.data.estado].text"
                    :severity="tagStyles.estados[slotProps.data.estado].severity" rounded></Tag>
            </template>
</Column> -->


    </DataTable>
</template>
