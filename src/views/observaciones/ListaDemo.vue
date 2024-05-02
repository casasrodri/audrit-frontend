<script setup>
import { inject } from "vue";

const dialogRef = inject('dialogRef');

const closeDialog = () => {
    dialogRef.value.close({
        selectedId: 12
    });
}



</script>

<template>
    Componente de prueba: {{ dialogRef.data.nombre }}
    <!-- {{ dialogRef }} -->

    <div class="cursor-pointer text-red-500" @click="closeDialog">❌ Cerrar</div>
</template>
