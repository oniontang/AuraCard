<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    message?: string | null
    tone?: 'default' | 'processing' | 'success' | 'error'
    floating?: boolean
    top?: string
  }>(),
  {
    message: '',
    tone: 'default',
    floating: false,
    top: '88px',
  },
)

const noticeStyle = computed(() => ({
  '--ui-notice-top': props.top,
}))
</script>

<template>
  <div
    v-if="message"
    class="uiNotice"
    :class="[`uiNotice--${tone}`, { 'uiNotice--floating': floating }]"
    :style="noticeStyle"
  >
    {{ message }}
  </div>
</template>

<style scoped>
.uiNotice {
  font-size: 13px;
  line-height: 1.55;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  color: var(--text-secondary);
}

.uiNotice--processing {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: rgba(232, 120, 138, 0.14);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.uiNotice--success {
  color: var(--success);
  background: var(--success-soft);
  border-color: rgba(91, 138, 90, 0.16);
}

.uiNotice--error {
  color: var(--error);
  background: var(--error-soft);
  border-color: rgba(196, 76, 60, 0.14);
}

.uiNotice--floating {
  position: fixed;
  left: 50%;
  top: var(--ui-notice-top);
  transform: translateX(-50%);
  z-index: 120;
  min-width: 180px;
  text-align: center;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}
</style>
