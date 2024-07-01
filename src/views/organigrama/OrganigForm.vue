<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import TablaElementosAsociados from '@/components/TablaElementosAsociados.vue';
import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const migajasStore = useMigajasStore();


const puestoFuncional = ref({
    nombre: '',
    descripcion: '',
    gerencia: '',
    personas: null,
    comentarios: null,
})



const inicializar = () => {
    establecerTitulo();
    setMigajas();
}
onMounted(inicializar)

const obtenerPuestoFuncional = async () => {
    const id = route.params.idOrganigrama;
    if (id !== 'nuevo') {
        const response = await api.get(`/organigramas/${id}`);
        if (response.data.personas) {
            response.data.personas = response.data.personas.split('|')
        }
        puestoFuncional.value = response.data;
    }
}



const establecerTitulo = async () => {
    if (route.params.idOrganigrama === 'nuevo') {
        setTitulo('Nuevo puesto funcional')
        accion.value = 'nuevo'
        return
    }

    await obtenerPuestoFuncional()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar puesto funcional')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(puestoFuncional.value.nombre)
}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
        { nombre: 'Organigrama', url: '/organigrama', title: 'Estructura funcional' }
    ];
}

watchEffect(() => {
    route.params
    inicializar()
})

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

function editarPuesto() {
    router.push({ params: { nombre: 'editar' } })
}

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearPuesto()
    } else if (accion.value === 'editar') {
        actualizarPuesto()
    }
}

async function crearPuesto() {
    try {
        const puestoNuevo = validarInputs()
        if (!puestoNuevo) return

        // Se acondicionan los campos a los tipos esperados por la API
        if (puestoNuevo.personas) {
            puestoNuevo.personas = puestoNuevo.personas.join('|')
        }

        const { data } = await api.post(`/organigramas`, puestoNuevo);
        toast.add({ severity: 'success', summary: 'Puesto creado', detail: 'El puesto funcional ha sido creado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idOrganigrama: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error('Error al crear el puesto:', error.response.data.detail);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

async function actualizarPuesto() {
    try {
        const puestoActualizado = validarInputs()
        if (!puestoActualizado) return

        // Se acondicionan los campos a los tipos esperados por la API
        puestoActualizado.personas = puestoActualizado.personas.join('|')

        const { data } = await api.put(`/organigramas/${puestoActualizado.id}`, puestoActualizado);
        toast.add({ severity: 'success', summary: 'Puesto actualizado', detail: 'El puesto funcional ha sido actualizado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idOrganigrama: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

function validarInputs() {
    const puestoEnviar = { ...puestoFuncional.value }
    let errors = false

    if (puestoEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre del puesto es obligatorio', life: 3000 });
        errors = true
    }

    if (puestoEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción del puesto es obligatoria', life: 3000 });
        errors = true
    }

    if (puestoEnviar.gerencia === '') {
        toast.add({ severity: 'warn', summary: 'Gerencia', detail: 'Debes indicar a que gerencia corresponde el puesto', life: 3000 });
        errors = true
    }

    if (!errors) return puestoEnviar
}

</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ puestoFuncional.descripcion }}
                </div>
            </div>

            <div id="gerencia" class="my-2 flex flex-col">
                <label for="gerencia" class="font-semibold">Gerencia:</label>
                <div>
                    {{ puestoFuncional.gerencia }}
                </div>
            </div>

            <div id="personas" class="my-2 flex flex-col">
                <label for="personas" class="font-semibold">Personas con este puesto:</label>
                <ul class="mt-2 ml-6 list-disc">
                    <li v-for="persona in puestoFuncional.personas" :key="persona">
                        {{ persona }}
                    </li>
                </ul>
            </div>

            <div id="comentarios" class="my-2 flex flex-col" v-if="puestoFuncional.comentarios">
                <label for="comentarios" class="font-semibold">Comentarios:</label>
                <div>
                    {{ puestoFuncional.comentarios || "Sin comentarios." }}
                </div>
            </div>

            <div class="flex justify-end mt-2" v-if="permisos.auditoriasEditar">
                <Button label="Editar" @click="editarPuesto" />
            </div>

            <TablaElementosAsociados tipo="organigrama" :objeto="puestoFuncional"
                :funcionRecargarObjeto="obtenerPuestoFuncional" />
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col min-w-4xl w-[26vw] mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="puestoFuncional.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="puestoFuncional.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="gerencia" class="mb-2 flex flex-col">
                <label for="gerencia" class="font-semibold">Gerencia</label>
                <InputText type="text" class="" v-model="puestoFuncional.gerencia" />
            </div>

            <div id="personas" class="mb-2 flex flex-col">
                <label for="personas" class="font-semibold">Personas con este puesto</label>
                <Chips v-model="puestoFuncional.personas" separator="," />
            </div>

            <div id="comentarios" class="my-2 flex flex-col">
                <label for="comentarios" class="font-semibold">Comentarios</label>
                <Textarea v-model="puestoFuncional.comentarios" autoResize rows="5" cols="30" id="descripCtrl" />
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
