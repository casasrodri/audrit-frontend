<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { useRouter } from 'vue-router';
import { adaptarTextoParaUrl } from '@/utils/helpers';

const router = useRouter();

const auditorias = ref([]);

async function getAuditorias() {
    const res = await api.get('/auditorias');
    console.log(res);
    auditorias.value = res.data
}

onMounted(getAuditorias);

const tagStyles = {
    tipos: {
        anual: {
            severity: 'primary',
            text: 'anual',
        },
        especial: {
            severity: 'info',
            text: 'especial',
        }
    },

    estados: {
        iniciada: {
            severity: 'success',
            text: 'iniciada',
        },
        finalizada: {
            severity: 'danger',
            text: 'finalizada',
        }
    }
}



const onRowSelect = (row) => {
    const sigla = row.data.sigla;
    const nombre = adaptarTextoParaUrl(row.data.nombre);
    router.push(`/auditorias/${sigla}/${nombre}`);
};



</script>

<template>
    <DataTable :value="auditorias" sortField="estado" :sortOrder="-1" tableStyle="min-width: 50rem" stripedRows
        selectionMode="single" @rowSelect="onRowSelect">
        <Column field="sigla" header="Sigla"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column header="Tipo">
            <template #body="slotProps">
                <Tag :value="tagStyles.tipos[slotProps.data.tipo].text"
                    :severity="tagStyles.tipos[slotProps.data.tipo].severity" rounded></Tag>
            </template>
        </Column>
        <Column header="Estado">
            <template #body="slotProps">
                <Tag :value="tagStyles.estados[slotProps.data.estado].text"
                    :severity="tagStyles.estados[slotProps.data.estado].severity" rounded></Tag>
            </template>
        </Column>
    </DataTable>
</template>
