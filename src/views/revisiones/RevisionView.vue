<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';

import RelevTree from '@/views/revisiones/RelevTree.vue';
import RiesgosTabla from '@/views/revisiones/RiesgosTabla.vue';

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
