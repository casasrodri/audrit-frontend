<script setup>
import { useCounterStore } from '@/stores/counter.js';

const counterStore = useCounterStore();

</script>
<template>
  <div class="flex flex-col text-2xl">
    <h1>This is an about page</h1>

    <button class="text-2xl" @click="counterStore.increment()">Contador</button>
    <p>El contador es: {{ counterStore.count }} y el doble es {{ counterStore.doubleCount }}</p>
  </div>
</template>
