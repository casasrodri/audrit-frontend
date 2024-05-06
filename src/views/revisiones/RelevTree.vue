<script setup>
import { ref, watchEffect } from 'vue';
import api from '@/services/api.js';
import { Icon } from '@iconify/vue'
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';

const props = defineProps({
    ids: Object,
})

const relevamientos = ref([]);
async function getRelevamientos() {
    const { data: listRelev } = await api.get(`/relevamientos/revision/${props.ids.revision.id}/nodos`);
    relevamientos.value = listRelev;
}

const expandedKeys = ref({})

function onRowSelect(nodo) {
    const nodoKey = nodo.key;
    const estadoActual = expandedKeys.value[nodo.key] || false
    expandedKeys.value[nodo.key] = !estadoActual;
}

const iconos = {
    proceso: {
        icono: 'mdi:folder',
        color: '#215c77'
    },
    documento: {
        icono: 'mdi:file',
        color: '#4ebfbb'
    },
}

import { adaptarTextoParaUrl } from '@/utils/helpers.js'

function relevURL(relevamiento) {
    const idAud = props.ids.auditoria.sigla;
    const idRev = props.ids.revision.sigla;
    const idRelev = relevamiento.id;
    const nombre = adaptarTextoParaUrl(relevamiento.nombre);

    return `/auditorias/${idAud}/revisiones/${idRev}/relevamientos/${idRelev}/${nombre}`
}

watchEffect(() => {
    if (props.ids.revision.id != null) {
        getRelevamientos()
    }
})

</script>

<template>
    <div class="max-w-xl">
        <TreeTable :value="relevamientos" v-model:expandedKeys="expandedKeys" stripedRows
            :style="`min-width: ${relevamientos.length * 20}rem`"
            :pt="{ headerrow: 'hidden', row: 'flex gap-4', column: { bodycell: 'flex' } }"
            selectionMode="single" @nodeSelect="onRowSelect">
            <Column header="Sigla" expander headerStyle="max-width: rem">
                <template #body="slotProps">
                    <div class="flex place-items-center justify-between min-w-20">
                        <Icon :icon="iconos[slotProps.node.data.tipo].icono" width="24" height="24"
                            :color="iconos[slotProps.node.data.tipo].color" />
                        <span class="text-gray-400">
                            {{ slotProps.node.data.sigla }}
                        </span>
                    </div>
                </template>
            </Column>
            <Column header="Nombre" headerStyle="max-width: rem">
                <template #body="slotProps">
                    <template v-if="slotProps.node.data.tipo === 'documento'">
                        <RouterLink :to="relevURL(slotProps.node.data)"
                            class="flex place-items-center hover:font-medium">
                            {{ slotProps.node.data.nombre }}
                        </RouterLink>
                    </template>
                    <template v-else>
                        <span class="flex place-items-center hover:font-medium">
                            {{ slotProps.node.data.nombre }}
                        </span>
                    </template>
                </template>
            </Column>
        </TreeTable>
    </div>
</template>
