<!-- mt-auto mb-0 -->

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMenuStore } from '@/stores/menuLateral.js'
import { RouterLink } from 'vue-router'
import LogoApp from './LogoApp.vue'
import BotonLateral from './BotonLateral.vue'
import MenuUsuario from './MenuUsuario.vue'
import MenuBuscador from './MenuBuscador.vue'
import MenuAsistente from './MenuAsistente.vue'
import MenuDarkMode from './MenuDarkMode.vue'
import api from '@/services/api.js'

const menuStore = useMenuStore()

const estilosMenu = computed(() => {
  return {
    'min-w-52 max-w-52': menuStore.abierto,
    'min-w-14 max-w-14': menuStore.cerrado
  }
})

const menuesDisponibles = ref([])
async function obtenerMenus() {
  const { data } = await api.get('/sesiones/me/menu')
  data.split('|').forEach(element => {
    const op = element.split(':')
    if (op[1] !== '') {
      menuesDisponibles.value.push(op[0])
    }
  });
}

onMounted(obtenerMenus)

</script>

<template>
  <nav
    class="fixed flex h-lvh border-r-[1px] border-gray-200 transition-all ease-out duration-500 delay-50 z-20 bg-gradient-to-r from-white to-white/85 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/85"
    :class="estilosMenu" @mouseenter="menuStore.abrir" @mouseleave="menuStore.cerrar">
    <div id="contenedor" class="flex flex-col justify-between p-2 pt-3 dark:text-white">
      <div id="superior">
        <RouterLink :class="{ 'flex min-w-48': menuStore.abierto }" :to="{ name: 'home' }">
          <div class="grid max-w-10">
            <LogoApp />
          </div>
          <span id="nombre" class="pl-3 pt-1 items-center font-normal text-2xl text-cyan-700 dark:text-cyan-400"
            :class="{ hidden: !menuStore.abierto }" style="font-family: 'Rubik', sans-serif">
            Audrit
          </span>
        </RouterLink>

        <div class="flex flex-col mt-2">
          <BotonLateral v-for="menu in menuesDisponibles" :key="menu" :tipo="menu" />
          <!-- <BotonLateral tipo="parametros" /> -->
          <!-- <BotonLateral tipo="tools" /> -->
        </div>
      </div>
      <div id="inferior">
        <div class="flex flex-col">
          <MenuBuscador />
          <MenuAsistente />
          <MenuDarkMode />
          <!-- <BotonLateral tipo="configuracion" /> -->

          <MenuUsuario />
        </div>
      </div>
    </div>
  </nav>
</template>
