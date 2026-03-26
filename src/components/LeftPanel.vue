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
      <aside class="panel settings-panel" :class="{ 'settings-panel--collapsed': isSettingsCollapsed }">
        <div class="panel__header">
          <h2 class="panel__title" v-show="!isSettingsCollapsed">卡片设置</h2>
          <button class="collapse-toggle" @click="isSettingsCollapsed = !isSettingsCollapsed" :title="isSettingsCollapsed ? '展开' : '折叠'">
            <svg v-if="!isSettingsCollapsed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        
        <div class="settings-content" v-show="!isSettingsCollapsed">
          <div class="group">
            <div class="field">
              <span class="group__title">模板</span>
              <div class="segmented segmented--3">
                <button
                  v-for="t in templates"
                  :key="t.id"
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': selectedTemplateId === t.id }"
                  type="button"
                  @click="selectedTemplateId = t.id"
                >
                  {{ t.name }}
                </button>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="field">
              <span class="group__title">比例</span>
              <div class="segmented">
                <button
                  v-for="a in aspectPresets"
                  :key="a.id"
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': aspectId === a.id }"
                  type="button"
                  @click="aspectId = a.id"
                >
                  {{ a.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="field">
              <span class="group__title">背景设置</span>
              <div class="segmented segmented--3">
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': bgTab === 'solid' }"
                  type="button"
                  @click="bgTab = 'solid'"
                >
                  纯色
                </button>
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': bgTab === 'gradient' }"
                  type="button"
                  @click="bgTab = 'gradient'"
                >
                  渐变
                </button>
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': bgTab === 'image' }"
                  type="button"
                  @click="bgTab = 'image'"
                >
                  图片
                </button>
              </div>
            </div>

            <div v-show="bgTab === 'solid'">
              <div class="field">
                <label class="colorPickerLight">
                  <input class="colorPickerLight__native" type="color" v-model="background" />
                  <span class="colorPickerLight__current">
                    <span class="colorPickerLight__dot" :style="{ backgroundColor: background }" />
                    <span>{{ background.toUpperCase() }}</span>
                  </span>
                </label>
              </div>
              <div class="field">
                <div class="colorSwatchesLight">
                  <button
                    v-for="sw in colorSwatches"
                    :key="sw"
                    class="colorSwatchesLight__btn"
                    type="button"
                    :style="{ backgroundColor: sw }"
                    @click="background = sw"
                  />
                </div>
              </div>
            </div>

            <div v-show="bgTab === 'gradient'">
              <div class="field" style="margin-top: 8px;">
                <div class="gradient-control">
                  <div class="gradient-track-wrapper">
                    <div class="gradient-track" :style="{ background: `linear-gradient(90deg, ${background}, ${accent})` }"></div>
                    
                    <div class="gradient-handle gradient-handle--left" :class="{ 'gradient-handle--active': activeGradientNode === 'background' }" @click="activeGradientNode = 'background'">
                      <div class="gradient-handle__inner" :style="{ backgroundColor: background }"></div>
                      <input type="color" v-model="background" class="gradient-handle__input" @click.stop="activeGradientNode = 'background'" />
                    </div>

                    <div class="gradient-handle gradient-handle--right" :class="{ 'gradient-handle--active': activeGradientNode === 'accent' }" @click="activeGradientNode = 'accent'">
                      <div class="gradient-handle__inner" :style="{ backgroundColor: accent }"></div>
                      <input type="color" v-model="accent" class="gradient-handle__input" @click.stop="activeGradientNode = 'accent'" />
                    </div>
                  </div>

                  <div class="gradient-actions">
                    <button class="icon-btn" type="button" @click="swapColors" title="交换颜色" aria-label="交换颜色">
                      <span class="icon-btn__glyph">⇄</span>
                    </button>
                    <button class="icon-btn" type="button" @click="rotateGradient" title="重置角度" aria-label="重置角度">
                      <span class="icon-btn__glyph">↺</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="field" style="margin-top: 8px;">
                <div class="colorSwatchesLight">
                  <button
                    v-for="sw in colorSwatches"
                    :key="sw"
                    class="colorSwatchesLight__btn"
                    type="button"
                    :style="{ backgroundColor: sw }"
                    @click="updateActiveGradientColor(sw)"
                  />
                </div>
              </div>
            </div>

            <div v-show="bgTab === 'image'" class="field" style="margin-top: 8px;">
                <input ref="bgFileInputRef" class="srOnly" type="file" accept="image/*" @change="onPickBgImage" />
                <div
                  class="uploadCard"
                  :class="{ 'uploadCard--active': isBgDragging, 'uploadCard--withImage': !!bgImageUrl }"
                  role="button"
                  tabindex="0"
                  @click="openBgPicker"
                  @dragenter.prevent="onBgDragEnter"
                  @dragover.prevent="onBgDragEnter"
                  @dragleave="onBgDragLeave"
                  @drop.prevent="onBgDrop"
                >
                  <div v-if="bgImageUrl" class="uploadCard__thumb" :style="{ backgroundImage: `url(${bgImageUrl})` }" />
                  <div v-else class="uploadCard__empty uploadCard__empty--full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;margin-bottom:4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <div class="uploadCard__emptyTitle">点击或拖拽上传背景图</div>
                  </div>
                  <div v-if="bgImageUrl" class="uploadCard__meta">
                    <div class="uploadCard__metaTitle">{{ bgImageName }}</div>
                    <div class="uploadCard__actions">
                      <button class="btn btn--ghost btn--sm" type="button" @click.stop="openBgPicker">更换</button>
                      <button class="btn btn--danger btn--sm" type="button" @click.stop="clearBgImage">移除</button>
                    </div>
                  </div>
                </div>
                <div class="row" style="margin-top: 8px;" v-if="bgImageUrl">
                  <div class="opacity">
                    <div class="opacity__label">透明度</div>
                    <input v-model.number="bgOpacityPercent" class="range" type="range" min="0" max="100" />
                  </div>
                </div>
              </div>
            </div>

          <div class="group">
            <div class="group__title">文字颜色</div>
            <div class="field" style="margin-top: 8px;">
              <label class="colorPickerLight">
                <input class="colorPickerLight__native" type="color" v-model="textColor" />
                <span class="colorPickerLight__current">
                  <span class="colorPickerLight__dot" :style="{ backgroundColor: textColor }" />
                  <span>{{ textColor.toUpperCase() }}</span>
                </span>
              </label>
            </div>
            <div class="field">
              <div class="colorSwatchesLight">
                <button
                  v-for="sw in colorSwatches"
                  :key="sw"
                  class="colorSwatchesLight__btn"
                  type="button"
                  :style="{ backgroundColor: sw }"
                  @click="textColor = sw"
                />
              </div>
            </div>
          </div>

          <div class="group">
            <div class="group__title">水印</div>
            <label class="watermark-switch">
              <span class="watermark-switch__label">添加水印</span>
              <input v-model="showWatermark" type="checkbox" />
            </label>
            <div v-if="showWatermark" class="watermark-input-wrapper">
              <input 
                v-model="watermark" 
                class="watermark-input" 
                type="text" 
                placeholder="输入水印内容..." 
              />
            </div>
          </div>
        </div>

        <div class="settings-preview" v-show="isSettingsCollapsed">
          <div class="settings-preview__aspect settings-preview__item">{{ aspectId }}</div>
          <div
            class="settings-preview__thumb settings-preview__item"
            :style="bgImageUrl ? { backgroundImage: `url(${bgImageUrl})` } : { background: backgroundCss }"
          />
          <div class="settings-preview__chip settings-preview__item">
            <span class="settings-preview__dot" :style="{ backgroundColor: background }" />
            <span class="settings-preview__text">背景</span>
          </div>
          <div class="settings-preview__chip settings-preview__item">
            <span class="settings-preview__dot" :style="{ backgroundColor: textColor }" />
            <span class="settings-preview__text">字体</span>
          </div>
          <div class="settings-preview__chip settings-preview__item">
            <span class="settings-preview__dot" :style="{ backgroundColor: accent }" />
            <span class="settings-preview__text">划重点</span>
          </div>
        </div>
      </aside>
</template>
