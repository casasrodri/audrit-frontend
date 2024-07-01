<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('nuevo')
const migajasStore = useMigajasStore();


const auditoria = ref({
    sigla: '',
    nombre: '',
    tipo: '',
    periodo: '',
    estado: 'pendiente',
})

const inicializar = () => {
    establecerTitulo();
    setMigajas();
}
onMounted(inicializar)

const obtenerAuditoria = async () => {
    if (route.name === 'nuevaAuditoria') return

    const id = route.params.siglaAudit;
    const { data } = await api.get(`/auditorias/sigla/${id}`);
    auditoria.value = data;
}


const establecerTitulo = async () => {
    if (route.name === 'nuevaAuditoria') {
        setTitulo('Nueva auditoría')
        accion.value = 'nuevo'
        return
    }

    await obtenerAuditoria()

    if (route.name === 'editarAuditoria') {
        setTitulo('Editar auditoría')
        accion.value = 'editar'
        return
    }
}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    ];
}

watchEffect(() => {
    route.params
    inicializar()
})

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearAuditoria()
    } else if (accion.value === 'editar') {
        actualizarAuditoria()
    }
}

async function crearAuditoria() {
    try {
        let auditoriaNueva = validarInputs()
        if (!auditoriaNueva) return

        // Se acondicionan los campos a los tipos esperados por la API
        auditoriaNueva = adaptarParaAPI(auditoriaNueva)

        // console.log(auditoriaNueva);
        const { data } = await api.post(`/auditorias`, auditoriaNueva);
        toast.add({ severity: 'success', summary: 'Auditoría creada', detail: 'La auditoría ha sido creada.', life: 3000 });
        router.push({ name: 'auditoria', params: { siglaAudit: data.sigla, nombre: adaptarTextoParaUrl(data.nombre) } })
    } catch (error) {
        console.error('Error al crear la auditoría:', error.response.data.detail);
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 3000 });
    }
}

function adaptarParaAPI(auditoria) {
    return auditoria
}

async function actualizarAuditoria() {
    try {
        let auditoriaActualizada = validarInputs()
        if (!auditoriaActualizada) return

        // Se acondicionan los campos a los tipos esperados por la API
        auditoriaActualizada = adaptarParaAPI(auditoriaActualizada)

        console.log(auditoriaActualizada)
        const { data } = await api.put(`/auditorias/${auditoriaActualizada.id}`, auditoriaActualizada);
        toast.add({ severity: 'success', summary: 'Auditoría actualizada', detail: 'La auditoría ha sido actualizada.', life: 3000 });
        // console.log(data);
        router.push({ name: 'auditoria', params: { siglaAudit: data.sigla, nombre: adaptarTextoParaUrl(data.nombre) } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 3000 });
    }
}

function validarInputs() {
    const auditoriaEnviar = { ...auditoria.value }
    let errors = false

    if (auditoriaEnviar.sigla === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El identificador de la auditoría es obligatorio', life: 3000 });
        errors = true
    }

    if (auditoriaEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre de la auditoría es obligatorio', life: 3000 });
        errors = true
    }

    if (auditoriaEnviar.tipo === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'El tipo de la auditoría es obligatorio', life: 3000 });
        errors = true
    }

    if (auditoriaEnviar.periodo === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'El periodo de la auditoría es obligatorio', life: 3000 });
        errors = true
    }

    if (!errors) return auditoriaEnviar
}

const tipoOpts = ['anual', 'especial']
const estadoOpts = ['pendiente', 'iniciada', 'finalizada']

</script>

<template>
    <div id="container" class="flex flex-col min-w-4xl w-[26vw] mb-5">

        <div id="sigla" class="mb-2 flex flex-col">
            <label for="sigla" class="font-semibold">Identificador</label>
            <InputText type="text" class="" v-model="auditoria.sigla" />
        </div>

        <div id="nombre" class="mb-2 flex flex-col">
            <label for="nombre" class="font-semibold">Nombre</label>
            <InputText type="text" class="" v-model="auditoria.nombre" />
        </div>

        <div id="tipo" class="my-2 flex flex-col">
            <label for="tipo" class="font-semibold">Tipo</label>
            <Dropdown v-model="auditoria.tipo" :options="tipoOpts" placeholder="Seleccionar..."
                class="w-full md:w-[14rem]" />
        </div>

        <div id="periodo" class="mb-2 flex flex-col">
            <label for="periodo" class="font-semibold">Periodo</label>
            <InputText type="text" class="" v-model="auditoria.periodo" />
        </div>

        <div id="estado" class="flex flex-col" v-if="accion === 'editar'">
            <label for="estado" class="font-semibold">Estado</label>
            <Dropdown v-model="auditoria.estado" :options="estadoOpts" placeholder="Seleccionar..."
                class="w-full md:w-[14rem]" />
        </div>

        <div class="flex justify-end" v-if="permisos.auditoriasEditar">
            <Button :label="accion === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
        </div>
    </div>

</template>
