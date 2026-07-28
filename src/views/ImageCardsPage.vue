<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import GlobalHeader from '../components/GlobalHeader.vue'
import UiEmptyState from '../components/ui/UiEmptyState.vue'
import UiNotice from '../components/ui/UiNotice.vue'
import UiPanelIntro from '../components/ui/UiPanelIntro.vue'
import { useToast } from '../composables/useToast'
import { request } from '../request'
import { generateAiImageUrl, cancelImagePoll } from '../store'
import { toPng } from 'html-to-image'

const toast = useToast()

onUnmounted(() => cancelImagePoll())

// Form State
const inputText = ref('')
const imageCount = ref(4)
const selectedStyle = ref('minimalist')
const isProcessing = ref(false)
const isAnalyzing = ref(false)
const isGeneratingBg = ref(false)
const statusMessage = ref('')
const isCancelled = ref(false)

// Progress tracking
const bgTotal = ref(0)
const bgDone = ref(0)

// Data State
interface CardData {
  position: string
  coreMessage: string
  textContent: string
  visualConcept: string
  bgUrl?: string
  isGeneratingBg?: boolean
  error?: string
}
const cards = ref<CardData[]>([])
const cardRefs = ref<HTMLElement[]>([])

const styles = [
  { id: 'minimalist', name: '极简风', desc: '干净留白', color: '#f8fafc' },
  { id: 'gradient', name: '渐变风', desc: '年轻活力', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'dark', name: '暗黑风', desc: '高级质感', color: '#1e293b' },
  { id: 'nature', name: '自然风', desc: '清新治愈', color: '#dcfce7' },
]

/** 生成单张卡片背景的 prompt */
function buildCardPrompt(card: CardData) {
  return `小红书爆款图文背景，${styles.find(s => s.id === selectedStyle.value)?.name}。画面要求：${card.visualConcept}。注意：纯背景，无文字，无水印，留白充足，高级感，3:4竖版。`
}

/** 限流并发执行，最多同时跑 maxConcurrent 个任务 */
async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  maxConcurrent: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < tasks.length) {
      if (isCancelled.value) return
      const currentIndex = nextIndex++
      results[currentIndex] = await tasks[currentIndex]()
    }
  }

  const workers = Array.from(
    { length: Math.min(maxConcurrent, tasks.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}

/** 将未知错误提取为可读消息 */
function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

const startGeneration = async () => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入需要转换的内容')
    return
  }

  isProcessing.value = true
  isCancelled.value = false
  cards.value = []
  bgTotal.value = 0
  bgDone.value = 0

  // 阶段 1：AI 拆分大纲
  isAnalyzing.value = true
  statusMessage.value = '正在利用 AI 拆分内容大纲...'

  try {
    const data = await request<{ cards: CardData[] }>('/ai/images/analyze-cards', {
      method: 'POST',
      data: {
        content: inputText.value,
        imageCount: imageCount.value,
        style: selectedStyle.value,
      },
      timeoutMs: 60000
    })

    if (!data.cards || data.cards.length === 0) {
      throw new Error('AI 返回的大纲为空')
    }

    cards.value = data.cards.map(c => ({
      ...c,
      isGeneratingBg: false
    }))

    isAnalyzing.value = false

    if (isCancelled.value) {
      statusMessage.value = '已取消生成'
      return
    }

    // 阶段 2：限流并发生成背景图（最多 2 个并发）
    isGeneratingBg.value = true
    bgTotal.value = cards.value.length
    statusMessage.value = `正在生成背景图 0/${bgTotal.value}...`

    await runWithConcurrency(
      cards.value.map((card) => async () => {
        if (isCancelled.value) return
        card.isGeneratingBg = true
        try {
          const url = await generateAiImageUrl(buildCardPrompt(card))
          card.bgUrl = url
        } catch (err: unknown) {
          card.error = getErrorMessage(err, '图片生成失败')
        } finally {
          card.isGeneratingBg = false
          bgDone.value++
          statusMessage.value = `正在生成背景图 ${bgDone.value}/${bgTotal.value}...`
        }
      }),
      2, // max concurrent
    )

    if (isCancelled.value) {
      statusMessage.value = '生成已取消'
    } else {
      statusMessage.value = ''
      const failed = cards.value.filter(c => c.error).length
      if (failed > 0) {
        toast.warning(`${bgTotal.value - failed}/${bgTotal.value} 张生成成功，${failed} 张失败，可点击重试`)
      } else {
        toast.success('所有卡片生成完毕！')
      }
    }

  } catch (err: unknown) {
    statusMessage.value = getErrorMessage(err, '生成过程中发生错误，请重试')
  } finally {
    isAnalyzing.value = false
    isGeneratingBg.value = false
    isProcessing.value = false
  }
}

const cancelGeneration = () => {
  isCancelled.value = true
  cancelImagePoll()
  statusMessage.value = '正在取消...'
}

/** 单张卡片重新生成背景 */
const regenerateCardBg = async (index: number) => {
  const card = cards.value[index]
  if (!card || card.isGeneratingBg) return

  card.isGeneratingBg = true
  card.error = undefined

  try {
    const url = await generateAiImageUrl(buildCardPrompt(card))
    card.bgUrl = url
    toast.success(`第 ${index + 1} 张背景已重新生成`)
  } catch (err: unknown) {
    card.error = getErrorMessage(err, '图片生成失败')
    toast.error(`第 ${index + 1} 张重新生成失败`)
  } finally {
    card.isGeneratingBg = false
  }
}

const downloadCard = async (index: number) => {
  const el = cardRefs.value[index]
  if (!el) return

  try {
    const dataUrl = await toPng(el, { cacheBust: true, pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = `card_${index + 1}.png`
    link.href = dataUrl
    link.click()
  } catch {
    toast.error('导出失败，请重试')
  }
}

const downloadAll = async () => {
  for (let i = 0; i < cards.value.length; i++) {
    await downloadCard(i)
    // slight delay to prevent browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}
</script>

<template>
  <div class="page app-shell view-image-cards">
    <GlobalHeader />

    <main class="workspace">
      <!-- 左侧预览区 (Stage) -->
      <section class="stage panel">
        <div class="stage-inner" v-if="cards.length > 0">
          <div class="cards-grid">
            <div 
              v-for="(card, index) in cards" 
              :key="index" 
              class="card-wrapper"
            >
              <div class="card-render" ref="cardRefs" :class="`style-${selectedStyle}`">
                <div class="card-bg" :style="{ backgroundImage: card.bgUrl ? `url(${card.bgUrl})` : 'none', background: !card.bgUrl ? styles.find(s => s.id === selectedStyle)?.color : '' }">
                  <div class="bg-overlay"></div>
                </div>
                
                <div class="card-content">
                  <div class="card-header">
                    <span class="card-badge">{{ card.position === 'Cover' ? '封面' : (card.position === 'End' ? '结尾' : `P${index}`) }}</span>
                  </div>
                  <div class="card-body">
                    <h2 class="card-title">{{ card.coreMessage }}</h2>
                    <p class="card-text">{{ card.textContent }}</p>
                  </div>
                  <div class="card-footer">
                    <span class="brand">@光语</span>
                  </div>
                </div>

                <!-- Loading State for Background -->
                <div class="card-loading" v-if="card.isGeneratingBg">
                  <div class="spinner"></div>
                  <span>绘制背景中...</span>
                </div>
                <div class="card-error" v-if="card.error">
                  <div class="card-error__text">{{ card.error }}</div>
                  <button class="btn btn--sm btn--outline card-error__retry" @click="regenerateCardBg(index)">重试</button>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="btn btn--sm btn--outline" @click="downloadCard(index)" :disabled="card.isGeneratingBg || !!card.error">
                  下载此图
                </button>
                <button
                  v-if="card.bgUrl && !card.isGeneratingBg"
                  class="btn btn--sm btn--ghost"
                  @click="regenerateCardBg(index)"
                >
                  换背景
                </button>
              </div>
            </div>
          </div>
        </div>
        <UiEmptyState
          v-else
          badge="AI 图文系列"
          title="AI 图文系列"
          description="在右侧输入文案，AI 会自动拆分大纲、生成背景，并输出统一风格的系列图文。"
        >
          <template #icon>✨</template>
        </UiEmptyState>
      </section>

      <!-- 右侧配置区 (Sidebar) -->
      <aside class="sidebar panel">
        <UiPanelIntro
          title="创作设置"
          description="文本与图片能力通过 AI 工作流完成，支持多模型切换。"
        />

        <div class="config-group">
          <label class="config-label">输入内容</label>
          <textarea
            v-model="inputText"
            class="config-textarea"
            placeholder="粘贴你的文章、教程、灵感或任何想法...&#10;AI 会自动提炼核心并拆分成多张图文卡片。"
            maxlength="10000"
          ></textarea>
        </div>

        <div class="config-group">
          <label class="config-label">卡片数量 (1-10张)</label>
          <div class="number-input">
            <input type="range" v-model="imageCount" min="1" max="10" class="slider" />
            <span class="number-display">{{ imageCount }}</span>
          </div>
        </div>

        <div class="config-group">
          <label class="config-label">视觉风格</label>
          <div class="style-grid">
            <div 
              v-for="style in styles" 
              :key="style.id"
              class="style-item"
              :class="{ active: selectedStyle === style.id }"
              @click="selectedStyle = style.id"
            >
              <div class="style-color" :style="{ background: style.color }"></div>
              <div class="style-info">
                <div class="style-name">{{ style.name }}</div>
                <div class="style-desc">{{ style.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-footer">
          <UiNotice :message="statusMessage" :tone="isProcessing ? 'processing' : 'default'" />
          
          <button 
            v-if="isProcessing"
            class="btn btn--outline btn--block" 
            @click="cancelGeneration"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            取消生成
          </button>

          <button 
            v-else
            class="btn btn--primary btn--block" 
            @click="startGeneration" 
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.5 4.5L6.5 7L9 8L6.5 9L5.5 11.5L4.5 9L2 8L4.5 7L5.5 4.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            一键生成系列卡片
          </button>

          <button 
            v-if="cards.length > 0 && !isProcessing"
            class="btn btn--outline btn--block mt-3" 
            @click="downloadAll"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
              <path d="M12 4V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5 18H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            全部下载
          </button>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* Layout Base */
.view-image-cards {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
  flex: 1;
  min-height: 0;
  padding: 20px 0 22px;
  width: min(1440px, calc(100vw - 48px));
  margin: 0 auto;
  box-sizing: border-box;
}

/* Stage (Left Area) */
.stage {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(244, 247, 255, 0.6));
  border-radius: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-md);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.stage::-webkit-scrollbar {
  display: none;
}

.stage-inner {
  padding: 28px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Card Rendering */
.card-render {
  aspect-ratio: 3/4;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.76);
}

.card-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  color: #fff;
}

.card-header {
  display: flex;
  justify-content: flex-end;
}

.card-badge {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.card-body {
  margin-top: auto;
  margin-bottom: 24px;
}

.card-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card-text {
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  display: -webkit-box;
  -webkit-line-clamp: 6;
  line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 16px;
  font-size: 12px;
  opacity: 0.84;
  display: flex;
  justify-content: space-between;
}

/* Style variations */
.style-minimalist .card-content { color: #1e293b; }
.style-minimalist .bg-overlay { background: linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 100%); }
.style-minimalist .card-badge { background: rgba(0,0,0,0.05); color: #1e293b; }
.style-minimalist .card-title, .style-minimalist .card-text { text-shadow: none; }
.style-minimalist .card-footer { border-top-color: rgba(0,0,0,0.1); }

.style-nature .card-content { color: #064e3b; }
.style-nature .bg-overlay { background: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(220,252,231,0.9) 100%); }
.style-nature .card-badge { background: rgba(0,0,0,0.05); color: #064e3b; }
.style-nature .card-title, .style-nature .card-text { text-shadow: none; }
.style-nature .card-footer { border-top-color: rgba(0,0,0,0.1); }

/* Loading & Error */
.card-loading {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(4px);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 14px;
  font-weight: 500;
  gap: 12px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(22, 93, 255, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.card-error {
  position: absolute;
  inset: 0;
  background: rgba(253,236,238,0.9);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #dc2626;
  font-size: 13px;
  padding: 20px;
  text-align: center;
}

.card-error__text {
  line-height: 1.5;
}

.card-error__retry {
  color: #dc2626;
  border-color: #fdecee;
  background: rgba(255,255,255,0.8);
}

.card-error__retry:hover {
  background: #fff;
  border-color: #dc2626;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions .btn {
  flex: 1;
}

.btn--ghost {
  background: transparent;
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn--ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

/* Sidebar (Right Area) */
.sidebar {
  background: linear-gradient(
    180deg,
    var(--surface),
    var(--surface-alt)
  );
  border-radius: 24px;
  border: 1px solid var(--border);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  box-shadow: var(--shadow-md);
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
}
.sidebar::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome/Safari */
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.config-label {
  font-size: 13px;
  font-weight: 700;
  color: #344054;
}

.config-textarea {
  width: 100%;
  min-height: 160px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
  background: rgba(255, 255, 255, 0.94);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  box-sizing: border-box;
}

.config-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.number-input {
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
  background: rgba(238, 242, 255, 0.56);
  padding: 10px 12px;
}

.slider {
  flex: 1;
  accent-color: var(--accent);
}

.number-display {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  min-width: 36px;
  min-height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.style-item {
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(248, 250, 255, 0.92), rgba(255, 255, 255, 0.9));
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.style-item:hover {
  background: var(--surface);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.style-item.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: var(--shadow-md);
}

.style-color {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
  flex-shrink: 0;
}

.style-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.style-desc {
  font-size: 11px;
  color: #667085;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.btn--block {
  width: 100%;
  min-height: 46px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 14px;
}

.mt-3 {
  margin-top: 12px;
}
</style>
