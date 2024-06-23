<script setup>
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMigajasStore } from '@/stores/migajas.js';
const route = useRoute();
const migajasStore = useMigajasStore();

import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

import { adaptarTextoParaUrl } from '@/utils/helpers';
import { setTitulo } from '@/stores/titulo.js';

const router = useRouter();
const auditoria = ref({
    id: null,
});
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

const editarAuditoria = () => {
    router.push(`/auditorias/${auditoria.value.sigla}/editar`);
}

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

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()


import { useDialog } from 'primevue/usedialog';
const dialog = useDialog();
import CrearRevision from '@/components/CrearRevision.vue';

const crearNuevaRevision = () => {
    dialog.open(CrearRevision, {
        data: {
            id: auditoria.value.id,
        },
        onClose: (opt) => {
            // TODO: Ver como asociar si no tiene revisión ID
            // console.log(opt)
            // const callbackParams = opt.data; // {selectedId: 12}
            // console.log(callbackParams)
            if (opt.type == 'config-close') getAuditoria()
        },
        props: {
            header: 'Nueva revisión',
            style: {
                width: '50vw',
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            maximizable: false,
        }
    });
}

</script>

<template>

    <div id="panelSuperior" class="flex flex-row justify-between border-b-[1px] dark:border-slate-700 my-2">
        <div id="detallesAuditoria" class="flex flex-col">
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

        </div>
        <div class="my-4">
            <div class="mb-4 mr-4 w-full justify-end flex" v-if="permisos.auditoriasEditar">
                <Button label="Editar" @click="editarAuditoria" />
            </div>
        </div>
    </div>

    <div class="font-semibold">
        Revisiones:
    </div>

    <TreeTable id="tablaAuditorias" :value="revisiones" :pt="{ headerrow: 'hidden' }" class="mt-3"
        selectionMode="single" @nodeSelect="onRowSelect" v-model:expandedKeys="expandedKeys"
        v-if="revisiones.length > 0">
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
    </TreeTable>

    <div v-else class="mt-4">
        <div>
            Aún no se han agregado revisiones para esta auditoría.
        </div>
    </div>
    <div class="my-4">
        <div class="mb-4 mr-4 w-full justify-end flex" v-if="permisos.auditoriasEditar">
            <Button label="Agregar" @click="crearNuevaRevision" />
        </div>
    </div>

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
