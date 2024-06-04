<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import api from '@/services/api.js'
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import ContextMenu from 'primevue/contextmenu';
import { useMenuStore } from '@/stores/menuLateral.js'
const menuStore = useMenuStore()

const config = {
    texto: 'Asistente',
    icono: 'ri:robot-3-line',
}

const visible = ref(false)
const textoBuscado = ref('')
watch(visible, () => textoBuscado.value = '')

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'a') {
        visible.value = true
        e.preventDefault();
    }

    return true
})

let ws = null
const streaming = ref(false)


function crearWebSocket() {
    ws = new WebSocket("ws://localhost:8000/api/v1/asistente/ws");
    ws.onopen = function () {
        // console.log('Conectado al servidor')
    }

    ws.onclose = function () {
        // console.log('Desconectado del servidor')
        textoBuscado.value = 'Servidor desconectado.'
        streaming.value = true
    }

    ws.onmessage = function (event) {
        if (event.data === 'ACK:FIN') {
            // Se veulve a habilitar el input
            textoBuscado.value = ''
            streaming.value = false
        } else {
            const ult_mensaje = mensajes.value[mensajes.value.length - 1]
            ult_mensaje.text = ult_mensaje.text + event.data
            // console.log(ult_mensaje.text)
        }
    };
}

function enviarMensaje() {
    if (textoBuscado.value === '') return
    if (streaming.value) return
    ws.send(textoBuscado.value)

    // Se agrega el mensaje del usuario
    mensajes.value.push({
        role: 'user',
        text: textoBuscado.value,
    })

    // Se agrega el mensaje del bot:
    mensajes.value.push({
        role: 'bot',
        text: '',
    })

    textoBuscado.value = ''
    streaming.value = true
}

function asistenteAbierto() {
    mensajes.value = []
    crearWebSocket()
    textoBuscado.value = ''
    streaming.value = false
}

function asistenteCerrado() {
    mensajes.value = []
    ws.close()
    streaming.value = false
}

const mensajes = ref([])

const user = ref('Yo')
onMounted(async () => {
    const data = await api.me()
    user.value = data.nombre
})


const items = ref([
    {
        label: 'Actualizar Documentos',
        icon: 'pi pi-sync',
        command: async () => {
            try {
                toast.add({ severity: 'info', summary: 'Asistente', detail: 'Se está actualizando la base de información del asistente, por favor espere.', life: 3000 });
                await api.get('/asistente/actualizarContenido')
                toast.add({ severity: 'success', summary: 'Asistente', detail: 'La información del asistente ha sido actualizada.', life: 3000 });

            } catch (error) {
                console.error(error)
                toast.add({ severity: 'warn', summary: 'Asistente', detail: 'No se ha podido actualizar la información del asistente.', life: 3000 });

            }
        }
    },
]);

// ----------------------------------------


import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const miToggle = () => {
    toggleDark()
    // console.log('isDark:', isDark.value)
}


</script>

<template>
    <div @click="miToggle" class=" group/itemnav flex flex-row rounded-md border-[1px] max-w-48 my-1 border-transparent
        hover:border-cyan-200 hover:bg-cyan-100/70 text-gray-600 hover:text-cyan-600 hover:font-medium p-1
        dark:hover:border-cyan-800 dark:hover:bg-cyan-900/70 dark:text-gray-400 dark:hover:text-cyan-300">
        <span class="text-gray-400 group-hover/itemnav:text-sky-500 dark:group-hover/itemnav:text-sky-500">
            <!-- <Icon :icon="config.icono" width="26" height="26" /> -->
            <Icon v-if="isDark" icon="material-symbols:light-mode-outline" width="26" height="26" />
            <Icon v-else icon="material-symbols:dark-mode-outline" width="26" height="26" />
        </span>
        <span v-if="menuStore.abierto" class="justify-center content-center ml-2">
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
        </span>
    </div>
</template>
