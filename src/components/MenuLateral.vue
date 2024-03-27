<!-- mt-auto mb-0 -->

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '@/stores/menuLateral.js';
import { RouterLink } from 'vue-router';
import LogoApp from '@/components/LogoApp.vue';

const menuStore = useMenuStore();

const estilosMenu = computed(() => {
    return {
        'bg-gradient-to-r from-white to-white/85 min-w-52 max-w-52': menuStore.abierto,
        'min-w-14 max-w-14': !menuStore.abierto
    }
})

</script>

<template>
    <div class="">

        <nav class="fixed flex h-lvh border-r-[1px] border-gray-200 transition-all ease-out duration-500 delay-50 z-20"
            :class="estilosMenu" @mouseenter="menuStore.abrir" @mouseleave="menuStore.cerrar">
            <div id="contenedor" class="flex flex-col justify-between p-2 pt-3">
                <div id="superior">
                    <RouterLink :class="{ 'flex min-w-48': menuStore.abierto }" :to="{ name: 'home' }">

                        <div class="grid max-w-10">
                            <LogoApp />
                        </div>
                        <span id="nombre" class="pl-3 pt-1 items-center font-normal text-2xl text-cyan-700"
                            :class="{ 'hidden': !menuStore.abierto }" style="font-family: 'Rubik', sans-serif;">
                            Audrit
                        </span>
                    </RouterLink>

                    <div class="flex flex-col">
                        <RouterLink :to="{ name: 'about' }">
                            About
                        </RouterLink>
                        <RouterLink :to="{ name: 'observaciones' }">
                            Obs
                        </RouterLink>
                    </div>
                </div>
                <div id="inferior">
                    <div class="flex flex-col">
                        <RouterLink :to="{ name: 'about' }">
                            Boton3
                        </RouterLink>
                        <RouterLink :to="{ name: 'observaciones' }">
                            Boton4
                        </RouterLink>
                    </div>
                    <div id="menuUser">
                        Rodri
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
