<script setup lang="ts">
import { RouterLink } from 'vue-router'

const tools = [
  { to: '/card', label: '图文卡片' },
  { to: '/cover', label: '封面设计' },
  { to: '/image-cards', label: 'AI 图文系列' },
  { to: '/wechat-typeset', label: '文章排版' },
]
</script>

<template>
  <footer class="global-footer">
    <div class="global-footer__inner">
      <div class="global-footer__brand">
        <RouterLink to="/" class="global-footer__logo">
          <img src="/logo.png" alt="光语" class="global-footer__logoImg" />
          <span class="global-footer__name">光语 AuraCard</span>
        </RouterLink>
        <p class="global-footer__tagline">让文字发光 — 从灵感到视觉，一步到位</p>
      </div>

      <nav class="global-footer__nav">
        <span class="global-footer__navTitle">创作工具</span>
        <RouterLink
          v-for="tool in tools"
          :key="tool.to"
          :to="tool.to"
          class="global-footer__link"
        >{{ tool.label }}</RouterLink>
      </nav>

      <div class="global-footer__copy">
        &copy; {{ new Date().getFullYear() }} 光语 AuraCard
      </div>
    </div>
  </footer>
</template>

<style scoped>
.global-footer {
  padding: 48px 28px 32px;
  border-top: 1px solid var(--border);
  background: var(--surface-alt);
}

.global-footer__inner {
  width: min(1440px, calc(100vw - 48px));
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-start;
}

.global-footer__brand {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.global-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  transition: opacity 0.2s ease;
  width: fit-content;
}

.global-footer__logo:hover {
  opacity: 0.75;
}

.global-footer__logoImg {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.global-footer__name {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
}

.global-footer__tagline {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 320px;
}

.global-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.global-footer__navTitle {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.global-footer__link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  width: fit-content;
}

.global-footer__link:hover {
  color: var(--accent);
}

.global-footer__copy {
  width: 100%;
  padding-top: 20px;
  margin-top: 8px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-tertiary);
}

@media (max-width: 760px) {
  .global-footer {
    padding: 36px 16px 24px;
  }

  .global-footer__inner {
    width: calc(100vw - 24px);
    flex-direction: column;
    gap: 24px;
  }

  .global-footer__brand {
    min-width: 0;
  }
}
</style>
