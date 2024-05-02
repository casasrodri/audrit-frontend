<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';

import { useRoute } from 'vue-router';
import { setTitulo } from '@/stores/titulo.js';

const route = useRoute()

const establecerTitulo = () => {
    if (route.params.idRiesgo === 'nuevo') {
        setTitulo('Nuevo riesgo')
        return
    }

    if (route.params.nombre === 'editar') {
        setTitulo('Editar riesgo')
        return
    }
}

onMounted(() => {
    establecerTitulo()
})

const riesgo = ref({
    nombre: '',
    descripcion: '',
    nivel: '',
    objetivosControl: [],
})

const niveles = ['Alto', 'Medio', 'Bajo']

const objetivosControl = ref([
    {
        key: 'Au',
        nombre: "Autorización",
        descripcion: 'Significa que las transacciones han sido aprobadas y se realizan con la conformación de un tercero.'
    },
    {
        key: 'ExOp',
        nombre: "Exactitud y oportunidad del ingreso",
        descripcion: 'Significa el correcto y oportuno ingreso de la transacción al sistema, o sea, que represente los montos pagados o recibidos, el cliente con el cual se operó, el tipo de transacción y el importe correcto.'
    },
    {
        key: 'IntIn',
        nombre: "Integridad del ingreso",
        descripcion: 'Asegurar que todas las transacciones sean ingresadas al sistema una sola vez. Esto significa que no haya transacciones no ingresadas ni ingresadas más de una vez. Junto con los dos primeros objetivos (autorización y exactitud) cubren el inicio de la transacción.'
    },
    {
        key: 'IntExActu',
        nombre: "Integridad y exactitud de las actualizaciones",
        descripcion: 'Este objetivo sigue al inicio de la transacción. Trata el requisito de que cada transacción ingresada se asiente en forma completa y exacta en un archivo que forma parte de los registros contables de la entidad como por ejemplo el mayor general o el diario o subdiario.'
    },
    {
        key: 'IntExAcum',
        nombre: "Integridad y exactitud de los datos acumulados",
        descripcion: 'Este objetivo sigue a la actualización de la información. Asegura que la información actualizada permanezca en el archivo hasta que se retire del mismo en forma correcta.'
    },
    {
        key: 'AccRes',
        nombre: "Acceso restringido",
        descripcion: 'A los activos y a los registros que representan esos activos. Esto aborda tanto la confidencialidad de los archivos de información, sus cambios no autorizados y la salvaguarda física de los activos.'
    },
]);

</script>

<template>
    <div id="container" class="flex flex-col max-w-2xl">
        <div id="nombre" class="mb-2 flex flex-col">
            <label for="nombre" class="font-semibold">Nombre</label>
            <InputText type="text" class="" v-model="riesgo.nombre" />
        </div>

        <div id="descripcion" class="my-2 flex flex-col">
            <label for="descripcion" class="font-semibold">Descripción</label>
            <Textarea v-model="riesgo.descripcion" autoResize rows="5" cols="30" />
        </div>

        <div id="riesgo" class="my-2 flex flex-col">
            <label for="riesgo" class="font-semibold">Nivel de riesgo</label>
            <Dropdown v-model="riesgo.nivel" :options="niveles" placeholder="Selecciona un nivel"
                class="w-full md:w-[14rem]" />
        </div>

        <div id="objetivosControl" class="my-2 flex flex-col">
            <label for="objetivosControl" class="font-semibold">Objetivos de control</label>
            <div v-for="objetivo of objetivosControl" :key="objetivo.key" class="my-2">
                <Checkbox v-model="riesgo.objetivosControl" :inputId="objetivo.key" name="objetivo"
                    :value="objetivo.key" class="mr-2" />
                <label :for="objetivo.key" class="italic">
                    {{ objetivo.nombre }}
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
                        {{ objetivo.descripcion }}
                    </div>
                </label>
            </div>
        </div>



    </div>
    <!-- <hr>
    {{ riesgo }}
    <hr>-->
    {{ $route.params }}
</template>
