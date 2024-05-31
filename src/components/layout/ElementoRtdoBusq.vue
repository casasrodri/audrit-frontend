<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    buscado: String,
    resultado: Object
})

const emit = defineEmits(['cerrarModal'])
const router = useRouter()
const rtdo = ref(props.resultado)

const replaceFunction = (match) => {
    return `<rbr>${match}</rbr>`;
};

watchEffect(() => {
    if (props.resultado.texto) {
        rtdo.value.texto = props.resultado.texto.replace(new RegExp(props.buscado, 'gi'), replaceFunction);
    }

    if (props.resultado.nombre) {
        rtdo.value.nombre = props.resultado.nombre.replace(new RegExp(props.buscado, 'gi'), replaceFunction);
    }

    rtdo.value.link = crearLink()
})

function crearLink() {
    const tipo = rtdo.value.tipo
    const obj = rtdo.value.objeto

    if (tipo === 'auditoria') {
        return `/auditorias/${obj.siglaAudit}`
    }

    if (tipo === 'revision') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}`
    }

    if (tipo === 'documento') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}/relevamientos/${obj.relevId}`
    }

    if (tipo === 'riesgo') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}/riesgos/${obj.id}`
    }

    if (tipo === 'control') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}/controles/${obj.id}`
    }

    if (tipo === 'prueba') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}/pruebas/${obj.id}`
    }

    if (tipo === 'observacion') {
        return `/auditorias/${obj.siglaAudit}/revisiones/${obj.siglaRev}/observaciones/${obj.id}`
    }

    if (tipo === 'requerimiento') {
        return `/requerimientos/${obj.id}`
    }

    if (tipo === 'organigrama') {
        return `/organigrama/${obj.id}`
    }

    if (tipo === 'normativa') {
        return `/normativas/${obj.id}`
    }

    if (tipo === 'aplicacion') {
        return `/aplicaciones/${obj.id}`
    }

    if (tipo === 'archivo') {
        return `/requerimientos/${obj.requerimId}`
    }

    if (tipo === 'usuario') {
        return `#`
    }

    console.error('No se encontró el tipo de objeto:', tipo, obj)
    return '/'
}

function irLink() {
    router.push(rtdo.value.link)
    emit('cerrarModal')
}

</script>

<template>
    <a :href="rtdo.link" @click.prevent="irLink"
        class="border-[1px] rounded-md p-1 ml-1 pl-2 hover:bg-primary-100 cursor-pointer">
        <div class="font-medium" v-html="rtdo.nombre" />
        <div class="text-sm text-gray-400" v-html="rtdo.texto" />
    </a>
</template>


<style>
/* RBR: Resultado Búsqueda Resaltado */
rbr {
    font-weight: 600;
    color: rgb(var(--primary-600));
}
</style>
