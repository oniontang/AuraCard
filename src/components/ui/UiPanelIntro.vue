<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)
</script>

<template>
  <div class="uiPanelIntro">
    <div class="panel__header uiPanelIntro__header">
      <h2 class="panel__title uiPanelIntro__title">{{ title }}</h2>
      <slot name="actions" />
    </div>
    <p v-if="description" class="uiPanelIntro__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.uiPanelIntro {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uiPanelIntro__header {
  min-height: 28px;
}

.uiPanelIntro__title {
  font-size: 16px;
}

.uiPanelIntro__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
}
</style>
