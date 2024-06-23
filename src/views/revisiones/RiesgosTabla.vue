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
const riesgos = ref([]);

async function getRiesgos() {
    const { data: listRiesgos } = await api.get(`/riesgos/revision/${props.ids.revision.id}`);
    riesgos.value = listRiesgos;
}

watchEffect(() => {

    route.params

    if (props.ids.revision.id != null) {
        getRiesgos()
    }

    if (props.ids.revision.obj) {
        setTitulo(props.ids.revision.obj.nombre)
    }
})


const onRowSelect = (row) => {
    const siglaAudit = props.ids.auditoria.sigla;
    const siglaRevision = props.ids.revision.sigla;
    const idRiesgo = row.data.id;
    const nombre = adaptarTextoParaUrl(row.data.nombre);

    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/riesgos/${idRiesgo}/${nombre}`);
};


const colores = {
    'Bajo': 'success',
    'Medio': 'warning',
    'Alto': 'danger',
}

</script>

<template>
    <DataTable id="tablaRiesgos" :value="riesgos" tableStyle="min-width: 50rem" stripedRows selectionMode="single"
        @rowSelect="onRowSelect" v-if="riesgos.length > 0">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column header="Nivel de riesgo">
            <template #body="slotProps">
                <Tag :severity="colores[slotProps.data.nivel]" :value="slotProps.data.nivel"></Tag>
            </template>
        </Column>
    </DataTable>
    <div v-else>
        Aún no se agregaron riesgos a esta revisión.
    </div>
</template>


<style>
#tablaRiesgos thead>tr>th,
#tablaRiesgos tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
