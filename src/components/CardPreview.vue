<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { marked } from 'marked';

import {
  cardRefs,
  cardStyle,
  cardCanvasStyle,
  cardDecorationStyle,
  cardFrameDecorStyle,
  cardOrnamentStyle,
  cardIconStyle,
  bgImageUrl,
  bgImageStyle,
  scrimStyle,
  cardTopMeta,
  cardTopMetaStyle,
  cardBodyStyle,
  titleStyle,
  title,
  showSubtitle,
  subtitleStyle,
  subtitle,
  splitContents,
  content,
  showWatermark,
  watermark,
  isDownloading
} from '../store';

const props = defineProps<{
  text: string;
  index: number;
}>();

const cardRef = ref<HTMLElement | null>(null);
const editingIndex = ref<Record<number, boolean>>({});

onMounted(() => {
  if (cardRef.value) {
    cardRefs.value = [...cardRefs.value, cardRef.value];
  }
});

onBeforeUnmount(() => {
  if (cardRef.value) {
    cardRefs.value = cardRefs.value.filter((node) => node !== cardRef.value);
  }
});

const renderMarkdown = (text: string) => {
  return marked.parse(text);
};

const handleTitleBlur = (e: Event) => {
  title.value = (e.target as HTMLElement).innerText;
};

const handleSubtitleBlur = (e: Event) => {
  subtitle.value = (e.target as HTMLElement).innerText;
};

const handleWatermarkBlur = (e: Event) => {
  watermark.value = (e.target as HTMLElement).innerText;
};

const startEdit = async (index: number) => {
  editingIndex.value[index] = true;
  await nextTick();
  const el = document.getElementById(`edit-content-${index}`);
  if (el) {
    el.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

const finishEdit = (index: number, e: Event) => {
  editingIndex.value[index] = false;
  const parts = [...splitContents.value];
  parts[index] = (e.target as HTMLElement).innerText || '';
  content.value = parts.join('\n\n');
};
</script>

<script lang="ts">
export default {
  name: 'CardPreview'
}
</script>

<template>
  <div 
    class="card-wrapper"
    :class="{ 'is-downloading': isDownloading }"
  >
    <div v-if="splitContents.length > 1" class="card-page-number">
      {{ index + 1 }}/{{ splitContents.length }}
    </div>
    <div 
      class="card" 
      ref="cardRef" 
      :style="cardStyle"
    >
      <div class="card__layers">
        <div class="card__canvas" :style="cardCanvasStyle" />
        <div class="card__decor" :style="cardDecorationStyle" />
        <div class="card__frameDecor" :style="cardFrameDecorStyle" />
        <div class="card__ornament" :style="cardOrnamentStyle" />
        <div class="card__icon" :style="cardIconStyle" />
        <div v-if="bgImageUrl" class="card__bgImage" :style="bgImageStyle" />
        <div class="card__scrim" :style="scrimStyle" />
      </div>
      <div
        v-if="cardTopMeta.left || cardTopMeta.right || cardTopMeta.center || cardTopMeta.showCenterDot"
        class="card__topMeta"
        :style="cardTopMetaStyle"
      >
        <span v-if="cardTopMeta.left" class="card__topMetaLeft">
          {{ cardTopMeta.left }}
        </span>
        <span v-if="cardTopMeta.right" class="card__topMetaRight">{{ cardTopMeta.right }}</span>
        <span v-if="cardTopMeta.center" class="card__topMetaCenter">{{ cardTopMeta.center }}</span>
        <span v-else-if="cardTopMeta.showCenterDot" class="card__topMetaDot" />
      </div>
      <div class="card__body" :style="cardBodyStyle">
        <div 
          v-if="index === 0" 
          class="card__title" 
          :style="titleStyle"
          contenteditable="plaintext-only"
          data-placeholder="输入标题..."
          @blur="handleTitleBlur"
        >{{ title }}</div>
        <div 
          v-if="index === 0 && showSubtitle" 
          class="card__subtitle" 
          :style="subtitleStyle"
          contenteditable="plaintext-only"
          data-placeholder="输入副标题..."
          @blur="handleSubtitleBlur"
        >{{ subtitle }}</div>
        <div class="card__content-wrapper">
          <div 
            v-if="!editingIndex[index]"
            class="card__content markdown-body"
            v-html="renderMarkdown(text)"
            @click="startEdit(index)"
          ></div>
          <div 
            v-else
            :id="`edit-content-${index}`"
            class="card__content"
            contenteditable="plaintext-only"
            data-placeholder="输入正文内容..."
            @blur="e => finishEdit(index, e)"
          >{{ text }}</div>
        </div>
      </div>
      <div class="card__watermark" v-if="showWatermark" contenteditable="plaintext-only" data-placeholder="输入水印..." @blur="handleWatermarkBlur">{{ watermark }}</div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  position: relative;
}

.card-page-number {
  position: absolute;
  top: -30px;
  left: 0;
  font-size: 14px;
  color: #9ca3af; /* 柔和的灰色，类似 Tailwind 的 gray-400 */
  font-weight: 500;
  letter-spacing: 1px;
  z-index: 10;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* Remove overflow: hidden to let the card expand organically with its content */
}

.card__layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card__canvas,
.card__decor,
.card__frameDecor,
.card__ornament,
.card__bgImage,
.card__scrim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.card__decor {
  z-index: 0;
}

.card__frameDecor {
  inset: 12px;
  z-index: 0;
}

.card__ornament {
  z-index: 0;
}

.card__bgImage {
  background-size: cover;
  background-position: center;
  transform: scale(1.02);
  z-index: 0;
}

.card__scrim {
  z-index: 0;
}

.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  min-height: 0;
  position: relative;
  z-index: 1;
  padding-bottom: 40px;
  /* Allow content to push the bounds without scrollbars since we use max-content height */
  overflow: visible;
}

.card__body::-webkit-scrollbar {
  width: 4px;
}
.card__body::-webkit-scrollbar-track {
  background: transparent;
}
.card__body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.card__topMeta {
  position: absolute;
  left: 28px;
  right: 28px;
  top: 22px;
  min-height: 26px;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  letter-spacing: 0.8px;
}

.card__topMetaLeft,
.card__topMetaRight {
  display: inline-flex;
  align-items: center;
}

.card__topMetaCenter,
.card__topMetaDot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.card__topMetaCenter {
  white-space: nowrap;
}

.card__topMetaDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
}

.card__title {
  font-size: 38px;
  line-height: 1.2;
  font-weight: 800;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: -0.5px;
  outline: none;
  min-height: 1em;
  flex-shrink: 0;
}

.card__title:empty:before,
.card__subtitle:empty:before,
.card__content:empty:before,
.card__watermark:empty:before {
  content: attr(data-placeholder);
  opacity: 0.5;
  pointer-events: none;
}

.is-downloading .card__title:empty,
.is-downloading .card__subtitle:empty,
.is-downloading .card__content:empty,
.is-downloading .card__watermark:empty {
  display: none !important;
}

.is-downloading .card__body {
  overflow: hidden !important;
}

.card__subtitle {
  font-size: 15px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
  outline: none;
  min-height: 1em;
  flex-shrink: 0;
}

.card__content {
  font-size: var(--card-content-font-size, 20px);
  line-height: var(--card-content-line-height, 1.65);
  white-space: pre-wrap;
  word-break: break-word;
  opacity: 0.96;
  min-height: 24px;
  outline: none;
}

.card__content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Markdown specific styles */
:deep(.markdown-body) {
  white-space: normal; /* Override pre-wrap for markdown HTML */
}
:deep(.markdown-body) p {
  margin-top: 0;
  margin-bottom: 12px;
}
:deep(.markdown-body) p:last-child {
  margin-bottom: 0;
}
:deep(.markdown-body) pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-family:
    ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 12px;
}
:deep(.markdown-body) code {
  font-family:
    ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  background-color: rgba(128, 128, 128, 0.2);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 16px;
}
:deep(.markdown-body) pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}
:deep(.markdown-body) ul,
:deep(.markdown-body) ol {
  margin-top: 0;
  margin-bottom: 12px;
  padding-left: 20px;
}

.card__watermark {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  max-width: calc(100% - 48px);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.5;
  white-space: pre-wrap;
  word-break: break-word;
  pointer-events: none;
  z-index: 1;
  outline: none;
  min-height: 1em;
}

</style>
