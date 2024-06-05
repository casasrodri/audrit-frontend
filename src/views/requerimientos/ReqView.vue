<script setup>

import { ref, onMounted, watchEffect } from 'vue';
import { useMigajasStore } from '@/stores/migajas';
import { useRouter, useRoute } from 'vue-router';
import { adaptarTextoParaUrl } from '@/utils/helpers.js'
import Button from 'primevue/button';
import api from '@/services/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SelectButton from 'primevue/selectbutton';

const migajasStore = useMigajasStore();
const cualesVer = ref('Activos');
const opcionesVer = ref(['Activos', 'Todos']);
const router = useRouter();
const route = useRoute();

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Requerimientos', url: '/requerimientos', title: 'Listado de requerimientos' },
    ]
}

onMounted(() => {
    getPedidos();
    setMigajas();
});

const usuarioId = ref(0);
const todosPedidos = ref([]);
const pedidosYoHice = ref([]);
const pedidosMeHicieron = ref([]);

watchEffect(() => {

    let auxTodos = [...todosPedidos.value];

    if (cualesVer.value === 'Activos') {
        auxTodos = auxTodos.filter(pedido => pedido.estado !== 'Finalizado');
    }

    pedidosYoHice.value = auxTodos.filter(pedido => pedido.creador.id === usuarioId.value);
    pedidosMeHicieron.value = auxTodos.filter(pedido => pedido.destinatario.id === usuarioId.value);
});

async function getUserId() {
    const user = await api.me();
    usuarioId.value = user.id
}

async function getPedidos() {
    await getUserId()
    const { data: listPedidos } = await api.get(`/pedidos/usuario/${usuarioId.value}`);
    todosPedidos.value = listPedidos;
}

const onRowSelect = (row) => {
    const idReq = row.data.id;
    const nombre = adaptarTextoParaUrl(row.data.nombre);
    router.push(`/requerimientos/${idReq}/${nombre}`);
};

function nuevoReq() {
    router.push('/requerimientos/nuevo');
}

function cambioSelector(e) {
    console.log(e)
}

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

</script>

<template>

    <div class="flex justify-end mt-2">
        <SelectButton v-model="cualesVer" :options="opcionesVer" :allowEmpty="false" @change="cambioSelector" />
    </div>

    <div id="containerYoHice" v-if="pedidosYoHice.length > 0">


        <h1 class="font-bold mt-6 mb-3">Requerimientos realizados</h1>

        <DataTable id="tablaRequerimientos" :value="pedidosYoHice" tableStyle="min-width: 50rem" stripedRows
            selectionMode="single" @rowSelect="onRowSelect">
            <Column field="id" header="ID"></Column>
            <Column header="Nombre">
                <template #body="slotProps">
                    <span :title="slotProps.data.descripcion">
                        {{ slotProps.data.nombre }}
                    </span>
                </template>
            </Column>
            <Column header="Responsable">
                <template #body="slotProps">
                    <span :title="slotProps.data.destinatario.rol.nombre">
                        {{ slotProps.data.destinatario.nombre_completo }}
                    </span>
                </template>
            </Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <span :title="slotProps.data.estado">
                        {{ slotProps.data.estado }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- <pre>{{ JSON.stringify(todosPedidos, null, 2) }}</pre> -->

    <div id="containerMeHicieron" v-if="pedidosMeHicieron.length > 0">

        <h1 class="font-bold mt-6 mb-3">Requerimientos recibidos</h1>

        <DataTable id="tablaRequerimientos" :value="pedidosMeHicieron" tableStyle="min-width: 50rem" stripedRows
            selectionMode="single" @rowSelect="onRowSelect">
            <Column field="id" header="ID"></Column>
            <Column header="Nombre">
                <template #body="slotProps">
                    <span :title="slotProps.data.descripcion">
                        {{ slotProps.data.nombre }}
                    </span>
                </template>
            </Column>
            <Column header="Solicitante">
                <template #body="slotProps">
                    <span :title="slotProps.data.creador.rol.nombre">
                        {{ slotProps.data.creador.nombre_completo }}
                    </span>
                </template>
            </Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <span :title="slotProps.data.estado">
                        {{ slotProps.data.estado }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>

    <div class="flex justify-end mt-3" v-if="permisos.auditoriasEditar">
        <Button label="Nuevo" @click="nuevoReq" />
    </div>
</template>


<style>
#tablaRequerimientos thead>tr>th,
#tablaRequerimientos tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
