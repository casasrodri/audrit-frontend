<script setup>
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

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


    res = await api.get(`/revisiones/auditoria/${auditoria.value.id}/nodos`);
    // console.log(res);
    revisiones.value = res.data;
}



onMounted(getAuditoria);

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

const onRowSelect = (row) => {
    const siglaAudit = route.params.siglaAudit
    const siglaRev = row.data.sigla;
    const nombreRev = adaptarTextoParaUrl(row.data.nombre);
    router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRev}`);
};

</script>

<template>
    Estado: {{ auditoria.estado }}
    <br>
    Tipo: {{ auditoria.tipo }}
    <br>
    Periodo: {{ auditoria.periodo }}
    <br><br>
    <hr>
    <br>
    <b>Revisiones:</b>
    <br>

    <!-- TODO Agregar boton para nuevo o importar... -->

    <TreeTable :value="revisiones" :pt="{ headerrow: 'hidden' }" class="mt-3" selectionMode="single"
        @nodeSelect="onRowSelect">

        <Column expander>
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
                    :severity="tagStyles[props.node.data.estado].severity" />
            </template>
        </Column>

        <Column headerStyle="width: 10rem">
            <template #body="props">
                <div class="flex-row items-center justify-end gap-2 hidden group-hover/filaciclo:flex">
                    {{ props.node.data.sigla }}
                    {{ props.node.data.nombre }}
                    {{ props.node.data.estado }}
                </div>
            </template>
        </Column>
    </TreeTable>

</template>
