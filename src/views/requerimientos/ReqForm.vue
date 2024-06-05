<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import api from '@/services/api.js';

import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import ComentariosRequerim from '@/components/ComentariosRequerim.vue';
import ArchivosRequerim from '@/components/ArchivosRequerim.vue';

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

const pedido = ref({
    nombre: '',
    descripcion: '',
    estado: 'Solicitado',
    fecha_vencimiento: '',
    creador_id: '',
    creador: {
        rol: '',
    },
    destinatario_id: '',
    destinatario: {
        nombre_completo: '',
        rol: '',
    },
})

const obtenerInfoPedido = async () => {
    const { idRequerimiento } = route.params;
    const { data } = await api.get(`/pedidos/${idRequerimiento}`);
    pedido.value = data;
}

const establecerTitulo = async () => {
    if (route.params.idRequerimiento === 'nuevo') {
        setTitulo('Nuevo requerimiento')
        accion.value = 'nuevo'
        return
    }

    await obtenerInfoPedido()

    if (route.params.nombre === 'editar') {
        setTitulo('Editar requerimiento')
        accion.value = 'editar'
        usuarioBuscado.value = pedido.value.destinatario.nombre_completo
        pedido.value.fecha_vencimiento = new Date(pedido.value.fecha_vencimiento.replace('-', ','))
        return
    }

    accion.value = 'ver'
    setTitulo(pedido.value.nombre)

}

function setMigajas() {
    migajasStore.items = [
        { nombre: 'Requerimientos', url: '/requerimientos', title: 'Listado de requerimientos' },
    ]
}

async function inicializar() {
    setMigajas()
    establecerTitulo()
}

onMounted(inicializar)

watchEffect(() => {
    route.params
    inicializar()
})


function handleGuardarBoton() {
    if (accion.value === 'nuevo') {
        crearPedido()
    } else if (accion.value === 'editar') {
        actualizarPedido()
    }
}

async function actualizarPedido() {
    try {
        const pedidoActualizado = validarInputs()
        if (!pedidoActualizado) return

        // Se acondicionan los campos a los tipos esperados por la API
        pedidoActualizado.destinatario_id = pedidoActualizado.destinatario.id

        if (pedidoActualizado.fecha_vencimiento) {
            pedidoActualizado.fecha_vencimiento = pedidoActualizado.fecha_vencimiento.toISOString().slice(0, 10)
        }

        // console.log(pedidoActualizado)

        const { data } = await api.put(`/pedidos/${pedidoActualizado.id}`, pedidoActualizado);
        toast.add({ severity: 'success', summary: 'Requerimiento actualizado', detail: 'El requerimiento ha sido actualizado.', life: 3000 });
        // console.log(data);
        router.push({ params: { idRequerimiento: data.id.toString(), nombre: data.nombre } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el requerimiento' + error, life: 3000 });
    }
}

function validarInputs() {
    const pedidoEnviar = { ...pedido.value }
    console.log({ pedidoEnviar })
    let errors = false

    if (pedidoEnviar.nombre === '') {
        toast.add({ severity: 'warn', summary: 'Nombre', detail: 'El nombre del requerimiento es obligatorio', life: 3000 });
        errors = true
    }

    if (pedidoEnviar.descripcion === '') {
        toast.add({ severity: 'warn', summary: 'Descripción', detail: 'La descripción del requerimiento es obligatoria', life: 3000 });
        errors = true
    }

    if (pedidoEnviar.estado === '') {
        toast.add({ severity: 'warn', summary: 'Estado', detail: 'Debes seleccionar un estado válido para el requerimiento', life: 3000 });
        errors = true
    }

    if (pedidoEnviar.fecha_vencimiento === '') {
        toast.add({ severity: 'warn', summary: 'Fecha de vencimiento', detail: 'Es obligatorio designar una fecha de vencimiento para la entrega de este requerimiento', life: 3000 });
        errors = true
    }

    if (pedidoEnviar.destinatario === '') {
        toast.add({ severity: 'warn', summary: 'Destinatario', detail: 'Debes seleccionar el usuario que recibirá la solicitud', life: 3000 });
        errors = true
    }

    if (pedidoEnviar.destinatario.id === undefined) {
        toast.add({ severity: 'warn', summary: 'Destinatario', detail: 'Debes seleccionar un usuario válido', life: 3000 });
        errors = true
    }

    if (!errors) return pedidoEnviar
}

async function crearPedido() {
    try {
        const nuevoPedido = validarInputs()
        if (!nuevoPedido) return

        if (nuevoPedido.fecha_vencimiento) {
            nuevoPedido.fecha_vencimiento = nuevoPedido.fecha_vencimiento.toISOString().slice(0, 10)
        }

        // Se obtiene el id del usuario loggeado
        const user = await api.me();
        nuevoPedido.creador_id = user.id

        // console.log(nuevoPedido);

        const { data } = await api.post('/pedidos', nuevoPedido);
        toast.add({ severity: 'success', summary: 'Requerimiento creado', detail: 'El requerimiento ha sido creado correctamente', life: 3000 });
        // console.log(data);
        router.push({ params: { idRequerimiento: data.id.toString(), nombre: adaptarTextoParaUrl(data.nombre) } })
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el requerimiento' + error, life: 3000 });
    }
}

function editarPedido() {
    router.push({ params: { nombre: 'editar' } })
}

const estadoOpts = [
    'Solicitado',
    'Enviado',
    'Recibido',
    'Finalizado',
]



import AutoComplete from 'primevue/autocomplete';
const usuarioBuscado = ref('')
const sugerenciasUsuarios = ref([])

async function buscarUsuario() {
    const texto = usuarioBuscado.value
    const url = `/usuarios/buscar/${texto}`
    const { data } = await api.get(url)
    sugerenciasUsuarios.value = data
}

watchEffect(() => {
    if (accion.value !== 'ver') {
        if (usuarioBuscado.value.id) {
            pedido.value.destinatario = usuarioBuscado.value
            pedido.value.destinatario_id = usuarioBuscado.value.id
        }
    }
})

import { usePermisos } from '@/composables/permisos.js';
const permisos = usePermisos()

</script>

<template>
    <!-- <pre>{{ JSON.stringify(pedido, null, 2) }}</pre>
    <div class="font-bold">Variable: usuarioBuscado</div>
    <pre>{{ JSON.stringify(usuarioBuscado, null, 2) }}</pre> -->
    <template v-if="accion === 'ver'">
        <div id="container" class="flex flex-col max-w-2xl mb-5">
            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción:</label>
                <div class="max-w-2xl text-wrap whitespace-pre">
                    {{ pedido.descripcion }}
                </div>
            </div>

            <div id="estado" class="my-2 flex flex-col">
                <label for="estado" class="font-semibold">Estado:</label>
                <div>
                    {{ pedido.estado }}
                </div>
            </div>

            <div id="fecha_vencimiento" class="my-2 flex flex-col">
                <label for="fecha_vencimiento" class="font-semibold">Fecha de vencimiento:</label>
                <div>
                    {{ fechaFormato(pedido.fecha_vencimiento) }}
                </div>
            </div>

            <div id="destinatario" class="my-2 flex flex-col">
                <label for="destinatario" class="font-semibold">Solicitado a:</label>
                <div>
                    <span :title="pedido.destinatario.rol.nombre">
                        {{ pedido.destinatario.nombre_completo }}
                    </span>
                </div>
            </div>

            <div id="creador" class="my-2 flex flex-col">
                <label for="creador" class="font-semibold">Solicitado por:</label>
                <div>
                    <span :title="pedido.creador.rol.nombre">
                        {{ pedido.creador.nombre_completo }}
                    </span>
                </div>
            </div>

            <div class="flex justify-end mt-2">
                <Button label="Editar" @click="editarPedido" v-if="permisos.auditoriasEditar" />
            </div>


            <ComentariosRequerim />
            <ArchivosRequerim />
        </div>
    </template>

    <template v-else>
        <div id="container" class="flex flex-col min-w-4xl w-[50vw] mb-5">
            <div id="nombre" class="mb-2 flex flex-col">
                <label for="nombre" class="font-semibold">Nombre</label>
                <InputText type="text" class="" v-model="pedido.nombre" />
            </div>

            <div id="descripcion" class="my-2 flex flex-col">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea v-model="pedido.descripcion" autoResize rows="5" cols="30" id="descripPedido" />
            </div>

            <div id="estado" class="my-2 flex flex-col">
                <label for="estado" class="font-semibold">Estado</label>
                <Dropdown v-model="pedido.estado" :options="estadoOpts" placeholder="Seleccionar..."
                    class="w-full md:w-[14rem]" />
            </div>

            <div id="fecha_alta" class="my-2 flex flex-col">
                <label for="fecha_alta" class="font-semibold">Fecha de vencimiento</label>
                <Calendar v-model="pedido.fecha_vencimiento" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                    showButtonBar class="w-full md:w-[14rem]" />
            </div>

            <div id="destinatario" class="my-2 flex flex-col">
                <label for="destinatario" class="font-semibold">Solicitado a</label>
                <AutoComplete v-model="usuarioBuscado" :suggestions="sugerenciasUsuarios" optionLabel="nombre_completo"
                    @complete="buscarUsuario" class="w-full md:w-[20rem]" />
            </div>

            <div class="flex justify-end" v-if="permisos.auditoriasEditar">
                <Button :label="accion === 'nuevo' ? 'Crear' : 'Guardar'" @click="handleGuardarBoton" />
            </div>
        </div>
    </template>
</template>

<style>
#descripPedido {
    line-height: 1.4rem;
}

#pruebasAsoc thead>tr>th,
#pruebasAsoc tbody>tr>td,
#relevamientosAsoc thead>tr>th,
#relevamientosAsoc tbody>tr>td {
    padding: 0.5rem !important;
}
</style>
