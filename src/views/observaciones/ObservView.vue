<script setup>

import { ref, onMounted, watchEffect } from 'vue';
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


import SelectButton from 'primevue/selectbutton';
const cualesVer = ref('Pendientes');
const opcionesVer = ref(['Pendientes', 'Todas']);
const observacionesVer = ref([]);

watchEffect(() => {

  let auxTodos = [...observaciones.value];

  auxTodos.forEach(obs => {
    console.log(obs.estado)
  });

  if (cualesVer.value === 'Pendientes') {
    observacionesVer.value = auxTodos.filter(obs => obs.estado !== '[A] Adecuado');
  } else {
    observacionesVer.value = auxTodos;
  }

  // pedidosYoHice.value = auxTodos.filter(pedido => pedido.creador.id === usuarioId.value);
  // pedidosMeHicieron.value = auxTodos.filter(pedido => pedido.destinatario.id === usuarioId.value);
});

</script>

<template>
  <div v-if="observacionesVer.length > 0">
    <div class="flex justify-end mt-1 mb-4">
      <SelectButton v-model="cualesVer" :options="opcionesVer" :allowEmpty="false" />
    </div>

    <DataTable id="tablaObservaciones" :value="observacionesVer" tableStyle="min-width: 50rem" stripedRows
      selectionMode="single" @rowSelect="onRowSelect">
      <Column field="id" header="ID"></Column>
      <Column header="Auditoría">
        <template #body="slotProps">
          <span v-tooltip="slotProps.data.revision.auditoria.nombre">
            {{ slotProps.data.revision.auditoria.sigla }}
          </span>
        </template>
      </Column>
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
          <span v-tooltip="slotProps.data.estado">
            {{ parsearEstado(slotProps.data.estado) }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else>
    No existen observaciones creadas.
  </div>

</template>


<style>
#tablaObservaciones thead>tr>th,
#tablaObservaciones tbody>tr>td {
  padding: 0.5rem !important;
}
</style>
