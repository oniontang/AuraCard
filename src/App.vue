<script setup lang="ts">
import Topbar from './components/Topbar.vue'
import LeftPanel from './components/LeftPanel.vue'
import CenterPanel from './components/CenterPanel.vue'
import RightPanel from './components/RightPanel.vue'
import { isSettingsCollapsed, initStore } from './store'
import './App_style.css'

initStore()
</script>

<template>
  <div class="page">
    <Topbar />
    <main class="main" :class="{ 'main--settings-collapsed': isSettingsCollapsed }">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </main>
  </div>
</template>
