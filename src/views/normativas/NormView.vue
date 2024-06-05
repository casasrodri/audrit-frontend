<script setup>

import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { adaptarTextoParaUrl } from '@/utils/helpers.js'
import { useRouter, useRoute } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas';

const router = useRouter();
const route = useRoute();
const migajas = useMigajasStore();
const normativas = ref([]);

async function getNormativas() {
  const { data: listNormativas } = await api.get(`/normativas`);
  normativas.value = listNormativas;
}

onMounted(() => {
  getNormativas();
  setTitulo('Normativas');
  migajas.items = [
    { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    { nombre: 'Normativas', url: '/normativas', title: 'Listado de normativas' }
  ];

})


const onRowSelect = (row) => {
  const idNormativa = row.data.id;
  const nombreLargo = `${row.data.nomenclatura}-${row.data.nombre}`;
  const nombre = adaptarTextoParaUrl(nombreLargo);

  router.push(`/normativas/${idNormativa}/${nombre}`);
};

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

function nuevo() {
  router.push('/normativas/nuevo');
}
</script>


<template>
  <div class="flex flex-row">
    <DataTable id="tablaNormativas" :value="normativas" tableStyle="min-width: 50rem" stripedRows selectionMode="single"
      @rowSelect="onRowSelect">
      <Column field="id" header="ID"></Column>
      <Column header="Nombre">
        <template #body="slotProps">
          <span :title="slotProps.data.descripcion">
            {{ slotProps.data.nomenclatura }} - {{ slotProps.data.nombre }}
          </span>
        </template>
      </Column>
      <Column header="Emisor">
        <template #body="slotProps">
          <span v-if="slotProps.data.tipo === 'interna'">
            Interna
          </span>
          <span v-else>
            {{ slotProps.data.emisor }}
          </span>
        </template>
      </Column>
    </DataTable>
    <div class="mt-1 ml-4" v-if="permisos.auditoriasEditar">
      <Button label="Nueva" @click="nuevo" />
    </div>
  </div>
</template>


<style>
#tablaNormativas thead>tr>th,
#tablaNormativas tbody>tr>td {
  padding: 0.5rem !important;
}
</style>
