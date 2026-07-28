# 光语 (AuraCard)

**光语**是一款 AI 驱动的内容视觉化平台，覆盖图文卡片、封面设计、AI 图文系列和文章排版四大工作流。

## 核心能力

- **图文卡片**：将文字、笔记或聊天内容整理成高质感卡片，支持模板切换与高清导出
- **封面设计**：围绕标题与主题快速产出封面，支持模板风格、AI 背景创作与高清下载
- **AI 图文系列**：输入长文或灵感，AI 自动拆解为系列图文，同步生成视觉背景
- **文章排版**：将 Markdown 或文本快速适配为长文样式，支持主题、配色与版式切换
- **AI 聊天辅助**：支持兼容 OpenAI Chat Completions 的接口，多模型切换
  - 弹窗初始仅展示输入框
  - 点击开始生成后，在输入框上方展示 loading 与生成结果
  - 成功后自动应用到封面模板
- **统一请求封装**：
  - 统一 `request` 调用入口
  - 统一错误处理、超时控制、查询参数与 JSON 序列化
  - 预留 Token 存取能力（用于后续注册/登录）

## 项目结构

```text
src/
├── components/              # 业务组件
├── views/                   # 页面视图（Home/Card/Cover）
├── store/                   # 状态与业务逻辑拆分
│   ├── ai.ts                # AI 聊天与生图逻辑
│   ├── state.ts             # 核心响应式状态
│   └── ...
├── request.ts               # 公共请求封装（含 Token 管理）
├── router.ts                # 路由配置
├── App.vue
└── App_style.css
```

## 环境要求

- Node.js 18+
- npm 9+

## 本地开发

### 1) 启动后端服务（推荐先启动）

在 `card-server` 目录完成 `.env` 配置并启动：

```bash
cd ../card-server
npm install
npm run start:dev
```

后端默认地址：`http://127.0.0.1:3001`

### 2) 启动前端

```bash
npm install
npm run dev
```

### 3) 校验

```bash
npm run typecheck
npm run build
```

## 前端 API 约定

- 开发环境通过 Vite 代理将 `/api` 转发到 `http://127.0.0.1:3001`
- 默认 base URL 为 `/api`
- 可通过环境变量覆盖：

```bash
VITE_API_BASE_URL=/api
```

## 请求封装说明

公共请求文件：`src/request.ts`

- 提供 `request<T>()` 统一调用入口
- 支持：
  - `params` 查询参数
  - `data` JSON/body 发送
  - `timeoutMs` 超时控制
  - `requiresAuth` 自动携带 Token
  - `token` 手动覆盖 Token
- 内置 Token 工具：
  - `getAccessToken()`
  - `setAccessToken(token)`
  - `clearAccessToken()`

默认本地存储 key：`auth.accessToken`

## 主要脚本

- `npm run dev`：启动前端开发服务
- `npm run typecheck`：TypeScript 类型检查
- `npm run build`：构建打包
- `npm run preview`：本地预览构建产物
