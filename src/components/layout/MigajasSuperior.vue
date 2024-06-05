<template>
    <div class="flex flex-row mt-2 min-h-4 h-4 max-h-4 items-center content-center">
        <div class="pr-1">
            <RouterLink to="/" title="Inicio" class="text-gray-500 dark:text-gray-400">
                <i class="pi pi-home" style="font-size: 1rem"></i>
            </RouterLink>
        </div>

        <div v-for="item in migajasStore.items" class="self-center content-center text-gray-500 dark:text-gray-400">
            <i class="pi pi-angle-right px-1" style="font-size: 1rem; color: #868686"></i>
            <RouterLink :to="item.url" :title="item.title || item.nombre" v-tooltip.bottom="item.title || item.nombre">
                {{ item.nombre }}
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useMigajasStore } from "@/stores/migajas.js";
import { RouterLink } from "vue-router";

const migajasStore = useMigajasStore();

</script>
