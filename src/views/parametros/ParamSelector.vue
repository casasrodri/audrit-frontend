<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
const route = useRoute()

const links = [
    {
        name: 'Ciclos',
        url: '/parametros/ciclos'
    },
    {
        name: 'Periodos',
        url: '/parametros/periodos'
    },
]
</script>

<template>
    <template v-if="route.name === 'parametros'">
        <div class="grid grid-cols-3 gap-5 pl-2 pt-2">
            <RouterLink v-for="link in links" :key="link" :to="link.url"
                class="border-[1px] border-gray-200 dark:border-gray-700 w-56 h-16 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900 dark:hover:bg-cyan-700 hover:bg-cyan-200 hover:font-semibold">
                {{ link.name }}
            </RouterLink>
        </div>
    </template>
    <RouterView />
</template>
