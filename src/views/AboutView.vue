<script setup>
import { useCounterStore } from '@/stores/counter.js';

const counterStore = useCounterStore();

document.title = "About"


</script>
<template>
  <div class="flex flex-col">
    <button class="text-xl font-extrabold mt-10 mb-3" @click="counterStore.increment()">Contador</button>
    <p class="mx-auto flex-grow-0">El contador es: {{ counterStore.count }} y el doble es {{ counterStore.doubleCount }}
    </p>
  </div>
</template>
