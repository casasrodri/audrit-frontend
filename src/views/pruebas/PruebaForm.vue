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
    prueba: {
        id: null,
        nombre: route.params.nombre
    },
})

const obtenerInfoPrueba = async () => {
    const idPrueba = idsActivos.value.prueba.id

    const { data } = await api.get(`/pruebas/${idPrueba}`);
    prueba.value = data;

    // // Se determinan los documentos asociados al prueba
    // documentosAsociados.value = control.value.documentos.map(doc => {
    //     const id = doc.relevamiento.id
    //     const nombre = doc.relevamiento.nombre
    //     const ctrl = control.value
    //     const siglaAudit = ctrl.revision.auditoria.sigla
    //     const siglaRev = ctrl.revision.sigla

    //     return {
    //         id,
    //         nombre,
    //         link: `/auditorias/${siglaAudit}/revisiones/${siglaRev}/relevamientos/${id}`
    //     }
    // })
}

const establecerTitulo = async () => {
    if (route.params.idPrueba === 'nuevo') {
        setTitulo('Nueva prueba de auditoría')
        accion.value = 'nuevo'
        return
    }

    await obtenerInfoPrueba()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar prueba de auditoría')
        console.log('editar')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(prueba.value.nombre)

}

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;
    const { idPrueba } = route.params;
    const { nombre: nombrePru } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    prueba.value.revision_id = revision.id;

    if (idPrueba === 'nuevo') {
        return
    } else {
        idsActivos.value.prueba.id = parseInt(idPrueba);
        if (nombrePru !== '') idsActivos.value.prueba.nombre = nombrePru;
    }
}

async function inicializar() {
    await getIds()
    establecerTitulo()
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})

const prueba = ref({
    nombre: '',
    descripcion: '',
    sector: '',
    informe: '',
    revision_id: null
})

// const documentosAsociados = ref([])
// const pruebasAsociadas = ref([])

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearPrueba()
    } else if (accion.value === 'editar') {
        actualizarPrueba()
    }
}

async function actualizarPrueba() {
    try {
        const pruebaActualizada = validarInputs()
        if (!pruebaActualizada) return

        // Se acondicionan los campos a los tipos esperados por la API
        pruebaActualizada.revision_id = idsActivos.value.revision.id
        // delete pruebaActualizada.revision
        // delete pruebaActualizada.documentos

        const { data } = await api.put(`/pruebas/${pruebaActualizada.id}`, pruebaActualizada);
        toast.add({ severity: 'success', summary: 'Prueba actualizada', detail: 'La prueba ha sido actualizado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idPrueba: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar la prueba' + error, life: 3000 });
    }
}

function validarInputs() {
    const pruebaEnviar = { ...prueba.value }
    let errors = false

    if (pruebaEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre de la prueba es obligatorio', life: 3000 });
        errors = true
    }

    if (pruebaEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción de la prueba es obligatoria', life: 3000 });
        errors = true
    }

    if (pruebaEnviar.sector === '') {
        toast.add({ severity: 'warn', summary: 'Sector encargado', detail: 'Debes seleccionar qué sector realizará la prueba', life: 3000 });
        errors = true
    }

    if (pruebaEnviar.informe === '') {
        toast.add({ severity: 'warn', summary: 'Informe relacionado', detail: 'Debes indicar en qué informe se reflejarán los resultados de la prueba', life: 3000 });
        errors = true
    }

    if (!errors) return pruebaEnviar
}

async function crearPrueba() {
    try {

        const nuevaPrueba = validarInputs()
        if (!nuevaPrueba) return

        console.log(nuevaPrueba);
        const { data } = await api.post('/pruebas', nuevaPrueba);
        toast.add({ severity: 'success', summary: 'Prueba creada', detail: 'La prueba ha sido creada correctamente', life: 3000 });
        // console.log(data);
        router.push({ params: { idPrueba: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear la prueba' + error, life: 3000 });
    }
}

function editarPrueba() {
    router.push({ params: { nombre: 'editar' } })
}



const sectorOpts = ['Auditoría Centralizada', 'Auditoría Continua', 'Auditoría Sistemas', 'Auditoría Sucursales']


</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div>
                    {{ prueba.descripcion }}
                </div>
            </div>

            <div id="sector" class="my-2 flex flex-col">
                <label for="sector" class="font-semibold">Sector encargado:</label>
                <div>
                    {{ prueba.sector }}
                </div>
            </div>

            <div id="informe" class="my-2 flex flex-col">
                <label for="informe" class="font-semibold">Informe relacionado:</label>
                <div>
                    {{ prueba.informe }}
                </div>
            </div>

            <div class="flex justify-end mt-2">
                <Button label="Editar" @click="editarPrueba" />
            </div>

            <!-- TODO
            <div id="relevamientosAsoc" class="max-w-2xl my-2">
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
                    <p>No hay relevamientos asociados a este control relevante.</p>
                </template>
</div> -->

            <!-- ---------------------------------------------------------------------------------- -->
            <!-- <div id="pruebasAsoc" class="max-w-2xl my-2">
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
                    <p>No hay pruebas asociadas a este control relevante.</p>
                </template>
            </div> -->
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col max-w-2xl min-w-2xl mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="prueba.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="prueba.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="sector" class="my-2 flex flex-col">
                <label for="sector" class="font-semibold">Sector encargado</label>
                <Dropdown v-model="prueba.sector" :options="sectorOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="informe" class="mb-2 flex flex-col">
                <label for="informe" class="font-semibold">Informe relacionado</label>
                <InputText type="text" class="" v-model="prueba.informe" />
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

#pruebasAsoc thead>tr>th,
#pruebasAsoc tbody>tr>td,
#relevamientosAsoc thead>tr>th,
#relevamientosAsoc tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
