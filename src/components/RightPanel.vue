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
  aiSummarizeMessage,
  aiProvider,
  aiProviderOptions,
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInlineMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
}

function renderMarkdown(raw: string) {
  const source = escapeHtml(raw || '')
  const blockMap = new Map<string, string>()
  let blockIndex = 0
  let html = source.replace(/```([\s\S]*?)```/g, (_, code) => {
    const key = `__MD_BLOCK_${blockIndex++}__`
    blockMap.set(key, `<pre><code>${code.trim()}</code></pre>`)
    return key
  })
  html = html
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^(?:-|\*)\s+(.+)$/gm, '<li>$1</li>')
  html = html.replace(/(?:<li>.*<\/li>\n?)+/g, (list) => `<ul>${list}</ul>`)
  html = renderInlineMarkdown(html)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(h1|h2|h3|ul|pre|blockquote)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
    })
    .filter(Boolean)
    .join('')
  blockMap.forEach((value, key) => {
    html = html.replace(key, value)
  })
  return html
}
</script>

<template>
      <aside class="panel chat-panel">
        <div class="chatTop">
          <div class="chatTop__title">AI对话</div>
        </div>

        <div class="chatBody">
          <div v-for="m in chatMessages" :key="m.id" class="bubble" :class="m.role === 'user' ? 'bubble--user' : 'bubble--ai'">
            <div class="bubble__content" v-html="renderMarkdown(m.content)" />
            <div v-if="m.role === 'assistant' && m.id !== 'welcome'" class="bubble__actions">
              <button class="btn btn--ghost btn--sm" type="button" :disabled="isChatLoading" @click="aiSummarizeMessage(m.content)">
                生成卡片
              </button>
            </div>
          </div>

          <div v-if="isChatLoading" class="chatTyping">AI 正在思考…</div>
          <div v-if="chatError" class="chatToast">{{ chatError }}</div>
        </div>

        <div class="chatComposer">
          <div class="chatComposer__inputWrap">
            <textarea
              v-model="chatInput"
              class="chatComposer__input"
              rows="1"
              placeholder="输入想法，回车发送..."
              :disabled="isChatLoading"
              @keydown.enter.exact.prevent="sendChat"
            />
            <button class="chatComposer__send" type="button" :disabled="isChatLoading || !chatInput.trim()" @click="sendChat">
              <svg class="chatComposer__sendIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </aside>
</template>
