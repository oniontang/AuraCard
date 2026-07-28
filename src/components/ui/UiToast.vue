<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface ToastItem {
  id: number
  message: string
  tone: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

const props = defineProps<{ toast: ToastItem }>()
const emit = defineEmits<{ close: [id: number] }>()

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

const iconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

function clearTimers() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true
  })
  if (props.toast.duration > 0) {
    timer = setTimeout(() => close(), props.toast.duration)
  }
})

onBeforeUnmount(() => {
  clearTimers()
})

function close() {
  clearTimers()
  visible.value = false
  closeTimer = setTimeout(() => emit('close', props.toast.id), 300)
}
</script>

<template>
  <div
    class="uiToast"
    :class="[`uiToast--${toast.tone}`, { 'uiToast--visible': visible }]"
    @click="close"
  >
    <span class="uiToast__icon">{{ iconMap[toast.tone] }}</span>
    <span class="uiToast__msg">{{ toast.message }}</span>
  </div>
</template>

<style scoped>
.uiToast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transform: translateY(-12px);
  opacity: 0;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 420px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.uiToast--visible {
  transform: translateY(0);
  opacity: 1;
}

.uiToast__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.uiToast__msg {
  flex: 1;
  min-width: 0;
}

/* Success */
.uiToast--success {
  background: rgba(46, 186, 109, 0.92);
  border: 1px solid rgba(46, 186, 109, 0.3);
  color: #fff;
}
.uiToast--success .uiToast__icon {
  background: rgba(255, 255, 255, 0.25);
}

/* Error */
.uiToast--error {
  background: rgba(245, 63, 63, 0.92);
  border: 1px solid rgba(245, 63, 63, 0.3);
  color: #fff;
}
.uiToast--error .uiToast__icon {
  background: rgba(255, 255, 255, 0.25);
}

/* Warning */
.uiToast--warning {
  background: rgba(255, 125, 0, 0.92);
  border: 1px solid rgba(255, 125, 0, 0.3);
  color: #fff;
}
.uiToast--warning .uiToast__icon {
  background: rgba(255, 255, 255, 0.25);
}

/* Info */
.uiToast--info {
  background: rgba(22, 93, 255, 0.92);
  border: 1px solid rgba(22, 93, 255, 0.3);
  color: #fff;
}
.uiToast--info .uiToast__icon {
  background: rgba(255, 255, 255, 0.25);
}

@media (max-width: 760px) {
  .uiToast {
    max-width: calc(100vw - 32px);
    font-size: 13px;
    padding: 10px 16px;
  }
}
</style>
