<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import LeftPanel from '../components/LeftPanel.vue'
import CenterPanel from '../components/CenterPanel.vue'
import RightPanel from '../components/RightPanel.vue'
import MobileTabBar from '../components/MobileTabBar.vue'
import { isSettingsCollapsed, isAiChatCollapsed, isMobile, mobileTab } from '../store'
</script>

<template>
  <div class="page view-card">
    <!-- 移动端：紧凑 Header -->
    <GlobalHeader :compact="isMobile" />

    <!-- 桌面端：三栏布局 -->
    <main
      v-if="!isMobile"
      class="main"
      :class="{
        'main--settings-collapsed': isSettingsCollapsed,
        'main--ai-collapsed': isAiChatCollapsed,
      }"
    >
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </main>

    <!-- 移动端：Tab 切换式单面板 -->
    <main v-else class="main--mobile">
      <div v-show="mobileTab === 'settings'" class="main--mobile__panel">
        <LeftPanel />
      </div>
      <div v-show="mobileTab === 'preview'" class="main--mobile__panel">
        <CenterPanel />
      </div>
      <div v-show="mobileTab === 'chat'" class="main--mobile__panel main--mobile__panel--chat">
        <RightPanel />
      </div>
      <MobileTabBar />
    </main>
  </div>
</template>
