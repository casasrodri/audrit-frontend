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

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const migajasStore = useMigajasStore();


const aplicacion = ref({
    nombre: '',
    descripcion: '',
    desarrollador: '',
    version: '',
    referentes: null,
    comentarios: null,
})

const inicializar = () => {
    establecerTitulo();
    setMigajas();
    obtenerPermisos()
}
onMounted(inicializar)

const obtenerAplicacion = async () => {
    const id = route.params.idAplicacion;
    if (id !== 'nuevo') {
        const { data } = await api.get(`/aplicaciones/${id}`);
        if (data.referentes) {
            data.referentes = data.referentes.split('|')
        }
        aplicacion.value = data;
    }
}


const establecerTitulo = async () => {
    if (route.params.idAplicacion === 'nuevo') {
        setTitulo('Nueva aplicación')
        accion.value = 'nuevo'
        return
    }

    await obtenerAplicacion()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar aplicación')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(aplicacion.value.nombre)
}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
        { nombre: 'Aplicaciones', url: '/aplicaciones', title: 'Listado de aplicaciones' }
    ];
}

watchEffect(() => {
    route.params
    inicializar()
})

const permisos = ref({ auditorias: '' })

async function obtenerPermisos() {
    const { data } = await api.get('/sesiones/me/menu')
    data.split('|').forEach(menu => {
        const array = menu.split(':')
        permisos.value[array[0]] = array[1]
    });
}

function tienePermisoEdicion() {
    return permisos.value.auditorias.includes('W')
}

function editarNormativa() {
    router.push({ params: { nombre: 'editar' } })
}

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearAplicacion()
    } else if (accion.value === 'editar') {
        actualizarAplicacion()
    }
}

async function crearAplicacion() {
    try {
        let aplicacionNueva = validarInputs()
        if (!aplicacionNueva) return

        // Se acondicionan los campos a los tipos esperados por la API
        aplicacionNueva = adaptarParaAPI(aplicacionNueva)

        const { data } = await api.post(`/aplicaciones`, aplicacionNueva);
        toast.add({ severity: 'success', summary: 'Aplicación creada', detail: 'La aplicación ha sido creada.', life: 3000 });
        // console.log(data);
        router.push({ params: { idAplicacion: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error('Error al crear la aplicación:', error.response.data.detail);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

function adaptarParaAPI(aplicacion) {
    aplicacion.referentes = aplicacion.referentes.join('|')

    return aplicacion
}

async function actualizarAplicacion() {
    try {
        let aplicacionActualizada = validarInputs()
        if (!aplicacionActualizada) return

        // Se acondicionan los campos a los tipos esperados por la API
        aplicacionActualizada = adaptarParaAPI(aplicacionActualizada)

        const { data } = await api.put(`/aplicaciones/${aplicacionActualizada.id}`, aplicacionActualizada);
        toast.add({ severity: 'success', summary: 'Aplicación actualizada', detail: 'La aplicación ha sido actualizada.', life: 3000 });
        // console.log(data);
        router.push({ params: { idAplicacion: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los cambios' + error, life: 3000 });
    }
}

function validarInputs() {
    const aplicacionEnviar = { ...aplicacion.value }
    let errors = false

    if (aplicacionEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre de la normativa es obligatorio', life: 3000 });
        errors = true
    }

    if (aplicacionEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción de la normativa es obligatoria', life: 3000 });
        errors = true
    }

    if (!errors) return aplicacionEnviar
}

</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ aplicacion.descripcion }}
                </div>
            </div>

            <div id="desarrollador" class="my-2 flex flex-col">
                <label for="desarrollador" class="font-semibold">Desarrollador:</label>
                <div>
                    {{ aplicacion.desarrollador }}
                </div>
            </div>

            <div id="version" class="my-2 flex flex-col">
                <label for="version" class="font-semibold">Versión:</label>
                <div>
                    {{ aplicacion.version }}
                </div>
            </div>

            <div id="referentes" class="my-2 flex flex-col">
                <label for="referentes" class="font-semibold">Referentes:</label>
                <ul class="mt-2 ml-6 list-disc">
                    <li v-for="ref in aplicacion.referentes" :key="ref">
                        {{ ref }}
                    </li>
                </ul>
            </div>

            <div id="comentarios" class="my-2 flex flex-col" v-if="aplicacion.comentarios">
                <label for="comentarios" class="font-semibold">Comentarios:</label>
                <div>
                    {{ aplicacion.comentarios || "Sin comentarios." }}
                </div>
            </div>

            <div class="flex justify-end mt-2" v-if="tienePermisoEdicion()">
                <Button label="Editar" @click="editarNormativa" />
            </div>

            <TablaElementosAsociados tipo="aplicacion" :objeto="aplicacion"
                :funcionRecargarObjeto="obtenerAplicacion" />
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col min-w-4xl w-[50vw] mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="aplicacion.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="aplicacion.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="desarrollador" class="mb-2 flex flex-col">
                <label for="desarrollador" class="font-semibold">Desarrollador</label>
                <InputText type="text" class="" v-model="aplicacion.desarrollador" />
            </div>

            <div id="version" class="mb-2 flex flex-col">
                <label for="version" class="font-semibold">Versión</label>
                <InputText type="text" class="" v-model="aplicacion.version" />
            </div>

            <div id="referentes" class="mb-2 flex flex-col">
                <label for="referentes" class="font-semibold">Referentes</label>
                <Chips v-model="aplicacion.referentes" separator="," />
            </div>

            <div id="comentarios" class="my-2 flex flex-col">
                <label for="comentarios" class="font-semibold">Comentarios</label>
                <Textarea v-model="aplicacion.comentarios" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div class="flex justify-end" v-if="tienePermisoEdicion()">
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
