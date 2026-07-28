<script setup lang="ts">
import { RouterView } from 'vue-router'
import { initStore } from './store'
import UiToastContainer from './components/ui/UiToastContainer.vue'
import './App_style.css'

initStore()
</script>

<template>
  <div>
    <RouterView />
    <UiToastContainer />
  </div>
</template>
