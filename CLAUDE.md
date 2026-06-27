# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

光语 (AuraCard) — AI 图文卡片生成工具。前端 Vue 3 + TypeScript + Vite，后端 `card-server`（Node.js, 端口 3001）。

## 命令

```bash
npm install          # 安装依赖
npm run dev          # 启动前端开发服务（localhost:5173）
npm run typecheck    # vue-tsc 类型检查（--noEmit）
npm run build        # 类型检查 + vite build
npm run preview      # 预览构建产物
```

后端：`cd ../card-server && npm install && npm run start:dev`

Vite 代理：`/api` → `http://127.0.0.1:3001`，`/dashscope-proxy` → `https://dashscope.aliyuncs.com`。

## 架构

### 路由 — [src/router.ts](src/router.ts)

三个页面：`/` (HomePage)、`/card` (CardPage，核心编辑页)、`/cover` (CoverPage，封面 AI 生图)。

### 状态管理 — [src/store/](src/store/)

无 Pinia/Vuex，纯 Vue 3 `ref`/`computed`。

- **[state.ts](src/store/state.ts)** — 所有响应式状态（模板、宽高比、文字内容、颜色/圆角/内边距、AI 配置、聊天消息、导出状态等）。
- **[config.ts](src/store/config.ts)** — 静态配置：15 套卡片模板 `templates`（每套有 `backgroundMode` 决定视觉风格）、4 种宽高比、AI 服务商选项（openrouter/openai/deepseek/qwen/custom，含各自模型列表）。
- **[types.ts](src/store/types.ts)** — 类型定义：`TemplateId`、`AspectId`、`ChatMessage`、`AiProviderId`、`AiModelKind`（text/vision/image）等。
- **[styles.ts](src/store/styles.ts)** — **模板系统的核心**。根据 `selectedTemplate.backgroundMode` 分支生成所有 CSS computed 属性（`backgroundCss`、`cardDecorationStyle`、`cardFrameDecorStyle`、`cardOrnamentStyle`、`previewScale` 等）。每种 `backgroundMode`（solid/gradient/notepad/stickyBlue/wishPaper/mistLilac/stackBlue/darkGrid/neonDark/ticketNote/lilacHang/mintMood/warmPink/glassmorphism）对应一套独特的渐变、噪点、毛玻璃、装饰框等视觉效果。
- **[split.ts](src/store/split.ts)** — 智能内容分页。监听内容变化，用离屏 DOM + marked 渲染测量实际高度。超出单卡片高度时按语义边界拆分（标题、段落、句子、列表项、代码块）。支持 `---` 手动分页、H1/H2 隐式分页。
- **[ai.ts](src/store/ai.ts)** — AI 聊天、生图（创建任务 → 每 2s 轮询到成功/失败/超时）、连接测试、AI 内容总结（解析助手回复 → 填入标题/副标题/正文/水印）。
- **[background.ts](src/store/background.ts)** — 背景图片的拖放、选择器、Base64 读取。
- **[export.ts](src/store/export.ts)** — PNG 导出（html-to-image, 2x 像素比）。
- **[utils.ts](src/store/utils.ts)** — 工具函数：hexToRgb、relativeLuminance、safeFilename、normalizeBaseUrl、chatEndpoint（拼接 `/v1/chat/completions` 路径）等。
- **[index.ts](src/store/index.ts)** — `initStore()` 入口：模板切换 watch（同步样式默认值）、AI 配置 localStorage 持久化 watch、ResizeObserver 监听预览容器尺寸。

### 请求层 — [src/request.ts](src/request.ts)

统一的 `request<T>()` 封装 `fetch`：查询参数序列化、JSON body 自动处理、超时控制（默认 15s）、Token 鉴权（localStorage key: `auth.accessToken`）、自定义 `RequestError`（含 status/code/details/requestId）、三种解析模式（json/text/response）。

### 组件结构

CardPage 三栏布局：LeftPanel（编辑控件）→ CenterPanel（卡片实时预览，内嵌 CardPreview）→ RightPanel（AI 聊天 + 设置）。

### 根目录脚本

`.cjs`/`.js` 文件（extract.cjs、extract2.cjs、make_clean.cjs、refactor.cjs 等）是离线数据处理脚本，非运行时依赖。

### 关键依赖

- **marked** + **marked-highlight** + **highlight.js**：Markdown 渲染与代码高亮
- **html-to-image**：DOM 节点导出 PNG
- **md-editor-v3**：Markdown 编辑器
- **vue-router**：路由
