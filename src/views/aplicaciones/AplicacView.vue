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
const aplicaciones = ref([]);

async function getAplicaciones() {
  const { data: listAplicaciones } = await api.get(`/aplicaciones`);
  aplicaciones.value = listAplicaciones;
}

onMounted(() => {
  getAplicaciones();
  setTitulo('Aplicaciones');
  migajas.items = [
    { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    { nombre: 'Aplicaciones', url: '/aplicaciones', title: 'Listado de aplicaciones' }
  ];
  obtenerPermisos()
})


const onRowSelect = (row) => {
  const idAplicacion = row.data.id;
  const nombre = adaptarTextoParaUrl(row.data.nombre);

  router.push(`/aplicaciones/${idAplicacion}/${nombre}`);
};

const permisos = ref({ auditorias: '' })

async function obtenerPermisos() {
  const { data } = await api.get('/sesiones/me/menu')
  data.split('|').forEach(menu => {
    const array = menu.split(':')
    permisos.value[array[0]] = array[1]
  });
  // permisos.auditorias.includes('W')
}

function nuevo() {
  router.push('/aplicaciones/nuevo');
}

</script>

<template>
  <div class="flex flex-row">
    <DataTable id="tablaAplicaciones" :value="aplicaciones" tableStyle="min-width: 50rem" stripedRows
      selectionMode="single" @rowSelect="onRowSelect">
      <Column field="id" header="ID"></Column>
      <Column header="Nombre">
        <template #body="slotProps">
          <span :title="slotProps.data.descripcion">
            {{ slotProps.data.nombre }}
          </span>
        </template>
      </Column>
      <Column field="version" header="Versión"></Column>
    </DataTable>
    <div class="mt-1 ml-4" v-if="permisos.auditorias.includes('W')">
      <Button label="Nueva" @click="nuevo" />
    </div>
  </div>
</template>


<style>
#tablaAplicaciones thead>tr>th,
#tablaAplicaciones tbody>tr>td {
  padding: 0.5rem !important;
}
</style>
