<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useDialog } from 'primevue/usedialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import AsociadorElem from '@/components/AsociadorElem.vue';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';
import api from '@/services/api.js';

const toast = useToast();
const confirm = useConfirm();
const linksActivos = ref([])

const props = defineProps({
    auditoria: Object,
    revision: Object,
    tipo: String,
    objeto: Object,
    funcionRecargarObjeto: Function,
})

const PLURALES = {
    relevamiento: 'relevamientos',
    control: 'controles',
    riesgo: 'riesgos',
    prueba: 'pruebas',
    observacion: 'observaciones',
    normativa: 'normativas',
    aplicacion: 'aplicaciones',
    organigrama: 'organigrama', // Queda en singular
}

const TIPOS_VISUALES = {
    relevamiento: 'Relevamientos',
    control: 'Controles',
    riesgo: 'Riesgos',
    prueba: 'Pruebas',
    observacion: 'Observaciones',
    aplicacion: 'Aplicaciones',
    normativa: 'Normativas',
    organigrama: 'Posiciones funcionales',
}

async function obtenerObjetoLink(obj) {
    const plural = PLURALES[obj.entidad]
    const nombre = adaptarTextoParaUrl(obj.nombre)

    // TODO Ver si se puede mostrar el nombre de la normativa
    let url
    if (['normativa', 'aplicacion', 'organigrama'].includes(obj.entidad)) {
        url = `/${plural}/${obj.id}/${nombre}`
    } else {
        let audit, rev
        if (!props.auditoria || !props.revision) {
            // Se obtiene la revision y auditoria
            const endpoint = PLURALES[obj.entidad]
            const { data } = await api.get(`/${endpoint}/${obj.id}`)
            audit = data.revision.auditoria.sigla
            rev = data.revision.sigla
        } else {
            audit = props.auditoria.sigla
            rev = props.revision.sigla
        }

        url = `/auditorias/${audit}/revisiones/${rev}/${plural}/${obj.id}/${nombre}`
    }

    return {
        id: obj.id,
        tipo: TIPOS_VISUALES[obj.entidad],
        nombre: obj.nombre,
        link: url
    }
}

watchEffect(async () => {

    const links = Object.values({ ...props.objeto.links })
    const sin_objetivo_control = links.filter(li => li.entidad !== 'objetivo_control')
    const objLinks = await Promise.all(sin_objetivo_control.map(async (obj) => await obtenerObjetoLink(obj)))

    linksActivos.value = objLinks
})

const dialog = useDialog();
const crearNuevoLink = () => {
    dialog.open(AsociadorElem, {
        data: {
            tipo: props.tipo,
            id: props.objeto.id,
            revisionId: props.revision.id,
        },
        onClose: (opt) => {
            // TODO: Ver como asociar si no tiene revisión ID
            // console.log(opt)
            // const callbackParams = opt.data; // {selectedId: 12}
            // console.log(callbackParams)
            if (opt.type == 'config-close') props.funcionRecargarObjeto()
        },
        props: {
            header: 'Nueva asociación',
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

const eliminarAsociacion = (event, slot) => {

    const ent1 = props.tipo
    const id1 = props.objeto.id
    const tipo2 = slot.data.tipo
    const ent2 = Object.keys(TIPOS_VISUALES).find(key => TIPOS_VISUALES[key] === tipo2)
    const id2 = slot.data.id
    const url = `/links/${ent1}/${id1}/${ent2}/${id2}`

    confirm.require({
        target: event.currentTarget,
        message: `Deseas eliminar la asociación con este ${ent2}?`,
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: async () => {
            console.log('Eliminando asociación...', url)
            try {
                const { data } = await api.delete(url)
                console.log(data)
                toast.add({ severity: 'success', summary: 'Asociación eliminada', detail: `Se ha eliminado con éxito la asociación al ${ent2}.`, life: 3000 });
                props.funcionRecargarObjeto()
            } catch (error) {
                console.error(error)
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la asociación.', life: 3000 });
            }
        },
        // reject: () => {
        //     toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        // }
    });
};

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <!-- {{ linksActivos }} -->
    <!-- <hr> -->
    <!-- {{ props.objeto.links }} -->
    <div id="linksAsociacion" class="tabla-links max-w-2xl my-2">
        <h3 class="font-semibold mb-2">Elementos asociados:</h3>
        <template v-if="linksActivos.length > 0">
            <DataTable :value="linksActivos" rowGroupMode="subheader" groupRowsBy="tipo" sortMode="single"
                sortField="tipo" :sortOrder="1" scrollable class="border-x-[1px] border-t-[1px] dark:border-slate-700">
                <Column field="tipo" header="Tipo"></Column>
                <Column field="id" header="ID" style="min-width: 10px; max-width: 20px;"></Column>
                <Column field="nombre" header="Nombre">
                    <template #body="slotProps">
                        <RouterLink :to="slotProps.data.link"
                            :class="{ 'text-red-500': slotProps.data.tipo === 'Observaciones' }">
                            {{ slotProps.data.nombre }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="acciones" header="" style="min-width: 10px" v-if="permisos.auditoriasEditar">
                    <template #body="slotProps">
                        <div @click="eliminarAsociacion($event, slotProps)" title="Eliminar asociación"
                            class="text-red-500 cursor-pointer" v-if="slotProps.data.tipo !== 'Relevamientos'">
                            <i class="pi pi-times p-1"></i>
                        </div>
                    </template>
                </Column>
                <template #groupheader="slotProps">
                    <span class="font-semibold">{{ slotProps.data.tipo }}</span>
                </template>
            </DataTable>
        </template>
        <template v-else>
            <p>No existen asociaciones.</p>
        </template>

        <div class="flex justify-end mt-2" v-if="permisos.auditoriasEditar">
            <Button label="Asociar" @click="crearNuevoLink" />
        </div>
    </div>
</template>

<style>
#linksAsociacion tr,
#linksAsociacion thead,
#linksAsociacion thead>tr>th,
#linksAsociacion tbody>tr>td {
    padding: 0.5rem !important;
    z-index: 10 !important;
}
</style>
