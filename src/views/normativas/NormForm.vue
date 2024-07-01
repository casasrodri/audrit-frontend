<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import TablaElementosAsociados from '@/components/TablaElementosAsociados.vue';
import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';
import { fechaFormato, capitalizeFirstLetter } from '@/utils/helpers.js';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const migajasStore = useMigajasStore();


const normativa = ref({
    nomenclatura: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    emisor: '',
    fecha_emision: new Date(),
    fecha_actualizacion: new Date(),
    comentarios: null,
})

const inicializar = () => {
    establecerTitulo();
    setMigajas();
}
onMounted(inicializar)

const obtenerNormativa = async () => {
    const id = route.params.idNormativa;
    if (id !== 'nuevo') {
        const { data } = await api.get(`/normativas/${id}`);
        data.tipo = capitalizeFirstLetter(data.tipo)
        data.fecha_emision = new Date(data.fecha_emision.replace('-', ','))
        data.fecha_actualizacion = new Date(data.fecha_actualizacion.replace('-', ','))
        normativa.value = data;
    }
}


const establecerTitulo = async () => {
    if (route.params.idNormativa === 'nuevo') {
        setTitulo('Nueva normativa')
        accion.value = 'nuevo'
        return
    }

    await obtenerNormativa()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar normativa')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(`${normativa.value.nomenclatura} - ${normativa.value.nombre}`)
}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
        { nombre: 'Normativas', url: '/normativas', title: 'Listado de normativas' }
    ];
}

watchEffect(() => {
    route.params
    inicializar()
})

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

function editarNormativa() {
    router.push({ params: { nombre: 'editar' } })
}

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearNormativa()
    } else if (accion.value === 'editar') {
        actualizarNormativa()
    }
}

async function crearNormativa() {
    try {
        let normativaNuevo = validarInputs()
        if (!normativaNuevo) return

        // Se acondicionan los campos a los tipos esperados por la API
        normativaNuevo = adaptarParaAPI(normativaNuevo)

        console.error('Data enviada:', normativaNuevo)
        const { data } = await api.post(`/normativas`, normativaNuevo);
        toast.add({ severity: 'success', summary: 'Normativa creada', detail: 'La normativa ha sido creada.', life: 3000 });
        // console.log(data);
        router.push({ params: { idNormativa: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error('Error al crear la normativa:', error.response.data.detail);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

function adaptarParaAPI(normativa) {
    normativa.tipo = normativa.tipo.toLowerCase()

    if (typeof normativa.fecha_emision === 'object') {
        normativa.fecha_emision = normativa.fecha_emision.toISOString().slice(0, 10)
    }

    if (typeof normativa.fecha_actualizacion === 'object') {
        normativa.fecha_actualizacion = normativa.fecha_actualizacion.toISOString().slice(0, 10)
    }

    return normativa
}

async function actualizarNormativa() {
    try {
        let normaActualizada = validarInputs()
        if (!normaActualizada) return

        // Se acondicionan los campos a los tipos esperados por la API
        normaActualizada = adaptarParaAPI(normaActualizada)

        const { data } = await api.put(`/normativas/${normaActualizada.id}`, normaActualizada);
        toast.add({ severity: 'success', summary: 'Normativa actualizada', detail: 'La normativa ha sido actualizada.', life: 3000 });
        // console.log(data);
        router.push({ params: { idNormativa: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

function validarInputs() {
    const normativaEnviar = { ...normativa.value }
    let errors = false

    if (normativaEnviar.nomenclatura === '') {
        toast.add({ severity: 'warn', summary: 'Nomenclatura', detail: 'La nomenclatura de la normativa es obligatoria', life: 3000 });
        errors = true
    }

    if (normativaEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre de la normativa es obligatorio', life: 3000 });
        errors = true
    }

    if (normativaEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción de la normativa es obligatoria', life: 3000 });
        errors = true
    }

    if (normativaEnviar.tipo === '') {
        toast.add({ severity: 'warn', summary: 'Tipo de normativa', detail: 'Debes indicar a que tipo corresponde la normativa', life: 3000 });
        errors = true
    }

    if (normativaEnviar.emisor === '') {
        toast.add({ severity: 'warn', summary: 'Emisor', detail: 'Debes indicar el emisor de la normativa', life: 3000 });
        errors = true
    }

    if (normativaEnviar.fecha_emision === '') {
        toast.add({ severity: 'warn', summary: 'Fecha de emisión', detail: 'Debes indicar la fecha de emisión de la normativa', life: 3000 });
        errors = true
    }

    if (normativaEnviar.fecha_actualizacion === '') {
        toast.add({ severity: 'warn', summary: 'Fecha de actualización', detail: 'Debes indicar la fecha de actualización de la normativa', life: 3000 });
        errors = true
    }

    if (normativaEnviar.fecha_actualizacion < normativaEnviar.fecha_emision) {
        toast.add({ severity: 'warn', summary: 'Fecha de actualización', detail: 'La fecha de actualización no puede ser anterior a la emisión', life: 3000 });
        errors = true
    }

    if (!errors) return normativaEnviar
}

const tipoOpts = ['Interna', 'Externa']

</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ normativa.descripcion }}
                </div>
            </div>

            <div id="tipo" class="my-2 flex flex-col">
                <label for="tipo" class="font-semibold">Tipo:</label>
                <div>
                    {{ normativa.tipo }}
                </div>
            </div>

            <div id="emisor" class="my-2 flex flex-col">
                <label for="emisor" class="font-semibold">Emisor:</label>
                <div>
                    {{ normativa.emisor }}
                </div>
            </div>

            <div id="fecha_emision" class="my-2 flex flex-col">
                <label for="fecha_emision" class="font-semibold">Fecha de emisión:</label>
                <div>
                    {{ normativa.fecha_emision.toLocaleDateString() }}
                </div>
            </div>

            <div id="fecha_actualizacion" class="my-2 flex flex-col">
                <label for="fecha_actualizacion" class="font-semibold">Fecha de actualización:</label>
                <div>
                    {{ normativa.fecha_actualizacion.toLocaleDateString() }}
                </div>
            </div>

            <div id="comentarios" class="my-2 flex flex-col" v-if="normativa.comentarios">
                <label for="comentarios" class="font-semibold">Comentarios:</label>
                <div>
                    {{ normativa.comentarios || "Sin comentarios." }}
                </div>
            </div>

            <div class="flex justify-end mt-2" v-if="permisos.auditoriasEditar">
                <Button label="Editar" @click="editarNormativa" />
            </div>

            <TablaElementosAsociados tipo="normativa" :objeto="normativa" :funcionRecargarObjeto="obtenerNormativa" />
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col min-w-4xl w-[26vw] mb-5">
            <div id="nomenclatura" class="mb-2 flex flex-col">
                <label for="nomenclatura" class="font-semibold">Nomenclatura</label>
                <InputText type="text" class="" v-model="normativa.nomenclatura" />
            </div>

            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="normativa.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="normativa.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="tipo" class="my-2 flex flex-col">
                <label for="tipo" class="font-semibold">Tipo</label>
                <Dropdown v-model="normativa.tipo" :options="tipoOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="emisor" class="mb-2 flex flex-col">
                <label for="emisor" class="font-semibold">Emisor</label>
                <InputText type="text" class="" v-model="normativa.emisor" />
            </div>

            <div id="fecha_emision" class="mb-2 flex flex-col">
                <label for="fecha_emision" class="font-semibold">Fecha de emisión:</label>
                <Calendar v-model="normativa.fecha_emision" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                    showButtonBar class="w-full md:w-[14rem]" />
            </div>

            <div id="fecha_actualizacion" class="mb-2 flex flex-col">
                <label for="fecha_actualizacion" class="font-semibold">Fecha de actualización:</label>
                <Calendar v-model="normativa.fecha_actualizacion" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                    :minDate="normativa.fecha_emision" showButtonBar class="w-full md:w-[14rem]" />
            </div>

            <div id="comentarios" class="my-2 flex flex-col">
                <label for="comentarios" class="font-semibold">Comentarios</label>
                <Textarea v-model="normativa.comentarios" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div class="flex justify-end" v-if="permisos.auditoriasEditar">
                <Button :label="accion === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
            </div>

        </div>
    </template>

</template>

<style>
#descripCtrl {
    line-height: 1.4rem;
}

#pruebasAsoc thead>tr>th,
#pruebasAsoc tbody>tr>td,
#relevamientosAsoc thead>tr>th,
#relevamientosAsoc tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
