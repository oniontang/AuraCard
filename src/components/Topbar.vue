<script setup lang="ts">
import {
  AiModelOption,
  AiProviderId,
  AiProviderOption,
  AspectId,
  AspectPreset,
  BgTab,
  ChatMessage,
  ChatRole,
  TemplateConfig,
  TemplateId,
  accent,
  activeAspect,
  activeGradientNode,
  aiApiKey,
  aiBaseUrl,
  aiModel,
  aiProvider,
  aiProviderOptions,
  aiSummarizeLastAssistant,
  aiTestMessage,
  aiTestStatus,
  aspectId,
  aspectPresets,
  availableAiModels,
  background,
  backgroundCss,
  bgFileInputRef,
  bgImageName,
  bgImageSizeText,
  bgImageStyle,
  bgImageUrl,
  bgOpacity,
  bgOpacityPercent,
  bgTab,
  callAiChat,
  cardBodyStyle,
  cardCanvasStyle,
  cardDecorationStyle,
  cardFrameDecorStyle,
  cardOrnamentStyle,
  cardRef,
  cardStyle,
  cardTopMeta,
  cardTopMetaStyle,
  chatEndpoint,
  chatError,
  chatInput,
  chatMessages,
  clearBgImage,
  clearChat,
  colorSwatches,
  content,
  customAiBaseUrl,
  downloadPng,
  errorMessage,
  formatBytes,
  gradientAngle,
  height,
  hexToRgb,
  initStore,
  isAiKeyVisible,
  isAiSettingsOpen,
  isBgDragging,
  isChatLoading,
  isCustomAiProvider,
  isDownloading,
  isLightText,
  isSettingsCollapsed,
  isTestingAiConnection,
  localSummarizeToCard,
  newId,
  normalizeBaseUrl,
  onBgDragEnter,
  onBgDragLeave,
  onBgDrop,
  onPickBgImage,
  openBgPicker,
  padding,
  parseCardFromText,
  previewFrameRef,
  previewScale,
  previewSize,
  previewStageStyle,
  radius,
  relativeLuminance,
  rotateGradient,
  safeFilename,
  scrimStyle,
  selectedAiProvider,
  selectedTemplate,
  selectedTemplateId,
  sendChat,
  setAiTestFeedback,
  setBgFile,
  setChatError,
  showWatermark,
  subtitle,
  subtitleStyle,
  swapColors,
  syncAiProviderSettings,
  templates,
  testAiConnection,
  textColor,
  title,
  titleStyle,
  updateActiveGradientColor,
  watermark,
  width
} from '../store'
</script>

<template>
    <header class="topbar">
      <div class="topbar__inner">
        <div class="brand">
          <img src="/logo.png" alt="光语" class="brand__logo" />
          <div>
            <div class="brand__title">光语</div>
            <div class="brand__sub">让文字有光，高颜值图文排版</div>
          </div>
        </div>
        <div class="topbar__actions">
          <button class="primary" :disabled="isDownloading" @click="downloadPng">
            {{ isDownloading ? '下载中…' : '下载卡片' }}
          </button>
          <div class="chatTop__settings" :class="{ 'is-open': isAiSettingsOpen }">
            <button class="chatTop__summary" @click="isAiSettingsOpen = !isAiSettingsOpen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              设置
            </button>
            <div v-if="isAiSettingsOpen" class="chatTop__panel">
              <button class="chatConfig__close" @click="isAiSettingsOpen = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div class="chatConfig">
                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API 供应商</div>
                    <div class="chatConfig__desc">选择内置 AI 服务提供商</div>
                  </div>
                  <label class="chatConfig__field">
                    <div class="chatConfig__selectWrap">
                      <select v-model="aiProvider" class="chatConfig__control chatConfig__control--select">
                        <option v-for="provider in aiProviderOptions" :key="provider.id" :value="provider.id">
                          {{ provider.name }}
                        </option>
                      </select>
                      <span class="chatConfig__caret">⌄</span>
                    </div>
                  </label>
                  <div class="chatConfig__tip">{{ selectedAiProvider.description }}</div>
                </section>

                <section v-if="isCustomAiProvider" class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API 地址</div>
                    <div class="chatConfig__desc">填写兼容 OpenAI Chat Completions 的服务地址</div>
                  </div>
                  <label class="chatConfig__field">
                    <input v-model="customAiBaseUrl" class="chatConfig__control" placeholder="https://api.example.com" />
                  </label>
                </section>

                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API Key</div>
                    <div class="chatConfig__desc">用于 {{ selectedAiProvider.name }}</div>
                  </div>
                  <div class="chatConfig__keyRow">
                    <input
                      v-model="aiApiKey"
                      class="chatConfig__control chatConfig__control--key"
                      :type="isAiKeyVisible ? 'text' : 'password'"
                      autocomplete="off"
                      :placeholder="selectedAiProvider.apiKeyPlaceholder"
                    />
                    <button class="chatConfig__iconBtn" type="button" :title="isAiKeyVisible ? '隐藏 Key' : '显示 Key'" @click="isAiKeyVisible = !isAiKeyVisible">
                      {{ isAiKeyVisible ? '🙈' : '👁' }}
                    </button>
                    <button class="chatConfig__testBtn" type="button" :disabled="isTestingAiConnection" @click="testAiConnection">
                      {{ isTestingAiConnection ? '测试中…' : '测试连接' }}
                    </button>
                  </div>
                  <div v-if="aiTestMessage" class="chatConfig__feedback" :class="`chatConfig__feedback--${aiTestStatus}`">
                    {{ aiTestMessage }}
                  </div>
                </section>

                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">AI 模型</div>
                    <div class="chatConfig__desc">选择本次对话使用的模型</div>
                  </div>
                  <label v-if="!isCustomAiProvider" class="chatConfig__field">
                    <div class="chatConfig__selectWrap">
                      <select v-model="aiModel" class="chatConfig__control chatConfig__control--select">
                        <option v-for="model in availableAiModels" :key="model.value" :value="model.value">
                          {{ model.label }}
                        </option>
                      </select>
                      <span class="chatConfig__caret">⌄</span>
                    </div>
                  </label>
                  <label v-else class="chatConfig__field">
                    <input v-model="aiModel" class="chatConfig__control" placeholder="输入模型名称，例如 gpt-4o-mini" />
                  </label>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

</template>
