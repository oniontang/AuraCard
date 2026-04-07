<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import LeftPanel from '../components/LeftPanel.vue'
import CenterPanel from '../components/CenterPanel.vue'
import RightPanel from '../components/RightPanel.vue'
import { isSettingsCollapsed, isAiChatCollapsed } from '../store'
</script>

<template>
  <div class="page view-card">
    <GlobalHeader />
    <main
      class="main"
      :class="{ 'main--settings-collapsed': isSettingsCollapsed, 'main--ai-collapsed': isAiChatCollapsed }"
    >
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </main>
  </div>
</template>
