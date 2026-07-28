<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import GlobalHeader from '../components/GlobalHeader.vue'
import UiPanelIntro from '../components/ui/UiPanelIntro.vue'
import { useToast } from '../composables/useToast'
import { sanitizeHtml } from '../store'

const toast = useToast()

type InputMode = 'markdown' | 'plain'
type TitleAlign = 'left' | 'center'

type WechatTheme = {
  id: string
  name: string
  desc: string
  fontFamily: string
  pageGradient: string
  articleBg: string
  titleColor: string
  textColor: string
  mutedColor: string
  accentColor: string
  blockquoteBg: string
  blockquoteBorder: string
  codeBg: string
}

const sampleMarkdown = `# 为什么内容发布前一定要先做公众号排版

很多内容本身没有问题，但一旦直接贴进公众号编辑器，就会出现这些情况：

- 标题层级混乱
- 段落太密，阅读压力大
- 引用、代码、列表没有重点
- 整体风格和品牌气质不统一

## 公众号排版的核心目标

不是单纯“变好看”，而是让读者更愿意读下去。

> 好的排版，会让同样一篇内容，阅读完成率提升很多。

建议从下面 4 个维度统一：

1. 标题节奏
2. 段落留白
3. 强调样式
4. 品牌配色

\`\`\`ts
const publishChecklist = ['标题清晰', '段落舒适', '重点明确', '风格统一']
\`\`\`

最后，在发布前再检查一次封面、摘要和首屏，整体体验会更完整。`

const themes: WechatTheme[] = [
  {
    id: 'minimal',
    name: '简约风',
    desc: '克制、干净、适合知识型内容',
    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    pageGradient: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(246,248,255,0.82))',
    articleBg: '#ffffff',
    titleColor: '#111827',
    textColor: '#374151',
    mutedColor: '#6b7280',
    accentColor: '#4f46e5',
    blockquoteBg: '#eef2ff',
    blockquoteBorder: '#818cf8',
    codeBg: '#111827',
  },
  {
    id: 'parchment',
    name: '羊皮纸',
    desc: '更有阅读氛围，适合长文与专栏',
    fontFamily: '"Noto Serif SC", "Songti SC", serif',
    pageGradient: 'linear-gradient(180deg, rgba(250,244,228,0.96), rgba(245,236,214,0.9))',
    articleBg: '#fffaf0',
    titleColor: '#5b341f',
    textColor: '#6a4b32',
    mutedColor: '#8b6b4d',
    accentColor: '#b7791f',
    blockquoteBg: '#fef3c7',
    blockquoteBorder: '#d97706',
    codeBg: '#4b3621',
  },
  {
    id: 'tech',
    name: '科技风',
    desc: '更强调层次感，适合产品与技术文章',
    fontFamily: '"Inter", "SF Pro Display", "PingFang SC", sans-serif',
    pageGradient: 'linear-gradient(180deg, rgba(9,16,37,0.96), rgba(17,24,39,0.92))',
    articleBg: '#0f172a',
    titleColor: '#f8fafc',
    textColor: '#dbe4ff',
    mutedColor: '#93a4c9',
    accentColor: '#38bdf8',
    blockquoteBg: 'rgba(56,189,248,0.12)',
    blockquoteBorder: '#38bdf8',
    codeBg: '#020617',
  },
  {
    id: 'brand',
    name: '品牌感',
    desc: '更适合产品发布、活动与增长内容',
    fontFamily: '"PingFang SC", "Inter", sans-serif',
    pageGradient: 'linear-gradient(180deg, rgba(255,247,252,0.96), rgba(249,244,255,0.9))',
    articleBg: '#ffffff',
    titleColor: '#3b0764',
    textColor: '#4c1d95',
    mutedColor: '#7c3aed',
    accentColor: '#ec4899',
    blockquoteBg: 'rgba(236,72,153,0.08)',
    blockquoteBorder: '#ec4899',
    codeBg: '#581c87',
  },
]

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

marked.use({ breaks: true })

const inputMode = ref<InputMode>('markdown')
const rawContent = ref(sampleMarkdown)
const selectedThemeId = ref(themes[0].id)
const accentColor = ref(themes[0].accentColor)
const articleBg = ref(themes[0].articleBg)
const textColor = ref(themes[0].textColor)
const fontSize = ref(16)
const lineHeight = ref(1.9)
const paragraphGap = ref(18)
const titleAlign = ref<TitleAlign>('left')
const articleRef = ref<HTMLElement | null>(null)

const activeTheme = computed(
  () => themes.find((theme) => theme.id === selectedThemeId.value) ?? themes[0],
)

watch(
  selectedThemeId,
  (id) => {
    const theme = themes.find((item) => item.id === id) ?? themes[0]
    accentColor.value = theme.accentColor
    articleBg.value = theme.articleBg
    textColor.value = theme.textColor
  },
  { immediate: true },
)

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderPlainText = (text: string) => {
  const normalized = text.trim()
  if (!normalized) return ''

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      const unordered = lines.every((line) => /^[-*]\s+/.test(line))
      const ordered = lines.every((line) => /^\d+\.\s+/.test(line))

      if (unordered) {
        return `<ul>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ''))}</li>`)
          .join('')}</ul>`
      }

      if (ordered) {
        return `<ol>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^\d+\.\s+/, ''))}</li>`)
          .join('')}</ol>`
      }

      return `<p>${lines.map((line) => escapeHtml(line)).join('<br/>')}</p>`
    })
    .join('')
}

const renderedHtml = computed(() => {
  const source = rawContent.value.trim()
  if (!source) return ''
  const raw = inputMode.value === 'markdown'
    ? (marked.parse(source) as string)
    : renderPlainText(source)
  return sanitizeHtml(raw)
})

const articleStyle = computed(() => ({
  '--wechat-font-family': activeTheme.value.fontFamily,
  '--wechat-article-bg': articleBg.value,
  '--wechat-title-color': activeTheme.value.id === 'tech' ? activeTheme.value.titleColor : accentColor.value,
  '--wechat-text-color': textColor.value,
  '--wechat-muted-color': activeTheme.value.mutedColor,
  '--wechat-accent-color': accentColor.value,
  '--wechat-blockquote-bg': activeTheme.value.blockquoteBg,
  '--wechat-blockquote-border': activeTheme.value.blockquoteBorder,
  '--wechat-code-bg': activeTheme.value.codeBg,
  '--wechat-font-size': `${fontSize.value}px`,
  '--wechat-line-height': String(lineHeight.value),
  '--wechat-paragraph-gap': `${paragraphGap.value}px`,
  '--wechat-title-align': titleAlign.value,
  '--wechat-page-gradient': activeTheme.value.pageGradient,
}))

const loadExample = () => {
  inputMode.value = 'markdown'
  rawContent.value = sampleMarkdown
}

const INLINE_STYLE_PROPERTIES = [
  'display',
  'position',
  'width',
  'max-width',
  'min-width',
  'margin',
  'padding',
  'border',
  'border-radius',
  'background',
  'background-color',
  'background-image',
  'box-shadow',
  'color',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-decoration',
  'text-transform',
  'white-space',
  'word-break',
  'overflow-wrap',
  'list-style',
  'list-style-type',
  'list-style-position',
]

const inlineComputedStyles = (source: Element, target: Element) => {
  if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) return

  const computedStyle = getComputedStyle(source)
  const cssText = INLINE_STYLE_PROPERTIES.map(
    (property) => `${property}:${computedStyle.getPropertyValue(property)};`,
  ).join('')

  target.style.cssText = cssText
  target.removeAttribute('class')
  Array.from(source.children).forEach((child, index) => {
    const clonedChild = target.children[index]
    if (clonedChild) inlineComputedStyles(child, clonedChild)
  })
}

const buildWechatHtml = (articleNode: HTMLElement) => {
  const outerWrapper = document.createElement('section')
  outerWrapper.style.width = '100%'
  outerWrapper.style.margin = '0 auto'
  outerWrapper.style.padding = '0'
  outerWrapper.style.boxSizing = 'border-box'
  outerWrapper.style.textAlign = 'center'

  const innerWrapper = document.createElement('section')
  innerWrapper.style.width = '100%'
  innerWrapper.style.maxWidth = '720px'
  innerWrapper.style.margin = '0 auto'
  innerWrapper.style.padding = '0'
  innerWrapper.style.boxSizing = 'border-box'
  innerWrapper.style.textAlign = 'left'

  const clonedArticle = articleNode.cloneNode(true) as HTMLElement
  inlineComputedStyles(articleNode, clonedArticle)
  clonedArticle.style.width = '100%'
  clonedArticle.style.maxWidth = '720px'
  clonedArticle.style.margin = '0 auto'
  clonedArticle.style.boxSizing = 'border-box'
  clonedArticle.style.textAlign = 'left'

  innerWrapper.appendChild(clonedArticle)
  outerWrapper.appendChild(innerWrapper)
  return outerWrapper.outerHTML
}

const copyWechatHtml = async () => {
  if (!articleRef.value) {
    toast.error('排版内容尚未准备好。')
    return
  }

  toast.info('正在生成可复制的 HTML...')

  try {
    const html = buildWechatHtml(articleRef.value)
    const text = articleRef.value.innerText

    if (
      typeof ClipboardItem !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.write === 'function'
    ) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        }),
      ])
    } else {
      await navigator.clipboard.writeText(text)
    }

    toast.success('已复制排版 HTML，可直接粘贴到编辑器中。')
  } catch (error) {
    toast.error('复制失败，请检查浏览器剪贴板权限。')
  }
}

const copyPlainContent = async () => {
  try {
    await navigator.clipboard.writeText(articleRef.value?.innerText || '')
    toast.success('已复制正文文本。')
  } catch (error) {
    toast.error('复制正文失败，请稍后重试。')
  }
}
</script>

<template>
  <div class="page view-wechat-typeset">
    <GlobalHeader />

    <main class="main">
      <aside class="panel settings-panel">
        <UiPanelIntro
          title="内容输入"
          description="支持 Markdown 与普通文本，实时适配为长文正文排版。"
        />

        <div class="settings-content">
          <div class="group">
            <div class="field">
              <span class="group__title">输入模式</span>
              <div class="segmented segmented--3">
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': inputMode === 'markdown' }"
                  type="button"
                  @click="inputMode = 'markdown'"
                >
                  Markdown
                </button>
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': inputMode === 'plain' }"
                  type="button"
                  @click="inputMode = 'plain'"
                >
                  普通文本
                </button>
                <button class="segmented__btn" type="button" @click="loadExample">
                  示例内容
                </button>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="field">
              <span class="group__title">编辑</span>
              <textarea
                v-model="rawContent"
                class="wechatTextarea"
                :placeholder="inputMode === 'markdown'
                  ? '输入 Markdown 内容，支持标题、列表、引用、代码块等语法...'
                  : '输入普通文本内容，系统会自动处理段落与列表结构...'"
              />
            </div>
          </div>
        </div>
      </aside>

      <section class="panel center-panel">
        <div class="content-toolbar">
          <div class="content-toolbar__group">
            <UiPanelIntro
              title="排版预览"
              description="预览结果按长文阅读习惯优化，可随时切换风格与配色。"
            />
          </div>
          <div class="content-toolbar__spacer" />
          <div class="content-toolbar__group">
            <button class="btn btn--outline btn--sm content-toolbar__action" type="button" @click="copyPlainContent">
              复制正文
            </button>
            <button class="btn btn--primary btn--sm content-toolbar__action" type="button" @click="copyWechatHtml">
              <svg class="content-toolbar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              复制 HTML
            </button>
          </div>
        </div>

        <div class="center-panel__scroll">
          <div class="wechatStage" :style="articleStyle">
            <article ref="articleRef" class="wechatArticle">
              <div
                v-if="renderedHtml"
                class="wechatArticle__content"
                v-html="renderedHtml"
              />
              <div v-else class="wechatArticle__placeholder">
                在左侧输入 Markdown 或普通文本后，这里会自动生成排版预览。
              </div>
            </article>
          </div>
        </div>
      </section>

      <aside class="panel settings-panel">
        <UiPanelIntro
          title="排版设置"
        />

        <div class="settings-content">
          <div class="group">
            <div class="field">
              <span class="group__title">排版风格</span>
              <div class="themeGrid">
                <button
                  v-for="theme in themes"
                  :key="theme.id"
                  class="themeCard"
                  :class="{ 'themeCard--active': selectedThemeId === theme.id }"
                  type="button"
                  @click="selectedThemeId = theme.id"
                >
                  <span class="themeCard__name">{{ theme.name }}</span>
                  <span class="themeCard__desc">{{ theme.desc }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="field">
              <span class="group__title">标题对齐</span>
              <div class="segmented segmented--3">
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': titleAlign === 'left' }"
                  type="button"
                  @click="titleAlign = 'left'"
                >
                  左对齐
                </button>
                <button
                  class="segmented__btn"
                  :class="{ 'segmented__btn--active': titleAlign === 'center' }"
                  type="button"
                  @click="titleAlign = 'center'"
                >
                  居中
                </button>
                <button class="segmented__btn" type="button" @click="loadExample">
                  重置示例
                </button>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="field">
              <span class="group__title">颜色设置</span>
              <div class="field">
                <span class="field__label">主强调色</span>
                <div class="colorPickerLight">
                  <label class="colorPickerLight__native-wrapper">
                    <input v-model="accentColor" class="colorPickerLight__native" type="color" />
                    <span class="colorPickerLight__dot" :style="{ backgroundColor: accentColor }" />
                  </label>
                  <input v-model="accentColor" class="colorPickerLight__input" type="text" />
                </div>
              </div>
              <div class="field">
                <span class="field__label">正文背景</span>
                <div class="colorPickerLight">
                  <label class="colorPickerLight__native-wrapper">
                    <input v-model="articleBg" class="colorPickerLight__native" type="color" />
                    <span class="colorPickerLight__dot" :style="{ backgroundColor: articleBg }" />
                  </label>
                  <input v-model="articleBg" class="colorPickerLight__input" type="text" />
                </div>
              </div>
              <div class="field">
                <span class="field__label">正文文字</span>
                <div class="colorPickerLight">
                  <label class="colorPickerLight__native-wrapper">
                    <input v-model="textColor" class="colorPickerLight__native" type="color" />
                    <span class="colorPickerLight__dot" :style="{ backgroundColor: textColor }" />
                  </label>
                  <input v-model="textColor" class="colorPickerLight__input" type="text" />
                </div>
              </div>
            </div>
          </div>

        <div class="group">
          <div class="field">
            <span class="group__title">版式参数</span>
            <label class="wechatRange">
              <span>字号</span>
              <input v-model="fontSize" class="range" type="range" min="14" max="20" />
              <strong>{{ fontSize }} px</strong>
            </label>
            <label class="wechatRange">
              <span>行高</span>
              <input v-model="lineHeight" class="range" type="range" min="1.6" max="2.2" step="0.05" />
              <strong>{{ Number(lineHeight).toFixed(2) }}</strong>
            </label>
            <label class="wechatRange">
              <span>段落留白</span>
              <input v-model="paragraphGap" class="range" type="range" min="12" max="28" step="1" />
              <strong>{{ paragraphGap }} px</strong>
            </label>
          </div>
        </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* 微信排版页 settings-content 自适应宽度 */
.settings-content {
  width: 100%;
}

.wechatTextarea {
  width: 100%;
  flex: 1;
  min-height: 0;
  resize: none;
  padding: 18px;
  border: none;
  border-radius: 16px;
  background: var(--surface);
  color: var(--text);
  outline: none;
  line-height: 1.75;
  font-size: 14px;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.wechatTextarea:focus {
  background: var(--surface-hover);
  box-shadow: var(--ring);
}

.wechatStage {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 20px;
  border-radius: 24px;
  background: var(--wechat-page-gradient);
  border: 1px solid var(--border);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    var(--shadow-lg);
}

.wechatArticle {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 34px 30px;
  border-radius: 24px;
  background: var(--wechat-article-bg);
  color: var(--wechat-text-color);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.1);
  font-family: var(--wechat-font-family);
  box-sizing: border-box;
}

.wechatArticle__placeholder {
  padding: 48px 24px;
  border-radius: 18px;
  text-align: center;
  background: rgba(248, 250, 255, 0.78);
  color: var(--wechat-muted-color);
  line-height: 1.8;
}

.wechatArticle__content {
  font-size: var(--wechat-font-size);
  line-height: var(--wechat-line-height);
  color: var(--wechat-text-color);
  word-break: break-word;
}

.wechatArticle__content :deep(h1),
.wechatArticle__content :deep(h2),
.wechatArticle__content :deep(h3) {
  margin: calc(var(--wechat-paragraph-gap) * 1.2) 0 14px;
  color: var(--wechat-title-color);
  line-height: 1.4;
  text-align: var(--wechat-title-align);
}

.wechatArticle__content :deep(h1) {
  font-size: 1.75em;
}

.wechatArticle__content :deep(h2) {
  font-size: 1.4em;
  padding-left: 12px;
  border-left: 4px solid var(--wechat-accent-color);
}

.wechatArticle__content :deep(h3) {
  font-size: 1.15em;
}

.wechatArticle__content :deep(p),
.wechatArticle__content :deep(ul),
.wechatArticle__content :deep(ol),
.wechatArticle__content :deep(pre),
.wechatArticle__content :deep(blockquote),
.wechatArticle__content :deep(table) {
  margin-top: 0;
  margin-bottom: var(--wechat-paragraph-gap);
}

.wechatArticle__content :deep(a) {
  color: var(--wechat-accent-color);
  text-decoration: underline;
}

.wechatArticle__content :deep(strong) {
  color: var(--wechat-title-color);
}

.wechatArticle__content :deep(ul),
.wechatArticle__content :deep(ol) {
  padding-left: 1.4em;
}

.wechatArticle__content :deep(li) {
  margin: 8px 0;
}

.wechatArticle__content :deep(blockquote) {
  padding: 16px 18px;
  border-left: 4px solid var(--wechat-blockquote-border);
  border-radius: 16px;
  background: var(--wechat-blockquote-bg);
  color: var(--wechat-text-color);
}

.wechatArticle__content :deep(code) {
  padding: 0.18em 0.4em;
  border-radius: 6px;
  background: color-mix(in srgb, var(--wechat-accent-color) 12%, transparent);
  font-size: 0.92em;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}

.wechatArticle__content :deep(pre) {
  padding: 18px;
  border-radius: 18px;
  overflow: auto;
  background: var(--wechat-code-bg);
}

.wechatArticle__content :deep(pre code) {
  padding: 0;
  background: transparent;
  color: #e5e7eb;
}

.themeGrid {
  display: grid;
  gap: 10px;
}

.themeCard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.themeCard:hover {
  transform: translateY(-1px);
  border-color: var(--border-hover);
}

.themeCard--active {
  border-color: var(--accent);
  box-shadow:
    0 0 0 4px rgba(22, 93, 255, 0.1),
    0 12px 24px rgba(22, 93, 255, 0.08);
}

.themeCard__name {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
}

.themeCard__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.wechatRange {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
}

.wechatRange span,
.wechatRange strong {
  font-size: 13px;
}

.wechatRange span {
  color: var(--muted);
  font-weight: 600;
}

.wechatRange strong {
  color: var(--primary);
  min-width: 56px;
  text-align: right;
}

@media (max-width: 1220px) {
  .wechatStage {
    padding: 14px;
    border-radius: 18px;
  }

  .wechatArticle {
    padding: 24px 20px;
    border-radius: 20px;
  }
}

@media (max-width: 760px) {
  .wechatStage {
    padding: 10px;
  }

  .wechatArticle {
    padding: 20px 14px;
    border-radius: 16px;
  }
}
</style>
