<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import UiToast from './UiToast.vue'

const { toasts, close } = useToast()
</script>

<template>
  <Teleport to="body">
    <div v-if="toasts.length" class="uiToastContainer">
      <UiToast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @close="close"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.uiToastContainer {
  position: fixed;
  top: 88px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.uiToastContainer > * {
  pointer-events: auto;
}
</style>
