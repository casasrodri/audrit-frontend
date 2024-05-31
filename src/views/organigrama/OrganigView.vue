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
const organigrama = ref([]);

async function getOrganigrama() {
  const { data: listOrganigramas } = await api.get(`/organigramas`);
  organigrama.value = listOrganigramas;
}

onMounted(() => {
  getOrganigrama();
  setTitulo('Organigrama');
  migajas.items = [
    { nombre: 'Organigrama', url: '/organigrama', title: 'Estructura funcional' }
  ];
  obtenerPermisos()
})


const onRowSelect = (row) => {
  const idPuesto = row.data.id;
  const nombre = adaptarTextoParaUrl(row.data.nombre);

  router.push(`/organigrama/${idPuesto}/${nombre}`);
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
  router.push('/organigrama/nuevo');
}

</script>


<template>
  <div class="flex flex-row">
    <DataTable id="tablaOrganigrama" :value="organigrama" tableStyle="min-width: 50rem" stripedRows
      selectionMode="single" @rowSelect="onRowSelect">
      <Column field="id" header="ID"></Column>
      <Column header="Nombre">
        <template #body="slotProps">
          <span :title="slotProps.data.descripcion">
            {{ slotProps.data.nombre }}
          </span>
        </template>
      </Column>
      <Column field="gerencia" header="Gerencia"></Column>
    </DataTable>
    <div class="mt-1 ml-4" v-if="permisos.auditorias.includes('W')">
      <Button label="Nueva" @click="nuevo" title="Nueva posición funcional" />
    </div>
  </div>
</template>


<style>
#tablaOrganigrama thead>tr>th,
#tablaOrganigrama tbody>tr>td {
  padding: 0.5rem !important;
}
</style>
