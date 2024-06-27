<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import SpeedDial from 'primevue/speeddial';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api.js';
import { setTitulo } from '@/stores/titulo.js';
import { useMigajasStore } from '@/stores/migajas.js';
import { adaptarTextoParaUrl } from '@/utils/helpers.js';
import { usePermisos } from '@/composables/permisos.js';


const migajasStore = useMigajasStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const menuItems = ref([])

const dataEjemplo = {
    "time": 1713737069435, "blocks": [{ "id": "b_OfSm46Tk", "type": "header", "data": { "text": "MERCAP", "level": 1 } }, { "id": "0PTfYad6ET", "type": "paragraph", "data": { "text": "El sistema Unitrade de Mercap es el encargado de la\nadministración y contabilización de los títulos públicos y privados”." } }, { "id": "mX-WCKNHTY", "type": "paragraph", "data": { "text": "<u>Sistema/Módulo</u>: 754 -\nUnitrade" } }, { "id": "ChHJbJ_eP_", "type": "paragraph", "data": { "text": "Opera con los sistemas “Unitrade” y\n“UnitradeRemoto”. El primero hace referencia a Sistema Integral de Operaciones\nFinancieras y el segundo módulo se utiliza para poder lanzar procesos\nprogramados mediante “Control M”.&nbsp; " } }, { "id": "pctkcQxJei", "type": "paragraph", "data": { "text": "<u>Proceso\ncontable: </u>" } }, { "id": "rPP_L5opxq", "type": "paragraph", "data": { "text": "En primer\ntérmino, se adecuó el diccionario contable existente de Títulos (sistema 24) a\nlos fines de que la contabilidad se genere en formato asiento, es decir, que\ncada tipo de operación se encuentra parametrizada con las cuentas contables\nasociadas. La administración de esta parametrización se realiza mediante la\ncreación de “cabeceras contables”. " } }, { "id": "mTtPwWcIZR", "type": "paragraph", "data": { "text": "<u>ABM cuentas</u>" } }, { "id": "HKz3h3yHx0", "type": "paragraph", "data": { "text": "Dentro del sistema\nMercap Unitrade Back Office, existen diferentes módulos tales como:\nNegociación, Administración y Seguridad; y dentro de cada módulo, se dividen en\nmenú y sub-menú. " } }, { "id": "JlZcIWkOCi", "type": "paragraph", "data": { "text": "Dentro del módulo\n“Negociación”, se encuentra el menú “Contabilidad” donde se registra todo la\ninformación vinculada con el proceso contable, tales como: " } }, { "id": "VLiZWg8Sfh", "type": "checklist", "data": { "items": [{ "text": "<i>Plan de Cuentas del Banco Central: s</i>e utiliza a modo de referencia según estructura detallada por BCRA", "checked": false }, { "text": "<i>Plan de Cuentas Interno</i>", "checked": false }, { "text": "<i>Cuentas Contables por Producto:&nbsp;</i><i></i>Permite asociar una cuenta contable a un producto o tipo de producto para simplificar el armado de los procedimientos contables.", "checked": false }, { "text": "<i>Cabeceras:&nbsp;</i>Permite asociar los diferentes movimientos a su estructura de asiento a generar. Estas cabeceras se utilizan durante la ejecución del proceso contable para la generación de los asientos.", "checked": false }, { "text": "<i>Parámetros Contables:&nbsp;</i>Son filtros iniciales que permite asociar movimientos a cabeceras. Durante el proceso contable solo se tomarán las cabeceras que cuenten con un parámetro contable. Permite simplificar el universo de elección de cabeceras.", "checked": false }] } }, { "id": "hVU1fOF6xX", "type": "paragraph", "data": { "text": "<b><i><u>Gerencia de Operaciones/Administración Cuentas de Inversión y Valuación\nde Títulos/Responsable:</u></i></b>" } }, { "id": "wrTDztVg8I", "type": "paragraph", "data": { "text": "Solicita vía ERM el alta/modificación/baja de cuentas contables en el sistema al Departamento de Modelos Contables." } }, { "id": "4ujfdKAWFa", "type": "paragraph", "data": { "text": "<b><i><u>Gerencia\nde Contabilidad/Departamento de Modelos Contables/Analista-Jefe de\nDepartamento: </u></i></b>" } }, { "id": "MFsFZQ2_f9", "type": "paragraph", "data": { "text": "Ingresa al Sistema Mercap, módulo “Negociación”, menú “Contabilidad” y\nrealiza las siguientes transacciones: “ABM de Plan de cuenta del central”, “ABM\nde Plan de cuenta interno”, “ABM de cuentas contables por productos”, “ABM de\ncabeceras contables y “ABM de parámetros contables”; según lo que se haya\ndeterminado. <b>Luego, al final del día replica en SBI</b>." } }, { "id": "Je4GMiHk3L", "type": "mermaid", "data": { "code": "flowchart LR\nMercap --> SBI", "caption": "Mercap replica directamente en SBI al final del día." } }, { "id": "dUH7yvmDff", "type": "paragraph", "data": { "text": "Las\nmodificaciones de cuentas que el sistema permite se relacionan con cambios en\nla descripción de la cuenta, en la posibilidad de que se gestione por el\nsistema de partidas pendientes o que se modifique alguno de los parámetros\nindicativos. " } }], "version": "2.29.1"
}

import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import HeaderEditorJs from '@editorjs/header';
import ChecklistEditorJs from '@editorjs/checklist';
import DelimiterEditorJs from '@editorjs/delimiter';
import TableEditorJs from '@editorjs/table';
import NestedListEditorJs from '@editorjs/nested-list';
import MarkerEditorJs from '@editorjs/marker';
import UnderlineEditorJs from '@editorjs/underline';
import AlertEditorJs from 'editorjs-alert';
import ToggleBlockEditorJs from 'editorjs-toggle-block';
import MermaidToolEditorJs from 'editorjs-mermaid'
import InlineCode from '@editorjs/inline-code';
import { ControlRelevante, RiesgoRelevante, Normativa, Aplicacion, Organigrama } from '@/assets/editorjs/audiReferencias.js';

const idsActivos = ref({
    auditoria: {
        id: null,
        sigla: route.params.siglaAudit,
        obj: null
    },
    revision: {
        id: null,
        sigla: route.params.siglaRevision,
        obj: null,
    },
    revisiones: null, relevamiento: {
        id: null,
        obj: null,
    },
    relevamientos: null,
    documento: {
        id: null,
        obj: null,
    }
})

const log = console.log


async function togggle() {
    log({ readOnly: editor.readOnly.isEnabled })
    try {
        await editor.readOnly.toggle()
    } catch (err) {
        log({ err })
        renderDoc()
    }
    log({ readOnly: editor.readOnly.isEnabled })
}


function giveIdToBlocks() {
    document.querySelectorAll('.ce-block').forEach(block => {
        block.id = block.dataset.id
    })
}

function buscarBloqueIdUrl(id) {
    if (window.location.hash !== '') {

        const scrollToId = window.location.hash.replace('#', '')
        const block = editor.blocks.getById(scrollToId);
        console.log(window.location.hash)
        const scrollElem = block.holder

        scrollElem.scrollIntoViewIfNeeded()

        setTimeout(() => {
            scrollElem.classList.add('ce-block--selected')
        }, 500)

        setTimeout(() => {
            scrollElem.classList.remove('ce-block--selected')
        }, 1000)

        setTimeout(() => {
            scrollElem.classList.add('ce-block--selected')
        }, 1500)

        setTimeout(() => {
            scrollElem.classList.remove('ce-block--selected')
        }, 2000)

        setTimeout(() => {
            scrollElem.classList.add('ce-block--selected')
        }, 2500)

        setTimeout(() => {
            scrollElem.classList.remove('ce-block--selected')
        }, 3000)


        const ids = editor.configuration.data.blocks.map(block => block.id)
        const indexBlock = ids.indexOf(scrollToId)
        // editor.caret.setToBlock(indexBlock, 'end', true)

    }
}

const editorReady = ref(false)

function crearEditor({ auditoria, revision }) {

    const urlRev = `/auditorias/${auditoria.sigla}/revisiones/${revision.sigla}`
    return new EditorJS({

        holder: 'editorjs',

        onReady: () => {
            MermaidToolEditorJs.config({ theme: 'forest' })
            // giveIdToBlocks()
            // buscarBloqueIdUrl()

            editorReady.value = true
            determinarMenus()

            // console.log('Editor.js is ready to work!')
        },
        onChange: (api, event) => {
            // console.log(event)
            // toast.add({ severity: 'success', summary: 'Update', detail: 'Contenido guardado!', life: 3000 });
        },
        readOnly: true,

        placeholder: 'Escribe "/" para ver los bloques disponibles...',

        // Tools connection
        tools: {
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
                config: {
                    preserveBlank: true,
                }
            },
            header: {
                class: HeaderEditorJs,
                inlineToolbar: true,
                config: {
                    placeholder: 'Ingresa un título...',
                    levels: [1, 2, 3, 4],
                    defaultLevel: 2
                },
                toolbox: {
                    title: 'Título'
                }
            },
            riesgo: {
                class: RiesgoRelevante,
                config: {
                    endpointBuscar: `/riesgos/revision/${revision.id}/buscar`,
                    endpointInfoId: '/riesgos',
                    urlVista: `${urlRev}/riesgos`,
                    urlNuevo: `${urlRev}/riesgos/nuevo`,
                }
            },
            control: {
                class: ControlRelevante,
                config: {
                    endpointBuscar: `/controles/revision/${revision.id}/buscar`,
                    endpointInfoId: '/controles',
                    urlVista: `${urlRev}/controles`,
                    urlNuevo: `${urlRev}/controles/nuevo`,
                }
            },
            normativa: {
                class: Normativa,
                config: {
                    endpointBuscar: '/normativas/buscar',
                    endpointInfoId: '/normativas',
                    urlVista: '/normativas',
                    urlNuevo: '/normativas/nuevo',
                    mostrarDescripcion: false,
                }
            },
            aplicacion: {
                class: Aplicacion,
                config: {
                    endpointBuscar: '/aplicaciones/buscar',
                    endpointInfoId: '/aplicaciones',
                    urlVista: '/aplicaciones',
                    urlNuevo: '/aplicaciones/nuevo',
                    mostrarDescripcion: false,
                }
            },
            organigrama: {
                class: Organigrama,
                config: {
                    endpointBuscar: '/organigramas/buscar',
                    endpointInfoId: '/organigramas',
                    urlVista: '/organigrama',
                    urlNuevo: '/organigrama/nuevo',
                    mostrarDescripcion: false,
                }
            },
            checklist: {
                class: ChecklistEditorJs,
                inlineToolbar: true
            },
            list: {
                class: NestedListEditorJs,
                inlineToolbar: true,
            },
            delimiter: DelimiterEditorJs,
            table: {
                class: TableEditorJs,
                inlineToolbar: true,
                config: {
                    rows: 2,
                    cols: 3,
                    withHeadings: true, // No está funcionando https://github.com/editor-js/table/issues/141
                },
            },
            marker: {
                class: MarkerEditorJs,
                shortcut: 'CMD+SHIFT+M',
            },
            underline: UnderlineEditorJs,
            alert: {
                class: AlertEditorJs,
                inlineToolbar: true,
                config: {
                    defaultType: 'primary',
                    messagePlaceholder: 'Enter something',
                },
            },
            toggle: {
                class: ToggleBlockEditorJs,
                inlineToolbar: true,
            },
            mermaid: MermaidToolEditorJs,
            inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+M',
            }
        },
    });
}

const documento = ref({})

async function getIds() {
    const { siglaAudit } = route.params;
    const { siglaRevision } = route.params;
    const { idRelev } = route.params;

    const { data } = await api.get(`/auditorias/sigla/${siglaAudit}`);
    idsActivos.value.auditoria.id = data.id;
    idsActivos.value.auditoria.obj = data;

    const { data: revisiones } = await api.get(`/revisiones/auditoria/${idsActivos.value.auditoria.id}`);
    const revision = revisiones.filter(rev => rev.sigla === siglaRevision)[0];
    idsActivos.value.revision.id = revision.id;
    idsActivos.value.revision.obj = revision;


    idsActivos.value.relevamiento.id = parseInt(idRelev);
    const { data: documentoDB } = await api.get(`/documentos/relevamiento/${idsActivos.value.relevamiento.id}`);

    idsActivos.value.documento.id = documentoDB.id
    idsActivos.value.documento.obj = documentoDB;

    documento.value = documentoDB
}

const TIEMPO_ESPERA = 10
const contenidoCargado = ref(false)
async function renderDoc() {
    while (!editorReady.value) {
        await new Promise(resolve => setTimeout(resolve, TIEMPO_ESPERA))
    }
    const formatJson = JSON.parse(documento.value.contenido)
    editor.render(formatJson)
    contenidoCargado.value = true
}

async function getTitulo() {
    const id = idsActivos.value.relevamiento.id
    const { data } = await api.get(`/relevamientos/${id}`)
    // log(data)
    setTitulo(data.nombre)
    document.title = 'Relevamiento - ' + data.nombre;
}

async function setMigajas() {
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
    let auxPadre = revision
    const urlRev = `/auditorias/${audit.sigla}/revisiones`

    let subitems = []
    let relevamientoUrl
    while (auxPadre) {
        const texto_url = adaptarTextoParaUrl(auxPadre.nombre)
        subitems.unshift({
            nombre: auxPadre.nombre,
            sigla: auxPadre.sigla,
            url: `${urlRev}/${auxPadre.sigla}/${texto_url}`,
            title: 'Revisión',
        })
        auxPadre = auxPadre.padre
    }

    items.push(...subitems)

    // Procesos y macro procesos
    subitems = []
    const { data: relevNodos } = await api.get(`/relevamientos/revision/${revision.id}/nodos`)
    const buscar = idsActivos.value.relevamiento.id

    function findNodeByIdAndParents(node, targetId, parents = []) {
        if (node.data.id === targetId) {
            return [...parents, node.data];
        }
        if (node.children) {
            for (const child of node.children) {
                const result = findNodeByIdAndParents(child, targetId, [...parents, node.data]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
    // Buscar todos los nodos padres
    let result = null;
    for (const item of relevNodos) {
        result = findNodeByIdAndParents(item, buscar);
        if (result) break;
    }

    const urlProcesos = `/auditorias/${audit.sigla}/revisiones/${revision.sigla}/relevamientos`
    result.forEach(node => {

        const tipo = node.sigla?.startsWith('M') ? 'Macroproceso' : 'Proceso'

        if (node.tipo === 'proceso') {
            subitems.push({
                nombre: node.sigla,
                url: urlProcesos,
                title: `${tipo} - ${node.nombre}`,
            })
        }
    });

    items.push(...subitems)

    migajasStore.items = items
}




let permisos = usePermisos()
let editor = null
onMounted(async () => {
    await getIds()
    getTitulo()
    renderDoc()
    editor = crearEditor(idsActivos.value)
    setMigajas()
})

watchEffect(async () => {
    route.params
    await getIds()
    getTitulo()
    renderDoc()
    setMigajas()
})


function edicionBloqueada() {
    if (!permisos.value.auditoriasEditar) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permisos para guardar el documento.', life: 3000 });
        return true
    }

    return false
}

async function guardarDocumento() {
    if (edicionBloqueada()) return

    const nuevaData = await editor.save()

    const nuevoObj = {
        contenido: JSON.stringify(nuevaData),
        relevamiento_id: idsActivos.value.relevamiento.id,
    }

    const resPut = await api.put(`/documentos/${idsActivos.value.documento.id}`, nuevoObj)
    log(resPut)
}

async function bloquearEditor() {
    if (edicionBloqueada()) return

    documento.value.contenido = JSON.stringify(await editor.save())
    await editor.readOnly.toggle(true)
    determinarMenus()
}

async function desbloquearEditor() {
    if (edicionBloqueada()) return

    try {
        await editor.readOnly.toggle(false)
    } catch (err) {
        renderDoc()
    }

    determinarMenus()
}

async function determinarMenus() {

    const bloquear = {
        label: 'Bloquear',
        icon: 'pi pi-lock',
        command: bloquearEditor
    }

    const desbloquear = {
        label: 'Desbloquear',
        icon: 'pi pi-unlock',
        command: desbloquearEditor
    }

    const guardar = {
        label: 'Guardar',
        icon: 'pi pi-save',
        command: async () => {
            try {
                guardarDocumento()
                bloquearEditor()
                toast.add({ severity: 'success', summary: 'Documento', detail: 'Guardado correctamente.', life: 3000 });
            } catch (err) {
                toast.add({ severity: 'error', summary: 'Error al guardar!', detail: err, life: 3000 });
            }
        }
    }

    if (editor.readOnly.isEnabled) {
        menuItems.value = [desbloquear]
    } else {
        menuItems.value = [bloquear, guardar]
    }
}


function goToFromEditorJs(e) {
    router.push(e.detail)
}

function openFromEditorJs(e) {
    window.open(e.detail, '_blank');
}

document.addEventListener('goToRoute', goToFromEditorJs);
document.addEventListener('openRoute', openFromEditorJs);


import ContextMenu from 'primevue/contextmenu';
const menu = ref();
const onImageRightClick = (event) => {
    menu.value.show(event);
};
import Skeleton from 'primevue/skeleton';
</script>


<style>
#editorjs {
    padding: 0px;
    /* border: 1px solid #e0e0e0; */
    border-radius: 4px;
    margin: 10px;
    min-height: 300px;
}

h1.ce-header {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
}

h2.ce-header {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
}

.mermaid-wrapper [data-placeholder="Caption"] {
    font-size: 0.8rem;
    color: rgb(65, 61, 61);
}

#editorjs .ce-paragraph a {
    color: #3995ac;
    text-decoration: none;
}

#editorjs .ce-paragraph a:hover {
    color: #2b698d;
    text-decoration: underline;
}

.mermaid-preview-error {
    background-color: rgb(194, 127, 65);
}

.mermaid-input {
    font-family: monospace;
}
</style>

<template>
    <div class="min-w-full w-full max-w-full" @contextmenu="onImageRightClick">
        <ContextMenu ref="menu" :model="menuItems" />
        <div id="editorjs" :class="{ 'hidden': !contenidoCargado }" />

        <div id="skeleton" v-if="!contenidoCargado" class="w-full min-w-full max-w-full" style="width: 600px;">
            <Skeleton height="2rem" class="mb-2"></Skeleton>
            <div class="h-3"></div>
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <div class="h-12"></div>
            <Skeleton height="2rem" class="mb-2"></Skeleton>
            <div class="h-3"></div>
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
        </div>

        <!-- <div id="containerSpeedDial" class="flex bg-red-500 h-lvh fixed bottom-0 right-0 z-10">
            <SpeedDial :model="menuItems" direction="up" class="bottom-0 right-0 m-5" showIcon="pi pi-bars"
                hideIcon="pi pi-plus" :tooltipOptions="{ position: 'left' }" :transitionDelay="80" />
        </div> -->
    </div>


</template>

<style>
.ce-block__content,
.ce-toolbar__content {
    max-width: 80rem;
}
</style>
