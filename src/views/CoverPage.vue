<script setup lang="ts">
import { computed, ref } from 'vue'
import { toPng } from 'html-to-image'
import { aiProvider, generateAiImageUrl, selectedAiModel, safeFilename, isMobile } from '../store'
import GlobalHeader from '../components/GlobalHeader.vue'

type CoverTemplate = {
  id: string
  name: string
  background: string
  color: string
  quoteColor: string
  accent: string
  iconPaths: string[] // 用于存储 SVG 的多个 path 数据
  iconViewBox: string // SVG 的 viewBox，例如 "0 -960 960 960" 或 "0 0 24 24"
  texture?: string // 可选的底纹 CSS
  fontFamily?: string // 可选的专属字体
}

const coverText = ref('你好')
const coverAuthor = ref('— 光语 —')
const isCoverDownloading = ref(false)
const coverError = ref('')
const coverCanvasRef = ref<HTMLElement | null>(null)

const handleTextUpdate = (e: Event) => {
  const target = e.target as HTMLElement
  coverText.value = target.innerText
}

const handleAuthorUpdate = (e: Event) => {
  const target = e.target as HTMLElement
  coverAuthor.value = target.innerText
}

const coverTemplates: CoverTemplate[] = [
  { 
    id: 'mint', name: '薄荷', background: 'linear-gradient(180deg, #d9fffb 0%, #dfffff 100%)', color: '#0f172a', quoteColor: '#8ceee3', accent: '#5cd3c4',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M320-160q-33 0-56.5-23.5T240-240v-120h120v120q0 33-23.5 56.5T320-160Zm320 0q-33 0-56.5-23.5T560-240v-120h120v120q0 33-23.5 56.5T640-160ZM160-440v-240q0-100 70-170t170-70q100 0 170 70t70 170v240H160Zm80-80h320v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160Zm160-160Z'], // Emoji shape (Face)
    texture: 'radial-gradient(rgba(92, 211, 196, 0.1) 2px, transparent 2px) 0 0 / 24px 24px', // 波点底纹
    fontFamily: "'ZCOOL KuaiLe', sans-serif"
  },
  { 
    id: 'cream', name: '奶油', background: 'linear-gradient(180deg, #fffaf0 0%, #fff5e7 100%)', color: '#1f2937', quoteColor: '#ffd8a8', accent: '#f59e0b',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm-94-280q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18Zm188 0q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18ZM480-240q66 0 119-33.5T678-360H282q26 53 79 86.5T480-240ZM480-480Z'], // Smile
    texture: 'linear-gradient(45deg, rgba(245, 158, 11, 0.03) 25%, transparent 25%, transparent 50%, rgba(245, 158, 11, 0.03) 50%, rgba(245, 158, 11, 0.03) 75%, transparent 75%, transparent) 0 0 / 40px 40px', // 斜纹底纹
    fontFamily: "'ZCOOL XiaoWei', serif"
  },
  { 
    id: 'mist', name: '雾蓝', background: 'linear-gradient(160deg, #e0f2fe 0%, #ede9fe 100%)', color: '#1e293b', quoteColor: '#b6d9ff', accent: '#60a5fa',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm480 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'], // Neutral Face
    texture: 'repeating-radial-gradient(circle at 0 0, transparent 0, rgba(96, 165, 250, 0.05) 10px, transparent 11px, transparent 20px)', // 同心圆纹
    fontFamily: "'Noto Serif SC', serif"
  },
  { 
    id: 'mono', name: '简黑', background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)', color: '#f8fafc', quoteColor: '#374151', accent: '#818cf8',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-120q66 0 119-33.5T678-400H282q26 53 79 86.5T480-280Zm-94-200q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18Zm188 0q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18ZM480-480Z'], // Happy Face
    texture: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 16px 16px, conic-gradient(from 120deg at 50% 64.95%, rgba(255,255,255,0.03) 0 120deg, transparent 0) 0 0 / 40px 69.28px, conic-gradient(from 120deg at 50% 64.95%, rgba(255,255,255,0.03) 0 120deg, transparent 0) 20px 34.64px / 40px 69.28px, conic-gradient(from 300deg at 50% 35.05%, rgba(255,255,255,0.03) 0 120deg, transparent 0) 0 0 / 40px 69.28px, conic-gradient(from 300deg at 50% 35.05%, rgba(255,255,255,0.03) 0 120deg, transparent 0) 20px 34.64px / 40px 69.28px', // 细密波点 + 纯正六边形蜂窝阵列(通过角锥渐变拼接，不重叠)
    fontFamily: "'ZCOOL QingKe HuangYou', sans-serif"
  },
  { 
    id: 'sunset', name: '落日', background: 'linear-gradient(145deg, #ffe4e6 0%, #ffedd5 100%)', color: '#111827', quoteColor: '#ffc5c8', accent: '#fb7185',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm-60-240h120q0-41 15.5-62t52.5-48q32-23 47-46t15-56q0-54-38-86t-92-32q-47 0-82 22t-50 62l70 30q10-24 28-35t42-11q30 0 47 14t17 38q0 21-14 38t-44 34q-37 25-53.5 53.5T420-400Zm60 160q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-240Z'], // Info/Question Face
    texture: 'repeating-linear-gradient(-45deg, rgba(251, 113, 133, 0.05), rgba(251, 113, 133, 0.05) 2px, transparent 2px, transparent 12px)', // 斜线底纹
    fontFamily: "'Long Cang', cursive"
  },
  { 
    id: 'paper', name: '纸感', background: 'repeating-linear-gradient(0deg, rgba(30, 64, 175, 0.05) 0, rgba(30, 64, 175, 0.05) 1px, transparent 1px, transparent 30px), #ffffff', color: '#111827', quoteColor: '#bfdbfe', accent: '#3b82f6',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-120q66 0 119-33.5T678-400H282q26 53 79 86.5T480-280Zm-94-200q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18Zm188 0q24 0 42-18t18-42q0-24-18-42t-42-18q-24 0-42 18t-18 42q0 24 18 42t42 18ZM480-480Z'], // Emoticon (Happy Face)
    texture: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px) 30px 0 / 100% 100%, url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")', // 纸张竖线 + 噪点褶皱做旧
    fontFamily: "'Liu Jian Mao Cao', cursive"
  },
  { 
    id: 'neon', name: '霓虹', background: 'linear-gradient(135deg, #111827 0%, #312e81 100%)', color: '#ffffff', quoteColor: '#c7d2fe', accent: '#8b5cf6',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93ZM330-466l-56-56 206-206 206 206-56 56-150-150-150 150Zm150 238L274-434l56-56 150 150 150-150 56 56-206 206ZM480-480Z'], // Unfold/Expand
    texture: 'repeating-linear-gradient(45deg, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.05) 1px, transparent 1px, transparent 10px)', // 网格霓虹底纹
    fontFamily: "'Zhi Mang Xing', cursive"
  },
  { 
    id: 'cherry', name: '樱桃', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', color: '#881337', quoteColor: '#fecdd3', accent: '#f43f5e',
    iconViewBox: '0 -960 960 960',
    iconPaths: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93ZM480-360q-66 0-119-33.5T282-480q26-53 79-86.5T480-600q66 0 119 33.5T678-480q-26 53-79 86.5T480-360Zm0-120Z'], // Eye
    texture: 'radial-gradient(circle at center, rgba(244, 63, 94, 0.04) 0%, transparent 70%) 0 0 / 100% 100%, repeating-linear-gradient(30deg, transparent, transparent 10px, rgba(244, 63, 94, 0.03) 10px, rgba(244, 63, 94, 0.03) 20px), repeating-linear-gradient(-30deg, transparent, transparent 10px, rgba(244, 63, 94, 0.03) 10px, rgba(244, 63, 94, 0.03) 20px)', // 樱桃光晕 + 六边形蜂窝交织条纹
    fontFamily: "'Ma Shan Zheng', cursive"
  }
]

const selectedCoverTemplateId = ref(coverTemplates[0].id)
const aiGeneratedBgUrl = ref('')
const isAiModalVisible = ref(false)
const aiPrompt = ref('')
const isGenerating = ref(false)
const aiGenerateStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const aiGenerateMessage = ref('')

const buildAiCoverPrompt = (userIdea: string) => {
  const normalizedIdea = userIdea.trim()
  return `请生成一张适合作为小红书封面背景图的竖版图片。
【合规特别注意】不要出现任何小红书 logo、用户 id、水印、手机边框、白色留边。
【项目特别注意】这是封面背景图，不要生成任何文字、标题、副标题、emoji、贴纸文案或可读字符，画面只保留视觉元素和场景。

页面内容：${normalizedIdea}

页面类型：[封面背景]

设计要求：

1. 整体风格
- 小红书爆款封面风格
- 清新、精致、有设计感
- 适合年轻用户审美
- 配色和谐，视觉吸引力强

2. 画面表现
- 需要有明确视觉焦点
- 背景丰富但不杂乱
- 适合后续叠加大标题文字
- 保留足够留白，避免主体占满整个画面
- 构图适合竖屏封面展示

3. 视觉元素
- 可以有装饰性图形、插画感元素或氛围场景
- 色调可根据主题选择清新、温暖、科技、治愈、时尚等方向
- 保持高级感、干净感和统一性
- 不要出现影响后续排版的密集杂讯

4. 技术规格
- 竖版 3:4 比例
- 高清画质
- 适合手机屏幕查看
- 不能左右旋转、倒置或错位
- 画面主体完整，边缘自然

5. 与主题一致
- 画面必须紧密围绕这个主题展开：${normalizedIdea}
- 优先表达主题氛围、核心场景和视觉关键词
- 生成结果要适合作为内容创作类封面背景

请根据以上要求，生成一张精美、可直接用于封面模块的背景图。`
}

const selectedCoverTemplate = computed(() => {
  if (selectedCoverTemplateId.value === 'ai') {
    return {
      id: 'ai',
      name: 'AI创作',
      background: aiGeneratedBgUrl.value ? `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url(${aiGeneratedBgUrl.value}) center/cover no-repeat` : '#1f2937',
      color: '#ffffff',
      quoteColor: 'rgba(255,255,255,0.8)',
      accent: '#f43f5e',
      iconViewBox: '0 -960 960 960',
      iconPaths: ['M320-160q-33 0-56.5-23.5T240-240v-120h120v120q0 33-23.5 56.5T320-160Zm320 0q-33 0-56.5-23.5T560-240v-120h120v120q0 33-23.5 56.5T640-160ZM160-440v-240q0-100 70-170t170-70q100 0 170 70t70 170v240H160Zm80-80h320v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160Zm160-160Z'],
      fontFamily: "'Noto Serif SC', serif"
    }
  }
  return coverTemplates.find((template) => template.id === selectedCoverTemplateId.value) ?? coverTemplates[0]
})

const openAiModal = () => {
  isAiModalVisible.value = true
  aiGenerateStatus.value = 'idle'
  aiGenerateMessage.value = ''
}

const closeAiModal = () => {
  isAiModalVisible.value = false
  aiPrompt.value = ''
  aiGenerateStatus.value = 'idle'
  aiGenerateMessage.value = ''
}

const preloadImage = (imageUrl: string) =>
  new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = imageUrl
  })

const generateAiImage = async () => {
  const userIdea = aiPrompt.value.trim()
  if (!userIdea) return
  isGenerating.value = true
  aiGenerateStatus.value = 'loading'
  aiGenerateMessage.value = '正在生成中，请稍候...'
  
  try {
    const finalPrompt = buildAiCoverPrompt(userIdea)
    const imageUrl =
      aiProvider.value === 'qwen' &&
      selectedAiModel.value?.kind === 'image'
        ? await generateAiImageUrl(finalPrompt)
        : `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=1200&nologo=true&seed=${Date.now()}`

    await preloadImage(imageUrl)
    
    aiGeneratedBgUrl.value = imageUrl
    selectedCoverTemplateId.value = 'ai'
    aiGenerateStatus.value = 'success'
    aiGenerateMessage.value = '生成成功，已自动应用到封面。你可以继续修改提示词再次生成。'
  } catch (error) {
    console.error('图片生成失败:', error)
    aiGenerateStatus.value = 'error'
    aiGenerateMessage.value = error instanceof Error ? error.message : '图片生成失败，请稍后重试'
  } finally {
    isGenerating.value = false
  }
}

const downloadCover = async () => {
  coverError.value = ''
  if (!coverCanvasRef.value) {
    coverError.value = '封面节点未准备好，请稍后重试。'
    return
  }
  isCoverDownloading.value = true
  try {
    const dataUrl = await toPng(coverCanvasRef.value, {
      cacheBust: true,
      pixelRatio: 2
    })
    const link = document.createElement('a')
    link.download = `${safeFilename(coverText.value || '封面')}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    coverError.value = '封面导出失败，请调整内容后重试。'
  } finally {
    isCoverDownloading.value = false
  }
}
</script>

<template>
  <div class="page app-shell view-cover">
    <GlobalHeader :compact="isMobile" />

    <main class="coverLayout">
      <section class="coverStage panel">
        <div class="coverCanvasWrap">
          <div class="coverCanvasWrap__inner">
            <div
              ref="coverCanvasRef"
              class="coverCanvas"
              :style="{ background: selectedCoverTemplate.background, color: selectedCoverTemplate.color, fontFamily: selectedCoverTemplate.fontFamily }"
            >
                <!-- 底纹层 -->
                <div v-if="selectedCoverTemplate.texture" class="coverCanvas__texture" :style="{ background: selectedCoverTemplate.texture }"></div>
                
                <svg class="coverCanvas__quote" :viewBox="selectedCoverTemplate.iconViewBox" fill="none" :style="{ color: selectedCoverTemplate.quoteColor }">
                  <path v-for="(path, index) in selectedCoverTemplate.iconPaths" :key="index" :d="path" fill="currentColor" />
                </svg>
                <div class="coverCanvas__text" contenteditable="true" @blur="handleTextUpdate" @input="handleTextUpdate">{{ coverText || '请输入标题' }}</div>
                <div class="coverCanvas__footer">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" />
                    <path d="M9 14.5C9.8 15.4 10.8 16 12 16C13.2 16 14.2 15.4 15 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    <path d="M9 10H9.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                    <path d="M14.9 10H15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                  <span contenteditable="true" @blur="handleAuthorUpdate" @input="handleAuthorUpdate">{{ coverAuthor }}</span>
                </div>
                <span class="coverCanvas__accent" :style="{ background: selectedCoverTemplate.accent }" />
              </div>
            </div>
          </div>
      </section>

      <aside class="coverSidebar panel">
        <div class="coverSidebar__title">选择一个喜欢的封面风格</div>
        <div class="coverTemplateGrid">
          <button
            v-for="template in coverTemplates"
            :key="template.id"
            class="coverTemplateCard"
            :class="{ 'coverTemplateCard--active': selectedCoverTemplateId === template.id }"
            @click="selectedCoverTemplateId = template.id"
          >
            <div class="coverTemplateCard__thumb" :style="{ background: template.background, color: template.color, fontFamily: template.fontFamily }">
              <div v-if="template.texture" class="coverTemplateCard__texture" :style="{ background: template.texture }"></div>
              <svg :viewBox="template.iconViewBox" fill="none" :style="{ color: template.quoteColor }">
                <path v-for="(path, index) in template.iconPaths" :key="index" :d="path" fill="currentColor" />
              </svg>
              <span>你好</span>
            </div>
            <strong>{{ template.name }}</strong>
          </button>
          
          <!-- AI创作入口 -->
          <button
            class="coverTemplateCard"
            :class="{ 'coverTemplateCard--active': selectedCoverTemplateId === 'ai' }"
            @click="selectedCoverTemplateId !== 'ai' && aiGeneratedBgUrl ? selectedCoverTemplateId = 'ai' : openAiModal()"
          >
            <div class="coverTemplateCard__thumb coverTemplateCard__thumb--ai" :style="aiGeneratedBgUrl ? { background: `url(${aiGeneratedBgUrl}) center/cover no-repeat`, color: '#ffffff', border: 'none' } : {}">
              <span v-if="!aiGeneratedBgUrl">AI创作</span>
              <span v-else>你好</span>
            </div>
            <strong style="color: var(--primary);">AI创作</strong>
          </button>
        </div>
        <div style="flex: 1;"></div>
        <button class="btn btn--primary coverDownloadBtn" style="padding: 12px; font-size: 15px; width: 100%; justify-content: center; gap: 8px;" :disabled="isCoverDownloading" @click="downloadCover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 18H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          {{ isCoverDownloading ? '导出中…' : '导出封面' }}
        </button>
        <p v-if="coverError" class="coverError">{{ coverError }}</p>
      </aside>
    </main>

    <!-- AI 创作弹窗 -->
    <div v-if="isAiModalVisible" class="aiModalOverlay" @click="closeAiModal">
      <div class="aiModal" @click.stop>
        <div class="aiModal__header">
          <h3>AI 创作</h3>
          <button class="aiModal__close" @click="closeAiModal">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="aiModal__body">
          <div v-if="aiGenerateStatus !== 'idle'" class="aiModal__result" :class="`aiModal__result--${aiGenerateStatus}`">
            <div v-if="aiGenerateStatus === 'loading'" class="aiModal__loading">
              <span class="aiModal__loadingDot"></span>
              <span>{{ aiGenerateMessage }}</span>
            </div>
            <div v-else-if="aiGenerateStatus === 'success'" class="aiModal__success">
              <img v-if="aiGeneratedBgUrl" :src="aiGeneratedBgUrl" alt="AI 生成结果" class="aiModal__resultImage" />
              <p>{{ aiGenerateMessage }}</p>
            </div>
            <p v-else class="aiModal__error">{{ aiGenerateMessage }}</p>
          </div>
          <textarea
            v-model="aiPrompt"
            class="aiModal__input"
            placeholder="输入提示词，让 AI 为你生成独一无二的封面背景：例如赛博朋克风格的未来城市，霓虹灯，夜晚，高质量..."
            rows="6"
            :disabled="isGenerating"
          ></textarea>
        </div>
        <div class="aiModal__footer">
          <button class="btn btn--outline aiModal__btn" @click="closeAiModal" :disabled="isGenerating">取消</button>
          <button class="btn btn--primary aiModal__btn" @click="generateAiImage" :disabled="isGenerating || !aiPrompt.trim()">
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
