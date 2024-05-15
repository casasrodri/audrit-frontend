<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';

import RelevTree from '@/views/revisiones/RelevTree.vue';
import RiesgosTabla from '@/views/revisiones/RiesgosTabla.vue';
import ControlesTabla from '@/views/revisiones/ControlesTabla.vue';
import PruebasTabla from '@/views/revisiones/PruebasTabla.vue';

import api from '@/services/api.js';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const route = useRoute();
const router = useRouter();
const tabsDisponibles = ['relevamientos', 'riesgos', 'controles', 'pruebas']
const selectedTab = ref(0);

const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
        obj: null
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
        obj: null
    },
})

function selectTab() {
    const indice = tabsDisponibles.indexOf(route.params.tab);

    if (indice === -1) {
        router.replace({ params: { tab: 'relevamientos' } })
        selectedTab.value = 0;
    } else {
        selectedTab.value = indice;
    }
}

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;
    idsActivos.value.auditoria.obj = data;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    idsActivos.value.revision.obj = revision;
}

onMounted(async () => {
    selectTab()
    await getIds()
    setTitulo(idsActivos.value.revision.obj.nombre)
    document.title = `Revisión - ${idsActivos.value.revision.obj.nombre}`
})

watchEffect(() => {
    const seleccionada = tabsDisponibles[selectedTab.value];
    router.replace({ params: { tab: seleccionada } })
})

</script>

<template>
    <TabView v-model:activeIndex="selectedTab">
        <TabPanel header="Relevamientos">
            <RelevTree :ids="idsActivos" />
        </TabPanel>
        <TabPanel header="Riesgos">
            <RiesgosTabla :ids="idsActivos" />
        </TabPanel>
        <TabPanel header="Controles">
            <ControlesTabla :ids="idsActivos" />
        </TabPanel>
        <TabPanel header="Pruebas">
            <PruebasTabla :ids="idsActivos" />
        </TabPanel>
    </TabView>
</template>
