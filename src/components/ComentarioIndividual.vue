<script setup>
import { ref, onMounted, watchEffect } from 'vue';

const props = defineProps({
    comentario: Object
});

const idUsuario = ref(0);
document.cookie.split(';').forEach(e => {
    if (e.includes('idUsuario')) {
        idUsuario.value = parseInt(e.split('=')[1]);
    }
});

function parsearMomento(momento) {
    const parseado = momento.split('T')
    let fecha = parseado[0].split('-').reverse().join('/')

    let hora = parseado[1].split(':').slice(0, 2).join(':')
    return `${fecha} ${hora}`
}

</script>

<template>

    <div class="flex mx-2" :class="{ 'justify-end': idUsuario === props.comentario.usuario.id }">
        <div class="flex flex-col border-[1px] rounded-md p-2 min-w-80 bg-white">
            <div class="flex font-semibold mb-1" :class="{ 'justify-end': idUsuario === props.comentario.usuario.id }">
                {{ props.comentario.usuario.nombre_completo }}
            </div>
            <div class="flex text-sm" :class="{ 'justify-end': idUsuario === props.comentario.usuario.id }">
                {{ props.comentario.texto }}
            </div>
            <div class="flex justify-end font-light text-xs mt-1 text-gray-600 dark:text-gray-400">
                {{ parsearMomento(props.comentario.momento) }}
            </div>
        </div>
    </div>
</template>
