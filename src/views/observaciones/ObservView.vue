<script setup>

import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { adaptarTextoParaUrl } from '@/utils/helpers.js'
import { useRouter, useRoute } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas';

const router = useRouter();
const route = useRoute();
const migajas = useMigajasStore();
const observaciones = ref([]);

async function getObservaciones() {
  const { data: listObservaciones } = await api.get(`/observaciones`);
  observaciones.value = listObservaciones;
}

onMounted(() => {
  getObservaciones();
  document.title = 'Observaciones'
  setTitulo('Observaciones');
  migajas.items = [
    { nombre: 'Observaciones', url: '/observaciones' }
  ];
})


const colores = {
  'Bajo': 'success',
  'Medio': 'warning',
  'Alto': 'danger',
}

const onRowSelect = (row) => {
  const siglaAudit = row.data.revision.auditoria.sigla;
  const siglaRevision = row.data.revision.sigla;
  const idObserv = row.data.id;
  const nombre = adaptarTextoParaUrl(row.data.nombre);

  router.push(`/auditorias/${siglaAudit}/revisiones/${siglaRevision}/observaciones/${idObserv}/${nombre}`);
};

function parsearEstado(estado) {
  return estado.split(']')[0].split('[')[1]
}



</script>

<template>
  <DataTable id="tablaObservaciones" :value="observaciones" tableStyle="min-width: 50rem" stripedRows
    selectionMode="single" @rowSelect="onRowSelect">
    <Column field="id" header="ID"></Column>
    <Column header="Nombre">
      <template #body="slotProps">
        <span :title="slotProps.data.descripcion">
          {{ slotProps.data.nombre }}
        </span>
      </template>
    </Column>
    <Column header="Riesgo">
      <template #body="slotProps">
        <Tag :severity="colores[slotProps.data.riesgo]" :value="slotProps.data.riesgo"></Tag>
      </template>
    </Column>
    <Column header="Estado">
      <template #body="slotProps">
        <span :title="slotProps.data.estado">
          {{ parsearEstado(slotProps.data.estado) }}
        </span>
      </template>
    </Column>
  </DataTable>

</template>


<style>
#tablaObservaciones thead>tr>th,
#tablaObservaciones tbody>tr>td {
  padding: 0.5rem !important;
}
</style>
