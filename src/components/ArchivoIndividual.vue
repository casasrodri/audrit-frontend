<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { URL } from '@/services/api.js';
import { Icon } from '@iconify/vue'

const props = defineProps({
    archivo: {
        type: Object,
        required: true
    }
});

function sizeHumanos(size) {
    let aux = size
    if (aux < 1024) return `${aux} bytes`
    aux = aux / 1024
    if (aux < 1024) return `${aux.toFixed(2)} KB`
    aux = aux / 1024
    if (aux < 1024) return `${aux.toFixed(2)} MB`
    aux = aux / 1024
    if (aux < 1024) return `${aux.toFixed(2)} GB`
    aux = aux / 1024
    if (aux < 1024) return `${aux.toFixed(2)} TB`
}

// Remix Icons: https://icon-sets.iconify.design/ri
const ICONOS = {

    pdf: 'ri:file-pdf-2-line',

    doc: 'ri:file-word-2-line',
    docx: 'ri:file-word-2-line',

    xls: 'ri:file-excel-line',
    xlsx: 'ri:file-excel-line',

    ppt: 'ri:file-ppt-line',
    pptx: 'ri:file-ppt-line',

    jpg: 'ri:image-2-line',
    jpeg: 'ri:image-2-line',

    png: 'ri:image-line',
    gif: 'ri:file-gif-line',

    txt: 'ri:file-text-line',
    csv: 'ri:file-text-line',

    mp3: 'ri:file-music-line',
    mp4: 'ri:file-music-line',
    mov: 'ri:file-music-line',
    avi: 'ri:file-music-line',
    wav: 'ri:file-music-line',
    flac: 'ri:file-music-line',

    // Correos
    msg: 'ri:mail-line',

    // Comprimidos
    zip: 'ri:file-zip-line',
    rar: 'ri:file-zip-line',
    '7z': 'ri:file-zip-line',
    'tar.gz': 'ri:file-zip-line',
    'tar.xz': 'ri:file-zip-line',
    'tar.bz2': 'ri:file-zip-line',
    'tar.lz': 'ri:file-zip-line',
    'tar.lzma': 'ri:file-zip-line',
    'tar.lzo': 'ri:file-zip-line',
    'tar.xz': 'ri:file-zip-line',
    'tar.zst': 'ri:file-zip-line',
    // Scripts
    py: 'ri:file-code-line',
    ipynb: 'ri:file-code-line',
    // Ejecutables
    exe: 'ri:file-settings-line',
    // Desconocido
    desconocido: 'ri:file-line'
}

const TIPOS_ARCHIVOS = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'mp4',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'audio/wav': 'wav',
    'audio/flac': 'flac',
    'application/vnd.ms-outlook': 'msg',
    'application/x-python': 'py',
    'text/x-python': 'py',
    'application/x-ipynb+json': 'ipynb',
    'application/x-msdownload': 'exe',
}

function getIcono(archivo) {
    const { nombre, tipo } = archivo
    let aux = 'desconocido'

    if (TIPOS_ARCHIVOS[tipo]) aux = TIPOS_ARCHIVOS[tipo]

    if (tipo === 'application/octet-stream') {
        if (nombre.endsWith('.msg')) aux = 'msg'
        if (nombre.endsWith('.ipynb')) aux = 'ipynb'
    }

    if (aux === 'desconocido') console.error('Se desconoce el formato para el archvivo:', nombre, tipo)

    return ICONOS[aux]
}

</script>

<template>
    <a :href="`${URL}/archivos/descargar/${props.archivo.link}`" target="_blank" title="Descargar archivo">
        <div class="flex flex-row border-[1px] rounded-md p-3 min-w-80 bg-white dark:bg-slate-800">
            <div class="mr-2 text-slate-500 dark:text-slate-300">
                <Icon :icon="getIcono(props.archivo)" width="32" height="32" />
            </div>
            <div class="flex flex-col">
                <div class="flex font-semibold">
                    {{ props.archivo.nombre }}
                </div>
                <div class="flex font-light text-xs text-gray-600 dark:text-gray-400">
                    {{ sizeHumanos(props.archivo.bytes) }}
                </div>
                <!-- {{ props.archivo.tipo }} -->
            </div>
        </div>
    </a>
</template>
