<script setup>
document.title = 'Observaciones'
import { useDialog } from 'primevue/usedialog';
import ListaDemo from './ListaDemo.vue';

const dialog = useDialog();
const showProducts = () => {
  dialog.open(ListaDemo, {
    data: {
      nombre: 'Rodrigo Casas',
    },
    onClose: (opt) => {
      // console.log(opt)
      const callbackParams = opt.data; // {selectedId: 12}
      // console.log(callbackParams)
    },
    props: {
      header: 'Controles',
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      maximizable: true,
    }
  });
}

</script>

<template>
  Observaciones

  <button class="rounded-xl bg-[#0768a0] text-white p-2 px-7" @click="showProducts">
    Abrir
  </button>


</template>
