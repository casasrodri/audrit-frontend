<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';
import RelevTree from '@/views/revisiones/RelevTree.vue';
import RiesgosTabla from '@/views/revisiones/RiesgosTabla.vue';
import ControlesTabla from '@/views/revisiones/ControlesTabla.vue';
import PruebasTabla from '@/views/revisiones/PruebasTabla.vue';
import ObservTabla from '@/views/revisiones/ObservTabla.vue';

import api from '@/services/api.js';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

const route = useRoute();
const router = useRouter();
const tabsDisponibles = ['relevamientos', 'riesgos', 'controles', 'pruebas', 'observaciones']
const selectedTab = ref(0);
const migajasStore = useMigajasStore();

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

function setMigajas() {
    const items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    ]

    // Auditoría
    const audit = idsActivos.value.auditoria.obj
    const urlAud = `/auditorias/${audit.sigla}/${adaptarTextoParaUrl(audit.nombre)}`
    items.push({
        nombre: audit.nombre,
        url: urlAud,
        title: 'Auditoría',
    })

    // Revisión
    const revision = idsActivos.value.revision.obj
    let auxPadre = revision
    const urlRev = `/auditorias/${audit.sigla}/revisiones`

    const subitems = []
    while (auxPadre) {
        const texto_url = adaptarTextoParaUrl(auxPadre.nombre)
        subitems.unshift({
            nombre: auxPadre.nombre,
            sigla: auxPadre.sigla,
            url: `${urlRev}/${auxPadre.sigla}/${texto_url}`,
            title: 'Revisión',
        })
        auxPadre = auxPadre.padre
    }

    items.push(...subitems)

    migajasStore.items = items
}

onMounted(async () => {
    selectTab()
    await getIds()
    setTitulo(idsActivos.value.revision.obj.nombre)
    document.title = `Revisión - ${idsActivos.value.revision.obj.nombre}`
    setMigajas()
})

watchEffect(() => {
    const seleccionada = tabsDisponibles[selectedTab.value];
    router.replace({ params: { tab: seleccionada } })
})

function nuevo() {
    if (route.params.tab == 'relevamientos') {
        alert('Ver como los creamos!')
    } else {
        router.push(route.fullPath + '/nuevo')
    }
}

</script>

<template>
    <div class="flex flex-row">
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
            <TabPanel header="Observaciones">
                <ObservTabla :ids="idsActivos" />
            </TabPanel>
        </TabView>
        <div class="mt-1 ml-4">
            <Button label="Nuevo" @click="nuevo" />
        </div>
    </div>
</template>
