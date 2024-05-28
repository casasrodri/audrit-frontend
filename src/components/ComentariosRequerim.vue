<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api.js';

import ComentarioIndividual from './ComentarioIndividual.vue';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Badge from 'primevue/badge';

const route = useRoute();
const toast = useToast();
const mostrarDetalle = ref(false);
const mensaje = ref('');
const usuarioId = ref();
const comentarios = ref([]);

function toggleDetalle() {
    mostrarDetalle.value = !mostrarDetalle.value;
}

async function enviarMensaje() {
    const req = route.params.idRequerimiento
    if (!mensaje.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El mensaje no puede estar vacío',
            life: 3000
        });
        return;
    }

    try {
        await api.post(`/pedidos/${req}/comentario`, {
            texto: mensaje.value,
            usuario_id: usuarioId.value
        });

        toast.add({
            severity: 'success',
            summary: 'Mensaje enviado',
            detail: 'El mensaje se ha enviado correctamente',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo enviar el mensaje',
            life: 3000
        });
    }

    mensaje.value = '';
    obtenerComentarios();
}

function identificarUsuario() {
    document.cookie.split(';').forEach(e => {
        if (e.includes('idUsuario')) {
            usuarioId.value = e.split('=')[1].trim();
        }
    })
}

async function obtenerComentarios() {
    const req = route.params.idRequerimiento
    try {
        const { data } = await api.get(`/pedidos/${req}`);
        comentarios.value = data.comentarios;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron obtener los comentarios',
            life: 3000
        });
    }
}

onMounted(() => {
    identificarUsuario()
    obtenerComentarios()
})
</script>

<template>
    <span class="cursor-pointer mt-2" @click="toggleDetalle">
        <span class="font-semibold" v-if="mostrarDetalle">
            Comentarios:
        </span>
        <span v-else>
            <span class="font-semibold">
                Comentarios
            </span>
            <Badge :value="comentarios.length" severity="info" />
        </span>
    </span>
    <div id="container" v-if="mostrarDetalle">
        <div v-if="comentarios.length > 0" id="container"
            class="flex flex-col gap-2 mt-3 min-w-96 border-[1px] rounded-md bg-slate-50 dark:bg-slate-700">
            <ComentarioIndividual v-for="comentario in comentarios" :key="comentario.id" :comentario="comentario"
                class="my-2" />
        </div>
        <div v-else class="ml-2 text-sm mb-2">
            No hay comentarios.
        </div>
        <InputGroup class="mt-1 mb-3">
            <InputText v-model="mensaje" placeholder="Escribe tu mensaje..." @keyup.enter="enviarMensaje" />
            <Button icon="pi pi-send" severity="success" @click="enviarMensaje" />
        </InputGroup>
    </div>

</template>
