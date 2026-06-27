<script setup lang="ts">
import { mobileTab } from "../store";

const tabs = [
  { id: "settings" as const, label: "编辑", icon: "edit" },
  { id: "preview" as const, label: "预览", icon: "preview" },
  { id: "chat" as const, label: "AI", icon: "chat" },
];
</script>

<template>
  <nav class="mobileTabBar">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="mobileTabBar__btn"
      :class="{ 'mobileTabBar__btn--active': mobileTab === tab.id }"
      @click="mobileTab = tab.id"
    >
      <!-- 编辑图标 -->
      <svg v-if="tab.icon === 'edit'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      <!-- 预览图标 -->
      <svg v-else-if="tab.icon === 'preview'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
      <!-- AI 图标 -->
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
        <path d="M20 10H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="16" r="1"/>
      </svg>
      <span class="mobileTabBar__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mobileTabBar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--glass-border);
  z-index: 50;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.mobileTabBar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 10px;
  font-weight: 600;
  border-radius: 0;
  padding: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.mobileTabBar__btn--active {
  color: var(--primary);
}

.mobileTabBar__label {
  font-size: 10px;
  letter-spacing: 0.5px;
}

@media (max-width: 767px) {
  .mobileTabBar {
    display: flex;
  }
}
</style>
