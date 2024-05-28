<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    buscado: String,
    resultado: Object
})

const emit = defineEmits(['linkApretado'])

const rtdo = ref(props.resultado)

watchEffect(() => {
    if (props.resultado.texto) {
        rtdo.value.texto = props.resultado.texto.replace(new RegExp(props.buscado, 'gi'), `<rbr>${props.buscado}</rbr>`)
    }
    crearLink()
})

function crearLink() {
    const tipo = rtdo.value.objeto
    const id = rtdo.value.objeto_id

    if (tipo === 'requerimiento') {
        rtdo.value.link = `/requerimientos/${id}`
    }
}

function irLink() {
    emit('linkApretado', rtdo.value.link)
}

</script>

<template>
    <div class="border-[1px] rounded-md p-1 ml-1 pl-2 hover:bg-primary-100">
        <a :href="rtdo.link" @click.prevent="irLink">
            <div class="font-medium">
                {{ rtdo.nombre }}
            </div>
            <div class="text-sm text-gray-400" v-html="rtdo.texto" />
        </a>
    </div>
    <!-- {{ rtdo }} -->
</template>


<style>
/* RBR: Resultado Búsqueda Resaltado */
rbr {
    font-weight: 600;
    color: rgb(var(--primary-600));
}
</style>
