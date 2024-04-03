<script setup>
const links = [
  {
    name: 'PrimeVue Tailwind',
    url: 'https://tailwind.primevue.org/overview'
  },
  {
    name: 'PrimeVue',
    url: 'https://primevue.org/introduction/'
  },
  {
    name: 'PrimeVue Icons',
    url: 'https://primevue.org/icons/#list'
  },
  {
    name: 'VueUse',
    url: 'https://vueuse.org/guide/'
  },
  {
    name: 'Tailwind',
    url: 'https://tailwindcss.com/docs/width'
  },
  {
    name: 'Iconify',
    url: 'https://icon-sets.iconify.design/'
  },
  {
    name: 'Component Party',
    url: 'https://component-party.dev/'
  }
]
</script>

<template>
  <div class="grid grid-cols-3 gap-5 pl-2 pt-2">
    <a
      v-for="link in links"
      :key="link"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="border-[1px] border-gray-200 dark:border-gray-700 w-56 h-16 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900 dark:hover:bg-cyan-700 hover:bg-cyan-200 hover:font-semibold"
      >{{ link.name }}</a
    >
  </div>
</template>
