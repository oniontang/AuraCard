<script setup lang="ts">
import { RouterView } from 'vue-router'
import { initStore } from './store'
import './App_style.css'

initStore()
</script>

<template>
  <RouterView />
</template>
