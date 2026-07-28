<script setup lang="ts">
withDefaults(
  defineProps<{
    badge?: string
    title: string
    description: string
  }>(),
  {
    badge: '',
  },
)
</script>

<template>
  <div class="uiEmptyState">
    <div v-if="badge" class="uiEmptyState__badge">{{ badge }}</div>
    <div v-if="$slots.icon" class="uiEmptyState__icon">
      <slot name="icon" />
    </div>
    <h3 class="uiEmptyState__title">{{ title }}</h3>
    <p class="uiEmptyState__desc">{{ description }}</p>
    <div v-if="$slots.actions" class="uiEmptyState__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.uiEmptyState {
  margin: auto;
  max-width: 460px;
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}

.uiEmptyState__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.uiEmptyState__icon {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  font-size: 36px;
  background: linear-gradient(
    135deg,
    rgba(232, 120, 138, 0.12),
    rgba(184, 160, 216, 0.1)
  );
  box-shadow:
    0 16px 32px rgba(232, 120, 138, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.uiEmptyState__title {
  margin: 4px 0 0;
  font-size: 24px;
  font-family: var(--font-serif);
  color: var(--text);
}

.uiEmptyState__desc {
  margin: 0;
  max-width: 360px;
  font-size: 14px;
  line-height: 1.75;
}

.uiEmptyState__actions {
  margin-top: 4px;
}
</style>
