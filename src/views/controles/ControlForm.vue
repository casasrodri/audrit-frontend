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
    control: {
        id: null,
        nombre: route.params.nombre
    },
})

const obtenerInfoControl = async () => {
    const idControl = idsActivos.value.control.id

    const { data } = await api.get(`/controles/${idControl}`);
    control.value = data;

    // Se determinan los documentos asociados al control
    documentosAsociados.value = control.value.documentos.map(doc => {
        const id = doc.relevamiento.id
        const nombre = doc.relevamiento.nombre
        const ctrl = control.value
        const siglaAudit = ctrl.revision.auditoria.sigla
        const siglaRev = ctrl.revision.sigla

        return {
            id,
            nombre,
            link: `/auditorias/${siglaAudit}/revisiones/${siglaRev}/relevamientos/${id}`
        }
    })

    control.value.riesgos = control.value.riesgos.map(riesgo => {
        const id = riesgo.id
        const nombre = riesgo.nombre
        const siglaAudit = control.value.revision.auditoria.sigla
        const siglaRev = control.value.revision.sigla

        return {
            id,
            nombre,
            link: `/auditorias/${siglaAudit}/revisiones/${siglaRev}/riesgos/${id}`
        }
    })
}

const establecerTitulo = async () => {
    if (route.params.idControl === 'nuevo') {
        setTitulo('Nuevo control')
        accion.value = 'nuevo'
        return
    }

    await obtenerInfoControl()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar control')
        console.log('editar')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(control.value.nombre)

}

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;
    const { idControl } = route.params;
    const { nombre: nombreCtrl } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    control.value.revision_id = revision.id;

    if (idControl === 'nuevo') {
        return
    } else {
        idsActivos.value.control.id = parseInt(idControl);
        if (nombreCtrl !== '') idsActivos.value.control.nombre = nombreCtrl;
    }
}

async function inicializar() {
    await getIds()
    establecerTitulo()
    document.title = 'Control'
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})

const control = ref({
    nombre: '',
    descripcion: '',
    ejecutor: '',
    oportunidad: '',
    periodicidad: '',
    automatizacion: '',
    revision_id: null,
    riesgos: [],
})

const documentosAsociados = ref([])
const pruebasAsociadas = ref([])

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearControl()
    } else if (accion.value === 'editar') {
        actualizarControl()
    }
}

async function actualizarControl() {
    try {
        const controlActualizado = validarInputs()
        if (!controlActualizado) return

        // Se acondicionan los campos a los tipos esperados por la API
        controlActualizado.revision_id = idsActivos.value.revision.id
        delete controlActualizado.revision
        delete controlActualizado.documentos

        const { data } = await api.put(`/controles/${controlActualizado.id}`, controlActualizado);
        toast.add({ severity: 'success', summary: 'Control actualizado', detail: 'El control ha sido actualizado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idControl: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el control' + error, life: 3000 });
    }
}

function validarInputs() {
    const controlEnviar = { ...control.value }
    let errors = false

    if (controlEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre del control es obligatorio', life: 3000 });
        errors = true
    }

    if (controlEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción del control es obligatoria', life: 3000 });
        errors = true
    }

    if (controlEnviar.ejecutor === '') {
        toast.add({ severity: 'warn', summary: 'Dueño del control', detail: 'Debes indicar quién realiza el control', life: 3000 });
        errors = true
    }

    if (controlEnviar.oportunidad === '') {
        toast.add({ severity: 'warn', summary: 'Oportunidad', detail: 'Debes seleccionar una de las tipificaciones disponibles', life: 3000 });
        errors = true
    }

    if (controlEnviar.periodicidad === '') {
        toast.add({ severity: 'warn', summary: 'Periodicidad', detail: 'Debes seleccionar una de las tipificaciones disponibles', life: 3000 });
        errors = true
    }

    if (controlEnviar.automatizacion === '') {
        toast.add({ severity: 'warn', summary: 'Automatización', detail: 'Debes seleccionar una de las tipificaciones disponibles', life: 3000 });
        errors = true
    }

    if (!errors) return controlEnviar
}

async function crearControl() {
    try {

        const nuevoControl = validarInputs()
        if (!nuevoControl) return

        console.log(nuevoControl);
        const { data } = await api.post('/controles', nuevoControl);
        toast.add({ severity: 'success', summary: 'Control creado', detail: 'El control ha sido creado correctamente', life: 3000 });
        // console.log(data);
        router.push({ params: { idControl: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el control' + error, life: 3000 });
    }
}

function editarControl() {
    router.push({ params: { nombre: 'editar' } })
}



const oportunidadOpts = ['Preventivo', 'Correctivo', 'Detectivo']
const periodicidadOpts = ['Permanente', 'Periódico', 'Ocasional']
const automatizacionOpts = ['Automatizado', 'Semi-automatizado', 'Manual']


</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div>
                    {{ control.descripcion }}
                </div>
            </div>

            <div id="ejecutor" class="my-2 flex flex-col">
                <label for="ejecutor" class="font-semibold">Realizado por:</label>
                <div>
                    {{ control.ejecutor }}
                </div>
            </div>

            <div id="oportunidad" class="my-2 flex flex-col">
                <label for="oportunidad" class="font-semibold">Oportunidad:</label>
                <div>
                    {{ control.oportunidad }}
                </div>
            </div>

            <div id="periodicidad" class="my-2 flex flex-col">
                <label for="periodicidad" class="font-semibold">Periodicidad:</label>
                <div>
                    {{ control.periodicidad }}
                </div>
            </div>

            <div id="automatizacion" class="my-2 flex flex-col">
                <label for="automatizacion" class="font-semibold">Automatización:</label>
                <div>
                    {{ control.automatizacion }}
                </div>
            </div>


            <div class="flex justify-end mt-2">
                <Button label="Editar" @click="editarControl" />
            </div>

            <div id="relevamientosAsoc" class="tabla-links max-w-2xl my-2">
                <h3 class="font-semibold">Relevamientos asociados:</h3>
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

            <div id="riesgosAsoc" class="tabla-links max-w-2xl my-2">
                <h3 class="font-semibold">Riesgos asociados:</h3>
                <template v-if="control.riesgos.length > 0">
                    <DataTable :value="control.riesgos" class="border-x-[1px] border-t-[1px]">
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

            <!-- ---------------------------------------------------------------------------------- -->
            <div id="pruebasAsoc" class="tabla-links max-w-2xl my-2">
                <h3 class="font-semibold mb-2">Pruebas de auditoría relacionadas:</h3>
                <template v-if="pruebasAsociadas.length > 0">
                    <DataTable :value="pruebasAsociadas" class="border-x-[1px] border-t-[1px]">
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
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="control.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="control.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="ejecutor" class="mb-2 flex flex-col">
                <label for="ejecutor" class="font-semibold">Realizado por:</label>
                <InputText type="text" class="" v-model="control.ejecutor" />
            </div>

            <div id="oportunidad" class="my-2 flex flex-col">
                <label for="oportunidad" class="font-semibold">Oportunidad:</label>
                <Dropdown v-model="control.oportunidad" :options="oportunidadOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="periodicidad" class="my-2 flex flex-col">
                <label for="periodicidad" class="font-semibold">Periodicidad:</label>
                <Dropdown v-model="control.periodicidad" :options="periodicidadOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="automatizacion" class="my-2 flex flex-col">
                <label for="automatizacion" class="font-semibold">Automatización:</label>
                <Dropdown v-model="control.automatizacion" :options="automatizacionOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div class="flex justify-end">
                <Button :label="accion === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
            </div>
        </div>
    </template>
</template>

<style>
#descripCtrl {
    line-height: 1.4rem;
}


.tabla-links th,
.tabla-links td {
    padding: 0.5rem !important;
}
</style>
