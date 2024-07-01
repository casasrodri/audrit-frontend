<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import TablaElementosAsociados from '@/components/TablaElementosAsociados.vue';
import api from '@/services/api.js';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';
import { fechaFormato } from '@/utils/helpers.js';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const accion = ref('ver')
const migajasStore = useMigajasStore();
const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
        obj: null,
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
        obj: null,
    },
    observacion: {
        id: null,
        nombre: route.params.nombre
    },
})

const obtenerInfoObservacion = async () => {
    const idObservacion = idsActivos.value.observacion.id

    const { data } = await api.get(`/observaciones/${idObservacion}`);
    observacion.value = data;
}

const establecerTitulo = async () => {
    if (route.params.idObservacion === 'nuevo') {
        setTitulo('Nueva observación')
        accion.value = 'nuevo'
        return
    }

    await obtenerInfoObservacion()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar observación')
        console.log('editar')
        accion.value = 'editar'
        return
    }

    accion.value = 'ver'
    setTitulo(observacion.value.nombre)

}

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;
    const { idObservacion } = route.params;
    const { nombre: nombreObs } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;
    idsActivos.value.auditoria.obj = data;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    idsActivos.value.revision.obj = revision;
    observacion.value.revision_id = revision.id;

    if (idObservacion === 'nuevo') {
        return
    } else {
        idsActivos.value.observacion.id = parseInt(idObservacion);
        if (nombreObs !== '') idsActivos.value.observacion.nombre = nombreObs;
    }
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

    const urlObservaciones = `/auditorias/${audit.sigla}/revisiones/${revision.sigla}/observaciones`

    items.push({
        nombre: 'Observaciones',
        url: urlObservaciones,
        title: 'Listado de observaciones',
    })

    migajasStore.items = items
}

async function inicializar() {
    await getIds()
    setMigajas()
    establecerTitulo()
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})

const observacion = ref({
    nombre: '',
    descripcion: '',
    riesgo: '',
    responsable: '',
    estado: '',
    sector_auditoria: '',
    efectos: '',
    recomendaciones: '',
    fecha_alta: new Date(),
    fecha_solucion: null,
    revision_id: null
})

function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearObservacion()
    } else if (accion.value === 'editar') {
        actualizarObservacion()
    }
}

async function actualizarObservacion() {
    try {
        const observActualizada = validarInputs()
        if (!observActualizada) return

        // Se acondicionan los campos a los tipos esperados por la API
        observActualizada.revision_id = idsActivos.value.revision.id

        if (observActualizada.fecha_solucion) {
            observActualizada.fecha_solucion = observActualizada.fecha_solucion.toISOString().slice(0, 10)
        }

        console.log(observActualizada.fecha_solucion)
        const { data } = await api.put(`/observaciones/${observActualizada.id}`, observActualizada);
        toast.add({ severity: 'success', summary: 'Observacion actualizada', detail: 'La observación ha sido actualizada.', life: 3000 });
        // console.log(data);
        router.push({ params: { idObservacion: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar la observación' + error, life: 3000 });
    }
}

function validarInputs() {
    const observEnviar = { ...observacion.value }
    let errors = false

    if (observEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre de la observación es obligatorio', life: 3000 });
        errors = true
    }

    if (observEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción de la observación es obligatoria', life: 3000 });
        errors = true
    }

    if (observEnviar.riesgo === '') {
        toast.add({ severity: 'warn', summary: 'Nivel de riesgo', detail: 'Debes seleccionar un nivel de riesgo', life: 3000 });
        errors = true
    }

    if (observEnviar.responsable === '') {
        toast.add({ severity: 'warn', summary: 'Responsable', detail: 'Es obligatorio designar un responsable de solución/gestión de la observación', life: 3000 });
        errors = true
    }

    if (observEnviar.estado === '') {
        toast.add({ severity: 'warn', summary: 'Estado actual', detail: 'Debes seleccionar un estado para la observación', life: 3000 });
        errors = true
    }

    if (observEnviar.sector_auditoria === '') {
        toast.add({ severity: 'warn', summary: 'Sector de auditoría', detail: 'Debes seleccionar un sector de auditoría encargado del seguimiento', life: 3000 });
        errors = true
    }

    if (observEnviar.efectos === '') {
        toast.add({ severity: 'warn', summary: 'Efectos', detail: 'Debes indicar los efectos que genera la observación hallada', life: 3000 });
        errors = true
    }

    if (observEnviar.recomendaciones === '') {
        toast.add({ severity: 'warn', summary: 'Recomendaciones', detail: 'Debes mencionar las recomendaciones para la solución del desvío detectado', life: 3000 });
        errors = true
    }

    if (!errors) return observEnviar
}

async function crearObservacion() {
    try {

        const nuevaObservacion = validarInputs()
        if (!nuevaObservacion) return

        if (nuevaObservacion.fecha_alta) {
            nuevaObservacion.fecha_alta = nuevaObservacion.fecha_alta.toISOString().slice(0, 10)
        }

        console.log(nuevaObservacion);
        const { data } = await api.post('/observaciones', nuevaObservacion);
        toast.add({ severity: 'success', summary: 'Observación creada', detail: 'La observación ha sido creada correctamente', life: 3000 });
        // console.log(data);
        router.push({ params: { idObservacion: data.id.toString(), nombre: adaptarTextoParaUrl(data.nombre) } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear la observación' + error, life: 3000 });
    }
}

function editarObservacion() {
    router.push({ params: { nombre: 'editar' } })
}

const estadoOpts = [
    '[PFV] Pendientes con Fecha Vencida de regularización',
    '[PSF] Pendientes Sin Fecha de regularización',
    '[PCP] Pendientes sujetas al Cumplimiento de un Proyecto',
    '[PCF] Pendientes con fecha de regularización',
    '[SAV] Solucionada A Verificar',
    '[PRA] Pendiente de regularizar con Riesgo Asumido',
    '[PFR] Pendiente con Fecha Reprogramada',
    '[A] Adecuado',
    '[COO] Contenida en otra observación'
]
const sectorOpts = ['Auditoría Centralizada', 'Auditoría Continua', 'Auditoría Sistemas', 'Auditoría Sucursales']
const riesgoOpts = ['Alto', 'Medio', 'Bajo']

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

</script>

<template>
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col min-w-4xl w-[26vw] mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ observacion.descripcion }}
                </div>
            </div>

            <div id="riesgo" class="my-2 flex flex-col">
                <label for="riesgo" class="font-semibold">Riesgo:</label>
                <div>
                    {{ observacion.riesgo }}
                </div>
            </div>

            <div id="responsable" class="my-2 flex flex-col">
                <label for="responsable" class="font-semibold">Responsable:</label>
                <div>
                    {{ observacion.responsable }}
                </div>
            </div>

            <div id="estado" class="my-2 flex flex-col">
                <label for="estado" class="font-semibold">Estado actual:</label>
                <div>
                    {{ observacion.estado }}
                </div>
            </div>

            <div id="sector_auditoria" class="my-2 flex flex-col">
                <label for="sector_auditoria" class="font-semibold">Sector de auditoría:</label>
                <div>
                    {{ observacion.sector_auditoria }}
                </div>
            </div>

            <div id="efectos" class="my-2 flex flex-col">
                <label for="efectos" class="font-semibold">Efectos:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ observacion.efectos }}
                </div>
            </div>

            <div id="recomendaciones" class="my-2 flex flex-col">
                <label for="recomendaciones" class="font-semibold">Recomendaciones:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ observacion.recomendaciones }}
                </div>
            </div>

            <div id="fecha_alta" class="my-2 flex flex-col">
                <label for="fecha_alta" class="font-semibold">Fecha de alta:</label>
                <div>
                    {{ fechaFormato(observacion.fecha_alta) }}
                </div>
            </div>

            <div id="fecha_solucion" class="my-2 flex flex-col">
                <label for="fecha_solucion" class="font-semibold">Fecha de solución:</label>
                <div>
                    {{ fechaFormato(observacion.fecha_solucion) || 'Pendiente' }}
                </div>
            </div>

            <div class="flex justify-end mt-2 mr-8" v-if="permisos.auditoriasEditar">
                <Button label="Editar" @click="editarObservacion" />
            </div>

            <TablaElementosAsociados :auditoria="idsActivos.auditoria" :revision="idsActivos.revision"
                tipo="observacion" :objeto="observacion" :funcionRecargarObjeto="obtenerInfoObservacion" />
        </div>

    </template>

    <template v-else>
        <div id="container" class="flex flex-col min-w-4xl w-[26vw] mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="observacion.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="observacion.descripcion" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="riesgo" class="my-2 flex flex-col">
                <label for="riesgo" class="font-semibold">Riesgo</label>
                <Dropdown v-model="observacion.riesgo" :options="riesgoOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="responsable" class="mb-2 flex flex-col">
                <label for="responsable" class="font-semibold">Responsable</label>
                <InputText type="text" class="" v-model="observacion.responsable" />
            </div>

            <div id="estado" class="my-2 flex flex-col">
                <label for="estado" class="font-semibold">Estado actual</label>
                <Dropdown v-model="observacion.estado" :options="estadoOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[30rem]" />
            </div>

            <div id="sector" class="my-2 flex flex-col">
                <label for="sector" class="font-semibold">Sector de auditoría</label>
                <Dropdown v-model="observacion.sector_auditoria" :options="sectorOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[16rem]" />
            </div>

            <div id="efectos" class="my-2 flex flex-col">
                <label for="efectos" class="font-semibold">Efectos</label>
                <Textarea v-model="observacion.efectos" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="recomendaciones" class="my-2 flex flex-col">
                <label for="recomendaciones" class="font-semibold">Recomendaciones</label>
                <Textarea v-model="observacion.recomendaciones" autoResize rows="5" cols="30" id="descripCtrl" />
            </div>

            <div id="fecha_alta" class="mb-2 flex flex-col" v-if="accion === 'nuevo'">
                <label for="fecha_alta" class="font-semibold">Fecha de alta</label>
                <!-- <InputText type="text" class="" v-model="observacion.fecha_alta" /> -->
                <Calendar v-model="observacion.fecha_alta" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                    showButtonBar class="w-full md:w-[14rem]" />
            </div>

            <div id="fecha_solucion" class="mb-2 flex flex-col" v-if="accion !== 'nuevo'">
                <label for="fecha_solucion" class="font-semibold">Fecha de solución</label>
                <!-- <InputText type="text" class="" v-model="observacion.fecha_solucion" /> -->
                <Calendar v-model="observacion.fecha_solucion" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                    showButtonBar class="w-full md:w-[14rem]" />
            </div>

            <div class="flex justify-end" v-if="permisos.auditoriasEditar">
                <Button :label="accion === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
            </div>

            <!-- {{ observacion }} -->
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
