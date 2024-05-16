<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useDialog } from 'primevue/usedialog';
import AsociadorElem from '@/components/AsociadorElem.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
    },
    riesgo: {
        id: null,
        nombre: route.params.nombre
    },
})

const obtenerInfoRiesgo = async () => {
    const idRiesgo = idsActivos.value.riesgo.id

    const { data } = await api.get(`/riesgos/${idRiesgo}`);
    riesgo.value = data;

    riesgo.value.oc = { ...riesgo.value.objetivos_control }
    riesgo.value.objetivos_control = riesgo.value.objetivos_control.map(objCtrl => objCtrl.id)

    // Se determinan los documentos asociados al riesgo
    documentosAsociados.value = riesgo.value.documentos.map(doc => {
        const id = doc.relevamiento.id
        const nombre = doc.relevamiento.nombre
        const ries = riesgo.value
        const siglaAudit = ries.revision.auditoria.sigla
        const siglaRev = ries.revision.sigla

        return {
            id,
            nombre,
            link: `/auditorias/${siglaAudit}/revisiones/${siglaRev}/relevamientos/${id}`
        }
    })

    riesgo.value.controles = riesgo.value.controles.map(ctrl => {
        const id = ctrl.id
        const nombre = ctrl.nombre
        const ries = riesgo.value
        const siglaAudit = ries.revision.auditoria.sigla
        const siglaRev = ries.revision.sigla

        return {
            id,
            nombre,
            link: `/auditorias/${siglaAudit}/revisiones/${siglaRev}/controles/${id}`
        }
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

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
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

async function inicializar() {
    await getIds()
    establecerTitulo()
    getObjetivosControlDisponibles()
    document.title = 'Riesgo'
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})

const riesgo = ref({
    nombre: '',
    descripcion: '',
    nivel: '',
    objetivos_control: [],
    revision_id: null,
    controles: [],
})

const documentosAsociados = ref([])

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
        router.push({ params: { idRiesgo: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el riesgo' + error, life: 3000 });
    }
}

function editarRiesgo() {
    // console.log('editar riesgo');
    router.push({ params: { nombre: 'editar' } })
}

const dialog = useDialog();
const showProducts = () => {
    dialog.open(AsociadorElem, {
        data: {
            tipoOrigen: 'riesgo',
            origenId: idsActivos.value.riesgo.id,
            entidad: 'control',
            entidades: 'controles',
            revisionId: idsActivos.value.revision.id,
        },
        onClose: (opt) => {
            // console.log(opt)
            // const callbackParams = opt.data; // {selectedId: 12}
            // console.log(callbackParams)
            if (opt.type == 'config-close') obtenerInfoRiesgo()
        },
        props: {
            header: 'Asociar control relevante:',
            style: {
                width: '50vw',
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            maximizable: false,
        }
    });
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
                <div>
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
                <Button label="Editar" @click="editarRiesgo" />
            </div>

            <div id="relevamientosAsoc" class="tabla-links max-w-2xl my-2">
                <h3 class="font-semibold mb-2">Relevamientos asociados:</h3>
                <template v-if="documentosAsociados.length > 0">
                    <DataTable :value="documentosAsociados" class="border-x-[1px] border-t-[1px]">
                        <Column field="id" header="ID"></Column>
                        <Column header="Nombre">
                            <template #body="slotProps">
                                <RouterLink :to="slotProps.data.link">
                                    {{ slotProps.data.nombre }}
                                </RouterLink>
                            </template>
                        </Column>
                    </DataTable>
                </template>
                <template v-else>
                    <p>No existen asociaciones.</p>
                </template>
            </div>

            <div id="controlesAsoc" class="tabla-links max-w-2xl my-2">
                <h3 class="font-semibold">Controles relevantes asociados:</h3>
                <template v-if="riesgo.controles.length > 0">
                    <DataTable :value="riesgo.controles" class="border-x-[1px] border-t-[1px]">
                        <Column field="id" header="ID"></Column>
                        <Column header="Nombre">
                            <template #body="slotProps">
                                <RouterLink :to="slotProps.data.link">
                                    {{ slotProps.data.nombre }}
                                </RouterLink>
                            </template>
                        </Column>
                    </DataTable>
                </template>
                <template v-else>
                    <p>No existen asociaciones.</p>
                </template>
            </div>

            <button class="rounded-xl bg-[#0768a0] text-white p-2 px-7" @click="showProducts">
                + Asociar
            </button>
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

            <div class="flex justify-end">
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

#relevamientosAsoc thead>tr>th,
#relevamientosAsoc tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
