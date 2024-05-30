<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';


import TablaElementosAsociados from '@/components/TablaElementosAsociados.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const migajasStore = useMigajasStore();
const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
        obj: null
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
        obj: null
    },
    riesgo: {
        id: null,
        nombre: route.params.nombre
    },
})

const riesgo = ref({
    nombre: '',
    descripcion: '',
    nivel: '',
    objetivos_control: [],
    revision_id: null,
    controles: [],
})

const obtenerInfoRiesgo = async () => {
    const idRiesgo = idsActivos.value.riesgo.id

    const { data } = await api.get(`/riesgos/${idRiesgo}`);
    riesgo.value = data;


    riesgo.value.objetivos_control = data.links
        .filter(li => li.entidad === 'objetivo_control')
        .map(oc => oc.id)

    // Los riesgo.oc tienen los datos de id, nombre, descripcion
    riesgo.value.oc = riesgo.value.objetivos_control.map(oc_id => {
        const ocEncontrado = objetivosControlDisponibles.value.find(oc => oc.id == oc_id)
        return { ...ocEncontrado }
    })
}

const establecerTitulo = async () => {
    if (route.params.idRiesgo === 'nuevo') {
        setTitulo('Nuevo riesgo')
        accion.value = 'nuevo'
        return
    }

    await obtenerInfoRiesgo()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar riesgo')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(riesgo.value.nombre)

}

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;
    const { idRiesgo } = route.params;
    const { nombre: nombreRies } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;
    idsActivos.value.auditoria.obj = data;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    idsActivos.value.revision.obj = revision;
    riesgo.value.revision_id = revision.id;

    if (idRiesgo === 'nuevo') {
        return
    } else {
        idsActivos.value.riesgo.id = parseInt(idRiesgo);
        if (nombreRies !== '') idsActivos.value.riesgo.nombre = nombreRies;
    }
}

async function getObjetivosControlDisponibles() {
    const { data } = await api.get('/objetivos_control');
    objetivosControlDisponibles.value = data;
}

function setMigajas() {
    const items = [
        { nombre: 'Auditorias', url: '/auditorias', title: 'Listado de auditorías' },
    ]

    // Auditoría
    const audit = idsActivos.value.auditoria.obj
    const urlAud = `/auditorias/${audit.sigla}/${adaptarTextoParaUrl(audit.nombre)}`
    items.push({
        nombre: audit.nombre,
        url: urlAud,
        title: 'Auditoría',
    })

    // Revisión
    const revision = idsActivos.value.revision.obj
    const urlRev = `/auditorias/${audit.sigla}/revisiones/${revision.sigla}/${adaptarTextoParaUrl(revision.nombre)}`
    items.push({
        nombre: revision.nombre,
        url: urlRev,
        title: 'Revisión',
    })

    const urlRiesgos = `/auditorias/${audit.sigla}/revisiones/${revision.sigla}/riesgos`

    items.push({
        nombre: 'Riesgos',
        url: urlRiesgos,
        title: 'Listado de riesgos',
    })

    migajasStore.items = items
}


async function inicializar() {
    await getIds()
    getObjetivosControlDisponibles()
    setMigajas()
    establecerTitulo()
    document.title = 'Riesgo'
    obtenerPermisos()
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})



function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearRiesgo()
    } else if (accion.value === 'editar') {
        actualizarRiesgo()
    }
}

async function actualizarRiesgo() {
    try {
        const riesgoActualizado = validarInputs()
        if (!riesgoActualizado) return

        // Se acondicionan los campos a los tipos esperados por la API
        riesgoActualizado.revision_id = idsActivos.value.revision.id
        riesgoActualizado.objetivos_control = Object.values(riesgoActualizado.objetivos_control)
        delete riesgoActualizado.oc
        delete riesgoActualizado.revision
        delete riesgoActualizado.documentos

        // console.log(riesgoActualizado)

        const { data } = await api.put(`/riesgos/${riesgoActualizado.id}`, riesgoActualizado);
        toast.add({ severity: 'success', summary: 'Riesgo actualizado', detail: 'El riesgo ha sido actualizado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idRiesgo: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el riesgo' + error, life: 3000 });
    }
}

function validarInputs() {
    const riesgoEnviar = { ...riesgo.value }

    if (riesgoEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre del riesgo es obligatorio', life: 3000 });
        return
    }

    if (riesgoEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción del riesgo es obligatoria', life: 3000 });
        return
    }

    if (riesgoEnviar.nivel === '') {
        toast.add({ severity: 'warn', summary: 'Nivel de riesgo', detail: 'Debes seleccionar un nivel de riesgo', life: 3000 });
        return
    }

    if (riesgoEnviar.objetivos_control.length === 0) {
        toast.add({ severity: 'warn', summary: 'Objetivos de control', detail: 'Debes seleccionar al menos un objetivo de control', life: 3000 });
        return
    }

    return riesgoEnviar
}

async function crearRiesgo() {
    try {

        const nuevoRiesgo = validarInputs()
        if (!nuevoRiesgo) return

        const { data } = await api.post('/riesgos', nuevoRiesgo);
        toast.add({ severity: 'success', summary: 'Riesgo creado', detail: 'El riesgo ha sido creado correctamente', life: 3000 });
        // console.log(data);
        router.push({ params: { idRiesgo: data.id.toString(), nombre: adaptarTextoParaUrl(data.nombre) } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el riesgo' + error, life: 3000 });
    }
}

function editarRiesgo() {
    // console.log('editar riesgo');
    router.push({ params: { nombre: 'editar' } })
}

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



const niveles = ['Alto', 'Medio', 'Bajo']
const objetivosControlDisponibles = ref([]);
const verDescripObjCtrl = ref(true)

</script>

<template>

    <!-- accion: {{ accion }} -->
    <!-- <hr> -->
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ riesgo.descripcion }}
                </div>
            </div>

            <div id="riesgo" class="my-2 flex flex-col">
                <label for="riesgo" class="font-semibold">Nivel de riesgo:</label>
                <div>
                    {{ riesgo.nivel }}
                </div>
            </div>

            <div id="objetivosControl" class="my-2 flex flex-col">
                <label for="objetivosControl" class="font-semibold cursor-help"
                    @click="verDescripObjCtrl = !verDescripObjCtrl"
                    :title="verDescripObjCtrl ? 'Ocultar descripciones' : 'Mostrar descripciones'">Objetivos de
                    control:</label>

                <ul class="mt-2 ml-6 list-disc" v-for="objetivo of riesgo.oc" :key="objetivo.id">
                    <li :title="objetivo.descripcion">
                        {{ objetivo.nombre }}
                        <div v-if="verDescripObjCtrl" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {{ objetivo.descripcion }}
                        </div>
                    </li>
                </ul>
            </div>

            <div class="flex justify-end mt-2">
                <Button label="Editar" @click="editarRiesgo" v-if="tienePermisoEdicion()" />
            </div>

            <TablaElementosAsociados :auditoria="idsActivos.auditoria" :revision="idsActivos.revision" tipo="riesgo"
                :objeto="riesgo" :funcionRecargarObjeto="obtenerInfoRiesgo" />

        </div>



    </template>


    <template v-else>

        <!-- Riesgo: {{ riesgo }} -->
        <!-- <hr> -->

        <!-- objetivosControlDisponibles: {{ objetivosControlDisponibles }} -->
        <!-- <hr> -->
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="riesgo.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="riesgo.descripcion" autoResize rows="5" cols="30" id="descripRies" />
            </div>

            <div id="riesgo" class="my-2 flex flex-col">
                <label for="riesgo" class="font-semibold">Nivel de riesgo</label>
                <Dropdown v-model="riesgo.nivel" :options="niveles" placeholder="Selecciona un nivel"
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="objetivosControl" class="my-2 flex flex-col">
                <label for="objetivosControl" class="font-semibold cursor-help"
                    @click="verDescripObjCtrl = !verDescripObjCtrl"
                    :title="verDescripObjCtrl ? 'Ocultar descripciones' : 'Mostrar descripciones'">Objetivos de
                    control</label>
                <div v-for="objetivo of objetivosControlDisponibles" :key="objetivo.id" class="my-2">
                    <Checkbox v-model="riesgo.objetivos_control" :inputId="objetivo.id.toString()" name="objetivo"
                        :value="objetivo.id" class="mr-2" />
                    <label :for="objetivo.id.toString()" class="italic">
                        {{ objetivo.nombre }}
                        <div v-if="verDescripObjCtrl" class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
                            {{ objetivo.descripcion }}
                        </div>
                    </label>
                </div>
            </div>

            <div class="flex justify-end" v-if="tienePermisoEdicion()">
                <Button :label="$route.params.idRiesgo === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
            </div>
        </div>
    </template>
    <!-- {{ $route.params }} -->
    <!-- <hr> -->
    <!-- {{ riesgo.documentos }} -->





</template>

<style>
#descripRies {
    line-height: 1.4rem;
}
</style>
