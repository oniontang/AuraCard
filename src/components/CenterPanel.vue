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
      <section class="preview">
        <div class="preview__frame" ref="previewFrameRef">
          <div class="preview__stage" :style="previewStageStyle">
            <div class="card" ref="cardRef" :style="cardStyle">
              <div class="card__layers">
                <div class="card__canvas" :style="cardCanvasStyle" />
                <div class="card__decor" :style="cardDecorationStyle" />
                <div class="card__frameDecor" :style="cardFrameDecorStyle" />
                <div class="card__ornament" :style="cardOrnamentStyle" />
                <div v-if="bgImageUrl" class="card__bgImage" :style="bgImageStyle" />
                <div class="card__scrim" :style="scrimStyle" />
              </div>
              <div
                v-if="cardTopMeta.left || cardTopMeta.right || cardTopMeta.center || cardTopMeta.showCenterDot"
                class="card__topMeta"
                :style="cardTopMetaStyle"
              >
                <span v-if="cardTopMeta.left" class="card__topMetaLeft">{{ cardTopMeta.left }}</span>
                <span v-if="cardTopMeta.right" class="card__topMetaRight">{{ cardTopMeta.right }}</span>
                <span v-if="cardTopMeta.center" class="card__topMetaCenter">{{ cardTopMeta.center }}</span>
                <span v-else-if="cardTopMeta.showCenterDot" class="card__topMetaDot" />
              </div>
              <div class="card__body" :style="cardBodyStyle">
                <div class="card__title" :style="titleStyle">{{ title }}</div>
                <div class="card__content">{{ content }}</div>
              </div>
              <div v-if="showWatermark && watermark" class="card__watermark">{{ watermark }}</div>
            </div>
          </div>
        </div>
      </section>
</template>
