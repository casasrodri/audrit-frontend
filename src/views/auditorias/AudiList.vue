<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { useRouter, RouterLink } from 'vue-router';
import { adaptarTextoParaUrl } from '@/utils/helpers';
import { useMigajasStore } from '@/stores/migajas.js';


const router = useRouter();
const migajasStore = useMigajasStore();
const auditorias = ref([]);

async function getAuditorias() {
    const res = await api.get('/auditorias');
    // console.log(res);
    auditorias.value = res.data
}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    ];
}

onMounted(() => {
    getAuditorias()
    setMigajas()
    obtenerPermisos()
});

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

const permisos = ref({ auditorias: '' })
async function obtenerPermisos() {
    const { data } = await api.get('/sesiones/me/menu')
    data.split('|').forEach(menu => {
        const array = menu.split(':')
        permisos.value[array[0]] = array[1]
    });

    if (permisos.value.auditorias === '') {
        const menus = Object.keys(permisos.value)
        for (const menu of menus) {
            if (permisos.value[menu] !== '') {
                router.push(`/${menu}`)
                return
            }
        }
    }
}


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

    <div class="grid grid-cols-3 mt-10 gap-6">
        <RouterLink v-for="elem in ['Aplicaciones', 'Normativas', 'Organigrama']"
            class="flex justify-center min-h-10 items-center rounded bg-cyan-500/30 hover:border-b-2 hover:border-cyan-500 hover:text-cyan-800 hover:font-semibold"
            :to="`/${elem.toLowerCase()}`">
            {{ elem }}
        </RouterLink>
    </div>
</template>
