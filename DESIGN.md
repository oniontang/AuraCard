# DESIGN.md

> 像光一样，让文字自然流淌成视觉——专业、克制、有温度的内容视觉化工作台。

## 1. Visual Theme & Atmosphere

**Style**: 蓝白商务风 (Blue-White Business) — 冷静专业 + 克制精致
**Keywords**: 专业、克制、安静、高效、蓝白、呼吸感、专注
**Tone**: 让工具安静，让内容发光 — NOT 冷冰冰的工具面板、NOT 花哨的玻璃炫光
**Feel**: 蓝白色的专业界面上，内容安静地呼吸，蓝色的强调色像光一样指引方向

**Interaction Tier**: L2 流畅交互
**Dependencies**: CSS only (IntersectionObserver + CSS transitions/animations, no GSAP)

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds — 暖色纸感层次 */
  --bg: #FAF8F5;                              /* 页面基底：暖奶油 */
  --bg-warm: #F5F1EB;                         /* 暖色交替 section */
  --surface: #FFFFFF;                         /* 卡片/面板 */
  --surface-alt: #FDFCFA;                     /* 次级表面：微暖白 */
  --surface-hover: #FEFAF5;                   /* 悬停态：极暖白 */

  /* Borders */
  --border: #E8E0D8;                          /* 暖灰边框 */
  --border-hover: #C4A882;                    /* 悬停边框：暖金 */
  --border-strong: #D5C8B5;                   /* 强调边框 */

  /* Text — 深棕灰体系 */
  --text: #2C2416;                            /* 主文字：深棕 */
  --text-secondary: #6B5F52;                  /* 正文：暖灰棕 */
  --text-tertiary: #9B8E7E;                   /* 辅助：浅暖灰 */

  /* Accent — 琥珀/陶土 */
  --accent: #C45C3C;                          /* 主强调：陶土橙 */
  --accent-hover: #A84A2E;                    /* hover：深陶土 */
  --accent-soft: #F5E6DC;                     /* 强调色浅底 */

  /* RGB variants for rgba() */
  --bg-rgb: 250, 248, 245;
  --accent-rgb: 196, 92, 60;
  --text-rgb: 44, 36, 22;

  /* Semantic */
  --success: #5B8A5A;                         /* 苔绿 */
  --success-soft: #EDF5EC;
  --error: #C44C3C;                           /* 暖红 */
  --error-soft: #FDF0ED;
  --warning: #D4A84B;                         /* 暖金 */
  --warning-soft: #FDF8ED;

  /* Shadows — 柔和暖色投影 */
  --shadow-sm: 0 1px 3px rgba(44, 36, 22, 0.04);
  --shadow-md: 0 4px 16px rgba(44, 36, 22, 0.06);
  --shadow-lg: 0 12px 40px rgba(44, 36, 22, 0.08);

  /* Radii — 微圆角，保留纸感 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Focus ring */
  --ring: 0 0 0 3px rgba(196, 92, 60, 0.2);
}
```

**Color Rules:**
- 所有颜色通过 CSS 变量引用，禁止硬编码 hex（组件内零硬编码）
- 同一 section 内只用一个强调色，靠深浅区分层级
- 背景最多三层：基底 → surface → surface-alt，不引入第四个背景色
- 文字对比度：text ≥ 4.5:1 on bg, text-secondary ≥ 3:1 on bg

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Noto Serif SC | clamp(38px, 5.5vw, 60px) | 900 | 1.15 | -0.02em |
| Section H2 | Noto Serif SC | clamp(26px, 3.5vw, 38px) | 700 | 1.25 | -0.01em |
| H3 / Card Title | Noto Serif SC | 20px | 700 | 1.3 | — |
| Body | Inter | 16px | 400 | 1.75 | — |
| Body Small | Inter | 14px | 400 | 1.7 | — |
| Label / Eyebrow | Inter | 12px | 600 | 1.4 | 0.08em |
| Caption | Inter | 11px | 500 | 1.4 | — |
| Mono / Code | JetBrains Mono | 13px | 400 | 1.6 | — |

**Font Stack CSS:**
```css
--font-serif: 'Noto Serif SC', 'Times New Roman', serif;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
```

**Typography Rules:**
- Heading 全部用衬线 (Noto Serif SC)，正文用无衬线 (Inter)
- 中文正文 line-height ≥ 1.7, letter-spacing: 0.02em
- 正文最小字号 15px（桌面端），移动端可降至 14px
- **NEVER use**: Arial, Helvetica, Times New Roman (被回退字体覆盖), 任何手写体/花体
- 中英混排时中文字族在前，英文 fallback 在后

**Text Decoration:**
- Hero H1: 无渐变、无投影（克制风格，靠字重和间距建立层级）
- Section H2: 无装饰，纯深棕文字
- **禁止**: 任何文字渐变 (gradient text)、文字投影 (text-shadow)、装饰性下划线

## 4. Component Stylings

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  line-height: 1.4;
}

/* Primary — 陶土色实心 */
.btn--primary {
  background: var(--accent);
  color: #FFFFFF;
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}
.btn--primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(196, 92, 60, 0.25);
}
.btn--primary:active {
  transform: translateY(0) scale(0.98);
}
.btn--primary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.btn--primary:disabled {
  background: var(--border);
  border-color: var(--border);
  color: var(--text-tertiary);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Ghost — 透明底 + 暖灰边框 */
.btn--ghost {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}
.btn--ghost:hover {
  background: var(--surface-alt);
  border-color: var(--border-hover);
}
.btn--ghost.is-active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}

/* Outline — 用于 Hero 区次要 CTA */
.btn--outline {
  background: var(--surface);
  border-color: var(--border-strong);
  color: var(--text);
  box-shadow: var(--shadow-sm);
}
.btn--outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Danger */
.btn--danger {
  background: var(--error-soft);
  border-color: rgba(196, 76, 60, 0.2);
  color: var(--error);
}
.btn--danger:hover {
  background: #fce8e4;
  border-color: rgba(196, 76, 60, 0.4);
}

/* Size variants */
.btn--sm { padding: 6px 12px; font-size: 12px; border-radius: var(--radius-sm); }
.btn--lg { padding: 14px 28px; font-size: 16px; border-radius: var(--radius-lg); }
```

### Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}

/* 功能卡片 (Landing Page 专用) */
.card--feature {
  background: linear-gradient(135deg, #FEFCFA 0%, #FDF8F2 100%);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}
.card--feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent);
}

/* 内容面板 (编辑器内) */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

### Navigation

```css
/* 全局 Header */
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  padding: 14px 28px;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.global-header.scrolled {
  background: rgba(250, 248, 245, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 4px rgba(44, 36, 22, 0.04);
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  transition: opacity 0.2s ease;
}
.brand:hover { opacity: 0.8; }
.brand__logo {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}
.brand__title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}
.brand__sub {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-sans);
}
```

### Links

```css
a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}
a:hover { color: var(--accent-hover); }

/* 正文内链 */
.link--inline {
  position: relative;
  color: var(--accent);
}
.link--inline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}
.link--inline:hover::after { width: 100%; }
```

### Tags / Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.badge--accent {
  background: var(--accent-soft);
  color: var(--accent);
}
.badge--success {
  background: var(--success-soft);
  color: var(--success);
}
.badge--neutral {
  background: #F3F0EB;
  color: var(--text-secondary);
}
```

### Form Inputs

```css
.input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input::placeholder { color: var(--text-tertiary); }
.input:hover { border-color: var(--border-strong); }
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(196, 92, 60, 0.12);
}

.textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
  background: var(--surface);
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(196, 92, 60, 0.12);
}

.select {
  appearance: none;
  padding-right: 36px;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239B8E7E' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
}

/* Switch / Toggle */
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
}
.toggle.is-on { background: var(--accent); }
.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle.is-on::after { transform: translateX(20px); }
```

### Segmented Control

```css
.segmented {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-md);
  background: #F3F0EB;
  border: 1px solid var(--border);
}
.segmented__btn {
  padding: 7px 14px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.segmented__btn:hover { color: var(--text); }
.segmented__btn--active {
  background: var(--surface);
  color: var(--accent);
  box-shadow: var(--shadow-sm);
}
```

### Color Picker Row

```css
.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.color-row:hover { border-color: var(--border-hover); }
.color-row__preview {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}
.color-row__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  flex: 1;
}
.color-row__value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-tertiary);
}
```

### Chat Bubble

```css
.bubble {
  max-width: 88%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.65;
}
.bubble--user {
  align-self: flex-end;
  background: var(--accent);
  color: #FFFFFF;
  border-bottom-right-radius: 4px;
}
.bubble--ai {
  align-self: flex-start;
  background: #F5F1EB;
  color: var(--text);
  border-bottom-left-radius: 4px;
  border: 1px solid var(--border);
}
```

### Scrollbar

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
```

## 5. Layout Principles

**Container:**
- Max width: min(1280px, calc(100vw - 48px))
- Narrow variant (text-heavy): min(720px, calc(100vw - 48px))

**Spacing Scale:**
- Section padding: 80px 0 (desktop) / 48px 0 (mobile)
- Component gap: 16px (desktop) / 12px (mobile)
- Card internal padding: 24px (desktop) / 18px (mobile)

**Editor Layout (Card/Cover pages):**
```css
.main {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 300px;
  gap: 16px;
  padding: 16px 0;
  width: min(1440px, calc(100vw - 48px));
  margin: 0 auto;
  height: calc(100vh - 69px);
}
/* 两侧面板收起时列宽过渡 */
.main--settings-collapsed { grid-template-columns: 52px minmax(0, 1fr) 300px; }
.main--ai-collapsed { grid-template-columns: 280px minmax(0, 1fr) 52px; }
```

**Content area:**
```css
.content-area {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.75;
}
```

**Gutters (inline padding for mobile safety):**
- Desktop: 48px
- Tablet: 32px
- Mobile: 20px

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | 无阴影，仅背景色差区分 | 页面基底、大 section |
| Subtle | `box-shadow: 0 1px 3px rgba(44,36,22,0.04)` | 卡片默认态、面板 |
| Elevated | `box-shadow: 0 4px 16px rgba(44,36,22,0.06)` | 卡片 hover、弹出层 |
| Modal | `box-shadow: 0 20px 60px rgba(44,36,22,0.12)` | 对话框、下拉菜单 |

**规则**: 最多 3 层深度在一个 viewport 内同时出现。禁止使用 `box-shadow` 做大面积发光装饰（那是旧玻璃拟态的遗留）。

## 7. Animation & Interaction

**Motion Philosophy**: 安静、流畅、有节奏。只在 scroll reveal 和 hover 时动，不持续动画。所有动效基于 `opacity` 和 `transform`，不触发 repaint/layout。

**Tier**: L2 — 流畅交互

### Dependencies

无外部依赖。CSS only + 原生 IntersectionObserver + requestAnimationFrame。

### Entrance: fadeIn + 轻上浮

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

### Scroll Reveal (原生 JS)

```js
function initScrollReveal(selector = '.reveal') {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}
```

### Stagger Children

```css
.stagger-reveal.in-view > *:nth-child(1) { transition-delay: 0s; }
.stagger-reveal.in-view > *:nth-child(2) { transition-delay: 0.08s; }
.stagger-reveal.in-view > *:nth-child(3) { transition-delay: 0.16s; }
.stagger-reveal.in-view > *:nth-child(4) { transition-delay: 0.24s; }
.stagger-reveal.in-view > *:nth-child(5) { transition-delay: 0.32s; }
.stagger-reveal.in-view > *:nth-child(6) { transition-delay: 0.40s; }
```

### Navigation Scroll State

```js
const header = document.querySelector('.global-header');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  });
}, { passive: true });
```

### Scroll Progress Bar

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  z-index: 100;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.1s linear;
}
```

### 视差背景 (首页 Hero)

```css
.parallax-bg {
  will-change: transform;
  transition: transform 0.1s linear;
}
```

```js
function initParallax(selector, speed = 0.15) {
  const el = document.querySelector(selector);
  if (!el) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = window.scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
      ticking = false;
    });
  }, { passive: true });
}
```

### Hover & Focus States

所有可交互元素必须有 hover + focus-visible 态：
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* 卡片 hover 浮起 */
.card-interactive {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}

/* 按钮按压 */
.btn:active { transform: translateY(0) scale(0.97); }

/* 图标按钮 hover 变色 */
.icon-btn {
  color: var(--text-tertiary);
  transition: color 0.2s ease, background 0.2s ease;
}
.icon-btn:hover {
  color: var(--accent);
  background: var(--accent-soft);
}
```

### Loading State

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #F3F0EB 25%, #E8E0D8 50%, #F3F0EB 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1; transform: none; }
  .parallax-bg { transform: none !important; }
}
```

## 8. Do's and Don'ts

### Do
- 用暖白底色 + 深棕文字建立舒适的阅读对比度
- 衬线标题建立编辑感，无衬线正文保证可读性
- 用陶土橙色作为唯一强调色，控制使用频率 (≤ 3 处/page)
- 留白优先于分割线；能用间距区分的就不要画线
- 卡片阴影用暖棕色系 (暖灰)，不用冷灰色
- 所有间距按 4px 网格对齐
- 交互元素必须有 hover + focus-visible 两态
- 移动端触摸目标 ≥ 44×44px

### Don't
- ❌ 禁止使用 `backdrop-filter: blur()` — 毛玻璃效果与本风格的纸质感冲突
- ❌ 禁止使用 `filter: blur()` 做装饰背景 — 用暖色渐变替代
- ❌ 禁止大面积渐变背景 (如 `linear-gradient` 全页) — 纯色暖白基底 + 局部渐变点缀
- ❌ 禁止冷色调 (#667eea, #764ba2, 蓝紫色系) — 全部替换为暖色系
- ❌ 禁止超过 2 种字体族同时出现在一个 viewport — serif heading + sans body = 2
- ❌ 禁止文字渐变 (gradient text) 和文字投影 (text-shadow)
- ❌ 禁止 `box-shadow` 使用冷灰色 (rgba(0,0,0,...)) 和蓝色调 (rgba(79,70,229,...))
- ❌ 禁止圆角 > 24px (保持纸本编辑的克制)
- ❌ 禁止 emoji 作为图标 — 使用 lucide-react 或内联 SVG
- ❌ 禁止纯色块作为图片占位 — 用 skeleton shimmer 或 Unsplash 占位图

## 9. Responsive Behavior

**Breakpoints:**

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1080px | 三栏编辑器、Hero 双栏 |
| Tablet | 760px ~ 1080px | 编辑器改为单栏、Hero 双栏保持 |
| Mobile | < 760px | 全部单栏、面板全宽、字号缩小 |

**Touch Targets:** minimum 44×44px
**Collapsing Strategy:** 移动端编辑器两侧面板默认收起，通过顶部 toggle 按钮打开

```css
@media (max-width: 1080px) {
  .main {
    grid-template-columns: 1fr;
    gap: 12px;
    height: auto;
    min-height: 100vh;
  }
  .hero-panel {
    grid-template-columns: 1fr;
  }
  .tool-grid,
  .flow-grid,
  .highlight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  :root {
    --radius-lg: 12px;
    --radius-xl: 16px;
  }

  .global-header {
    padding: 10px 16px;
  }

  .main {
    width: calc(100vw - 20px);
    gap: 10px;
    padding: 10px 0;
  }

  .brand__sub { display: none; }

  .hero-panel,
  .section-block {
    padding: 20px 16px;
    border-radius: var(--radius-lg);
  }

  .hero-title { font-size: clamp(28px, 8vw, 40px); }
  .hero-desc { font-size: 15px; }

  .hero-actions { flex-direction: column; }
  .hero-btn { width: 100%; }

  /* 触摸友好 */
  button, .btn, [role="button"] {
    min-height: 44px;
  }
}
```
