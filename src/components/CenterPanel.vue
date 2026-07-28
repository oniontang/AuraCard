<script setup lang="ts">
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {
  splitContents,
  content,
  previewFrameRef,
  previewStageStyle,
  previewWrapperStyle,
  aiSummarizeMessage,
  isChatLoading,
  isDownloading,
  downloadPng,
  resetCardToInitialState
} from '../store';
import CardPreview from './CardPreview.vue';

const isEditingContent = ref(false);
const useAiSummary = ref(false);
const mdFileInputRef = ref<HTMLInputElement | null>(null);

const triggerMdUpload = () => {
  mdFileInputRef.value?.click();
};

const onMdFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    content.value = ev.target?.result as string;
  };
  reader.readAsText(file);
  (e.target as HTMLInputElement).value = '';
};

const handleFinishEdit = async () => {
  if (useAiSummary.value && content.value.trim()) {
    await aiSummarizeMessage(content.value);
  }
  isEditingContent.value = false;
};

const resetCard = () => {
  resetCardToInitialState();
  useAiSummary.value = false;
  isEditingContent.value = false;
};
</script>

<template>
  <div class="center-panel-shell">
    <section class="panel center-panel">
    <div class="content-toolbar">
      <div class="content-toolbar__group">
        <button class="btn btn--outline" type="button" @click="isEditingContent = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          编辑长内容
        </button>
      </div>
      <div class="content-toolbar__spacer"></div>
      <div class="content-toolbar__group">
        <button class="btn btn--outline btn--sm content-toolbar__action" :disabled="isDownloading || isChatLoading" @click="resetCard">
          重置
        </button>
        <button class="btn btn--primary btn--sm content-toolbar__action" :disabled="isDownloading" @click="downloadPng">
          <svg class="content-toolbar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          {{ isDownloading ? '下载中…' : '下载卡片' }}
        </button>
      </div>
    </div>

    <div class="center-panel__scroll">
      <div class="preview__frame" ref="previewFrameRef">
        <div :style="previewWrapperStyle">
          <div class="preview__stage" :style="previewStageStyle">
            <CardPreview 
              v-for="(text, index) in splitContents" 
              :key="index"
              :text="text"
              :index="index"
            />
          </div>
        </div>
      </div>
    </div>
    </section>

    <!-- 长内容编辑弹窗 (Teleported to body for full page overlay) -->
    <Teleport to="body">
      <div v-if="isEditingContent" class="content-editor-overlay" @click.self="!isChatLoading && (isEditingContent = false)">
        <div class="content-editor-modal">
          <div class="content-editor-header">
            <h3 class="content-editor-title">编辑卡片内容</h3>
            <div class="content-editor-header__actions">
              <button class="btn btn--outline btn--sm" @click="triggerMdUpload" :disabled="isChatLoading">导入 MD 文件</button>
              <input type="file" ref="mdFileInputRef" accept=".md,text/markdown" style="display: none" @change="onMdFileChange" />
              <button class="btn btn--ghost" @click="isEditingContent = false" :disabled="isChatLoading">✕</button>
            </div>
          </div>
          <div class="content-editor-body">
            <MdEditor 
              v-model="content" 
              :toolbars="['bold', 'underline', 'italic', 'strikeThrough', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task', '-', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', '-', 'revoke', 'next', '=', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog']"
              placeholder="在此输入 Markdown 格式的长文本..."
              style="flex: 1; min-height: 0;"
            />
          </div>
          <div class="content-editor-footer">
            <span class="content-editor-tip">支持 Markdown 语法，内容将自动拆分</span>
            <div class="content-editor-footer__actions">
              <label class="content-editor-summaryToggle">
                <input type="checkbox" v-model="useAiSummary" :disabled="isChatLoading" class="content-editor-summaryToggle__input" />
                是否使用 AI 总结
              </label>
              <button class="btn btn--primary" @click="handleFinishEdit" :disabled="isChatLoading">
                {{ isChatLoading ? '正在总结...' : '生成卡片' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.center-panel-shell {
  display: contents;
}

.content-editor-header__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.content-editor-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.content-editor-footer__actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.content-editor-summaryToggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--primary);
  font-weight: 600;
}

.content-editor-summaryToggle__input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
}

.content-editor-body :deep(.md-editor) {
  border: none;
  border-radius: 0;
  height: 100%;
}
</style>
