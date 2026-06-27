<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import { isMobile } from '../store'
</script>

<template>
  <div class="page app-shell view-home">
    <GlobalHeader :compact="isMobile" />

    <main class="landing">
      <section class="landingHero panel">
        <div class="landingHero__tag">NEW</div>
        <h1 class="landingHero__title">把灵感快速变成高颜值图文与封面</h1>
        <p class="landingHero__desc">
          一个工作区里完成内容编辑、智能拆分、封面导出与卡片下载，保留你已有功能并扩展新的封面模块。
        </p>
        <div class="landingHero__actions">
          <RouterLink to="/card" class="primary">开始做图文</RouterLink>
          <RouterLink to="/cover" class="btn btn--outline">去生成封面</RouterLink>
        </div>
      </section>
      <section class="landingGrid">
        <article class="landingCard panel">
          <div class="landingCard__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5H20V19H4V5Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 9H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M8 13H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3>图文卡片工作台</h3>
          <p>保留原有 Markdown 拆分、模板设置、AI 辅助与下载导出能力。</p>
        </article>
        <article class="landingCard panel">
          <div class="landingCard__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 8H16V12H8V8Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 16H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3>封面生成模块</h3>
          <p>提供模板选择、SVG 图标装饰、即时预览与一键 PNG 导出。</p>
        </article>
        <article class="landingCard panel">
          <div class="landingCard__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M3 12H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M5.5 5.5L18.5 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3>现代简约交互</h3>
          <p>玻璃拟态与简洁层次，操作路径清晰，视觉风格统一。</p>
        </article>
      </section>
    </main>
  </div>
</template>
