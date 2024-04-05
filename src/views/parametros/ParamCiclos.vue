<script setup>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import TreeSelect from 'primevue/treeselect';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

import { ref, onMounted, toRaw, watchEffect, watch } from 'vue';
import { Icon } from '@iconify/vue'
import { useToast } from 'primevue/usetoast';

import api from '@/services/api.js';

async function obtenerNodos() {
    const res = await api.get('/ciclos/nodos')
    return res.data
}

async function obtenerTodosCiclos() {
    const res = await api.get('/ciclos/')
    return res.data
}

const toast = useToast();

const accion = ref()
const nodos = ref();
const todosCiclos = ref();
const modalVisible = ref(false)
const cicloActivo = ref(null)

onMounted(async () => {
    nodos.value = await obtenerNodos()
    todosCiclos.value = await obtenerTodosCiclos()
});

function buscarNodo(key) {
    return todosCiclos.value.find((nodo) => {
        if (toRaw(nodo).id == key) {
            return true
        }
        return false
    })
}

function asignarRefPadre() {
    cicloActivo.value['refPadre'] = {}

    if (cicloActivo.value?.padre) {
        const idPadre = cicloActivo.value.padre.id
        cicloActivo.value['refPadre'][idPadre] = true
    }
}

function ver(key) {
    accion.value = 'ver'
    cicloActivo.value = buscarNodo(key)
    asignarRefPadre()
    modalVisible.value = true
}

function modif(key) {
    accion.value = 'modificar'
    cicloActivo.value = buscarNodo(key)
    asignarRefPadre()
    modalVisible.value = true
}

function del(key) {
    accion.value = 'eliminar'
    cicloActivo.value = buscarNodo(key)
    toast.add({ severity: 'warn', summary: 'Atención!', detail: `Se está por borrar al ciclo "${cicloActivo.value.nombre}"`, life: 3000 });
}

function nuevo() {
    accion.value = 'modificar'
    cicloActivo.value = {
        id: 0,
        nuevo: true,
        refPadre: {}
    }
    modalVisible.value = true
}


function cambiarAEdicion() {
    modalVisible.value = false
    accion.value = 'modificar'
    toast.add({ severity: 'info', summary: 'Modo edición', detail: 'Se ha cambiado al modo edición.', life: 3000 });
    modalVisible.value = true
}

watch(cicloActivo, () => asignarRefPadre)

watch(cicloActivo, () => {
    const idPropio = cicloActivo.value.id.toString()
    const idAsociando = Object.keys(cicloActivo.value.refPadre)[0]

    if (idPropio === idAsociando) {
        toast.add({ severity: 'warn', summary: 'Referencia circular', detail: `No se puede asociar como subciclo así mismo.`, life: 3000 });
        cicloActivo.value.refPadre = {}
    }
}, { deep: true })

watchEffect(() => {
    if (cicloActivo.value?.sigla) {
        cicloActivo.value.sigla = cicloActivo.value.sigla.toUpperCase()
    }
})

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}


async function guardarNuevoCiclo() {
    const ciclo = cicloActivo.value
    let padre = ciclo.refPadre

    if (isEmpty(toRaw(padre))) {
        padre = { id: null }
    } else {
        const id = Object.keys(padre)[0]
        padre = toRaw(buscarNodo(id))
    }

    const nuevo = {
        nombre: ciclo.nombre,
        sigla: ciclo.sigla,
        descripcion: ciclo.descripcion,
        padre_id: padre.id,
    }

    console.log(nuevo)

    const res = await api.post('/ciclos/', nuevo)

    console.log(res)

    nodos.value = await obtenerNodos()
    todosCiclos.value = await obtenerTodosCiclos()
}


function procesarGuardado() {
    // console.log(toRaw(cicloActivo.value))

    if (cicloActivo.value.nuevo) {
        guardarNuevoCiclo()
    } else {
        console.log('Se trata de un ciclo existente!')
    }

    modalVisible.value = false
}

</script>

<template>

    <div id="tablaCiclos" class="max-w-4xl">
        <div class="mt-2 mb-0 w-full flex items-center justify-end">
            <Button @click="nuevo" type="button" label="Nuevo" icon="pi pi-plus" />
        </div>

        <TreeTable :value="nodos" :pt="{ headerrow: 'hidden', row: 'group/filaciclo' }" class="mt-3">

            <Column expander>
                <template #body="props">
                    <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {{ props.node.data.sigla }}
                    </span>
                    {{ props.node.data.nombre }}
                </template>
            </Column>

            <Column headerStyle="width: 10rem">
                <template #body="props">
                    <div class="flex-row items-center justify-end gap-2 hidden group-hover/filaciclo:flex">

                        <span @click="ver(props.node.key)" class="text-green-600" title="Visualizar">
                            <Icon icon="mdi:eye" width="20" />
                        </span>

                        <span @click="modif(props.node.key)" class="text-cyan-600" title="Editar">
                            <Icon icon="material-symbols-light:edit-square" width="20" />
                        </span>

                        <span @click="del(props.node.key)" class="text-red-600"
                            :class="{ 'invisible': props.node.children.length > 0 }" title="Eliminar">
                            <Icon icon="material-symbols-light:delete-rounded" width="20" />
                        </span>
                    </div>
                </template>
            </Column>
        </TreeTable>
    </div>

    <Dialog id="editorCiclos" v-model:visible="modalVisible" modal header="Ciclo">
        <form class="grid gap-4 mt-2">
            <div class="flex flex-row">
                <div class="w-40 font-semibold flex items-center">Sigla:</div>
                <div v-if="accion === 'ver'">
                    <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {{ cicloActivo.sigla }}
                    </span>
                </div>
                <div v-if="accion === 'modificar'">
                    <InputText type="text" v-model="cicloActivo.sigla" style="width: 100px;" />
                </div>
            </div>

            <div class="flex flex-row">
                <div class="w-40 font-semibold flex items-center">Nombre:</div>
                <div v-if="accion === 'ver'">
                    {{ cicloActivo.nombre }}
                </div>

                <div v-if="accion === 'modificar'">
                    <InputText type="text" v-model="cicloActivo.nombre" style="width: 300px;" />
                </div>
            </div>

            <div class="flex flex-row">
                <div class="w-40 font-semibold">Descripción:</div>
                <div v-if="accion === 'ver'">
                    {{ cicloActivo.descripcion }}
                </div>
                <div v-if="accion === 'modificar'">
                    <Textarea v-model="cicloActivo.descripcion" rows="5" cols="37" />
                </div>
            </div>

            <div class="flex flex-row">
                <div class="w-40 font-semibold flex items-center">Ciclo asociado:</div>
                <div v-if="accion === 'ver'">
                    <span v-if="cicloActivo.padre">
                        {{ cicloActivo.padre.nombre }}
                    </span>
                    <span v-else>
                        Sin asociación
                    </span>
                </div>
                <div v-if="accion === 'modificar'">
                    <TreeSelect v-model="cicloActivo.refPadre" :options="nodos" placeholder="Sin asociación"
                        class="md:w-[20rem] w-full" />
                </div>
            </div>
        </form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <template v-if="accion === 'modificar'">
                    <Button label="Descartar" severity="danger" icon="pi pi-times" @click="modalVisible = false" />
                    <Button label="Guardar" icon="pi pi-save" @click="procesarGuardado" />
                </template>

                <template v-if="accion === 'ver'">
                    <Button label="Editar" icon="pi pi-pencil" @click="cambiarAEdicion" severity="warning" />
                    <Button label="Ok" icon="pi pi-check" @click="modalVisible = false" />
                </template>


            </div>
        </template>

    </Dialog>
    <Toast />
</template>
