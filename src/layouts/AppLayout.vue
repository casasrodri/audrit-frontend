<script setup>
import { RouterView } from 'vue-router'
import MenuLateral from '@/components/MenuLateral.vue';

import { useMenuStore } from '@/stores/menuLateral.js';
const menuStore = useMenuStore();

</script>

<template>
    <div class="flex min-h-screen">

        <MenuLateral />

        <div class="flex-grow ml-14 min-h-dvh">
            <header class="pl-2 min-h-14 border-b-[1px] border-gray-200 fixed min-w-full bg-white/90 flex items-end">
                <h1 class="text-xl font-normal pb-2">
                    Menú abierto: {{ menuStore.abierto }}
                </h1>
            </header>
            <main class="flex-grow mt-14 pt-2 pl-2">
                <RouterView />
            </main>
        </div>
    </div>
</template>
