<script setup>
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMigajasStore } from '@/stores/migajas.js';
const route = useRoute();
const migajasStore = useMigajasStore();

import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

import { useRouter } from 'vue-router';
import { adaptarTextoParaUrl } from '@/utils/helpers';
import { setTitulo } from '@/stores/titulo.js';

const router = useRouter();
const auditoria = ref({});
const revisiones = ref([]);

async function getAuditoria() {
    let res
    res = await api.get(`/auditorias/sigla/${route.params.siglaAudit}`);
    // console.log(res);
    auditoria.value = res.data;
    setTitulo(res.data.nombre);
    document.title = `Auditoría - ${res.data.nombre}`


    res = await api.get(`/revisiones/auditoria/${auditoria.value.id}/nodos`);
    // console.log(res);
    revisiones.value = res.data;
}


function setMigajas() {
    const sigla = auditoria.value.sigla
    const nombre = auditoria.value.nombre
    const url = `/auditorias/${sigla}/${adaptarTextoParaUrl(nombre)}`
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
        { nombre, url, title: 'Auditoría' },
    ];
}

onMounted(async () => {
    await getAuditoria()
    setMigajas()
});

const tagStyles = {
    iniciada: {
        severity: 'success',
        text: 'iniciada',
    },
    pendiente: {
        severity: 'warning',
        text: 'pendiente',
    },
    finalizada: {
        severity: 'info',
        text: 'finalizada',
    },
}

const expandedKeys = ref({})
const onRowSelect = (row) => {
    if (row.children.length === 0) {
        const siglaAudit = route.params.siglaAudit
        const siglaRev = row.data.sigla;
        const nombreRev = adaptarTextoParaUrl(row.data.nombre);
        router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRev}/${nombreRev}`);
    } else {
        expandedKeys.value[row.key] = !expandedKeys.value[row.key];
    }
};



</script>

<template>

    <div id="detallesAuditoria">

        <div>
            <span class="font-semibold">
                Estado:
            </span>
            {{ auditoria.estado }}
        </div>
        <div>
            <span class="font-semibold">
                Tipo:
            </span>
            {{ auditoria.tipo }}
        </div>
        <div>
            <span class="font-semibold">
                Periodo:
            </span>
            {{ auditoria.periodo }}
        </div>

        <div class="border-b-[1px] dark:border-slate-700 my-4"></div>
    </div>

    <div class="font-semibold">
        Revisiones:
    </div>

    <!-- TODO Agregar boton para nuevo o importar... -->

    <TreeTable id="tablaAuditorias" :value="revisiones" :pt="{ headerrow: 'hidden' }" class="mt-3"
        selectionMode="single" @nodeSelect="onRowSelect" v-model:expandedKeys="expandedKeys">

        <Column expander style="width: 50vw;">
            <template #body="props">
                <span
                    class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {{ props.node.data.sigla }}
                </span>
                {{ props.node.data.nombre }}
            </template>
        </Column>

        <Column headerStyle="width: 10rem">
            <template #body="props">
                <Tag :value="tagStyles[props.node.data.estado].text"
                    :severity="tagStyles[props.node.data.estado].severity" v-if="props.node.children.length === 0" />
            </template>
        </Column>
        <!-- <Column headerStyle="width: 10rem">
            <template #body="props">
                <div class="flex-row items-center justify-end gap-2 hidden group-hover/filaciclo:flex">
                    {{ props.node.data.sigla }}
                    {{ props.node.data.nombre }}
                    {{ props.node.data.estado }}
                </div>
            </template>
        </Column> -->
    </TreeTable>

</template>

<style>
#tablaAuditorias thead>tr>th,
#tablaAuditorias tbody>tr>td {
    padding: 0.5rem !important;
}

#tablaAuditorias {
    max-width: 60vw;
}
</style>
