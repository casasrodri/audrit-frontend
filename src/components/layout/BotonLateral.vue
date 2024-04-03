<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menuLateral.js'

const config = {
  auditorias: {
    texto: 'Auditorías',
    icono: 'ri:user-search-line',
    link: '/auditorias'
  },

  observaciones: {
    texto: 'Observaciones',
    icono: 'ri:eye-line',
    link: '/observaciones'
  },

  requerimientos: {
    texto: 'Requerimientos',
    icono: 'ri:archive-2-line',
    link: '/requerimientos'
  },

  parametros: {
    texto: 'Parámetros',
    icono: 'icon-park-outline:setting-config',
    link: '/parametros'
  },

  buscar: {
    texto: 'Buscar',
    icono: 'iconamoon:search',
    link: '',
    modal: 'buscador'
  },

  asistente: {
    texto: 'Asistente',
    icono: 'ri:robot-3-line',
    link: '',
    modal: 'asistente'
  },

  configuracion: {
    texto: 'Configuración',
    icono: 'iconamoon:settings',
    link: '/configuracion'
  },

  tools: {
    texto: '[Dev Tools]',
    icono: 'octicon:tools-16',
    link: '/devtools'
  }
}

const props = defineProps({
  tipo: String
})

const route = useRoute()
const menuStore = useMenuStore()

const menuActivo = computed(() => {
  const miLink = config[props.tipo].link
  return route.path.startsWith(miLink) && miLink !== ''
})
</script>

<template>
  <RouterLink :to="config[props.tipo].link">
    <div
      class="group/itemnav flex flex-row rounded-md border-[1px] max-w-48 my-1 border-transparent hover:border-cyan-200 hover:bg-cyan-100/70 text-gray-600 hover:text-cyan-600 hover:font-medium p-1 dark:hover:border-cyan-800 dark:hover:bg-cyan-900/70 dark:text-gray-400 dark:hover:text-cyan-300"
    >
      <span
        class="text-gray-400 group-hover/itemnav:text-sky-500 dark:group-hover/itemnav:text-sky-500"
        :class="{ 'text-sky-500 dark:text-sky-400': menuActivo }"
      >
        <Icon :icon="config[props.tipo].icono" width="26" height="26" />
      </span>
      <span v-if="menuStore.abierto" class="justify-center content-center ml-2">
        {{ config[props.tipo].texto }}
      </span>
    </div>
  </RouterLink>

  <!-- {{ $route }} -->
</template>
