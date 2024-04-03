<script setup>
import LogoApp from '@/components/layout/LogoApp.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <LogoApp />
  |-----------------------------------| |---------- aca login --------------|
  |-----------------------------------|
  <RouterView />
  |-----------------------------------| |---------- fin login --------------|
  |-----------------------------------|
</template>
