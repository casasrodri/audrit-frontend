<script setup>
const props = defineProps({
    nombre: String,
    icono: String,
});

const ICONOS = {
    external: 'material-symbols-light:9k-plus-outline-sharp',
    custom: 'material-symbols-light:account-child',
    atencion: 'tabler:alert-circle-filled',
    menu: 'ri:eye-line',
};

import { Icon } from '@iconify/vue';

</script>

<template>
    <Icon :icon="ICONOS[props.icono]" width="26" height="26" />
</template>

<!-- https://icon-sets.iconify.design/ -->
<!-- https://iconify.design/docs/icon-components/vue/ -->
