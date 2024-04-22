<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

import api from '@/services/api.js';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { Icon } from '@iconify/vue'

const route = useRoute();
const router = useRouter();
const tabsDisponibles = ['relevamientos', 'riesgos', 'controles', 'pruebas']
const selectedTab = ref(0);
const relevamientos = ref([]);
const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
    },
})

function selectTab() {
    const indice = tabsDisponibles.indexOf(route.query.tab);

    if (indice === -1) {
        router.replace({ query: { tab: 'relevamientos' } })
        selectedTab.value = 0;
    } else {
        selectedTab.value = indice;
    }
}

async function getRelevamientos() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;

    const { data: listRelev } = await api.get(`/relevamientos/revision/${idsActivos.value.revision.id}/nodos`);

    relevamientos.value = listRelev;
}

onMounted(selectTab)
onMounted(getRelevamientos)

watchEffect(() => {
    const seleccionada = tabsDisponibles[selectedTab.value];
    router.replace({ query: { tab: seleccionada } })
})

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
    const idAud = idsActivos.value.auditoria.sigla;
    const idRev = idsActivos.value.revision.sigla;
    const idRelev = relevamiento.id;
    const nombre = adaptarTextoParaUrl(relevamiento.nombre);

    return `/auditorias/${idAud}/revisiones/${idRev}/relevamientos/${idRelev}/${nombre}`
}

</script>

<template>
    <TabView v-model:activeIndex="selectedTab">
        <TabPanel header="Relevamientos">
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

        </TabPanel>
        <TabPanel header="Riesgos">
            <p class="m-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
            </p>
        </TabPanel>
        <TabPanel header="Controles">
            <p class="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                provident, similique sunt in culpa qui
                officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
                expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
            </p>
        </TabPanel>
        <TabPanel header="Pruebas">
            <p class="m-0">
                Sit a veritatis nostrum.
                Non deserunt vitae cumque.
                Accusantium ratione accusamus sint!
                Dolores quod animi molestias.
                Facilis quo molestias veritatis.
                Exercitationem qui itaque iure.
                Placeat vero ex a.
                Perspiciatis quasi id cupiditate!
                Veritatis soluta ullam nesciunt?
                Vitae corporis voluptas voluptatem.
                Cumque a nisi deserunt?
                Velit, recusandae? Magni, perferendis.
                Dolorum quisquam corrupti illo.
                A architecto amet velit.
                Quibusdam blanditiis ex totam.
                Consequatur aut enim tempore!
            </p>
        </TabPanel>
    </TabView>
</template>
