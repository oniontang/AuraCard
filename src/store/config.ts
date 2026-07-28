import type { TemplateConfig, AspectPreset, AiProviderOption } from "./types";

export const templates: TemplateConfig[] = [
  { id: "A", name: "极简", defaultBackground: "#ffffff", defaultText: "#111827", defaultAccent: "#2563eb", defaultRadius: 16, defaultPadding: 36, alignment: "left", border: true, shadow: false, backgroundMode: "solid" },
  { id: "B", name: "渐变", defaultBackground: "#fff1f2", defaultText: "#111827", defaultAccent: "#8b5cf6", defaultRadius: 20, defaultPadding: 40, alignment: "center", border: false, shadow: true, backgroundMode: "gradient" },
  { id: "C", name: "深色", defaultBackground: "#0b1220", defaultText: "#e5e7eb", defaultAccent: "#22c55e", defaultRadius: 18, defaultPadding: 38, alignment: "left", border: false, shadow: true, backgroundMode: "darkGrid" },
  { id: "D", name: "奶油", defaultBackground: "#fff7ed", defaultText: "#4a2c2a", defaultAccent: "#f97316", defaultRadius: 22, defaultPadding: 40, alignment: "left", border: true, shadow: false, backgroundMode: "solid" },
  { id: "E", name: "票根", defaultBackground: "#e11d48", defaultText: "#0f172a", defaultAccent: "#94a3b8", defaultRadius: 20, defaultPadding: 56, alignment: "left", border: false, shadow: false, backgroundMode: "ticketNote" },
  { id: "G", name: "备忘录", defaultBackground: "#fffef2", defaultText: "#3f3f46", defaultAccent: "#ef4444", defaultRadius: 16, defaultPadding: 40, alignment: "left", border: true, shadow: false, backgroundMode: "notepad" },
  { id: "I", name: "便签蓝", defaultBackground: "#acebff", defaultText: "#1f2937", defaultAccent: "#3b82f6", defaultRadius: 26, defaultPadding: 54, alignment: "center", border: false, shadow: false, backgroundMode: "stickyBlue" },
  { id: "J", name: "祝福纸", defaultBackground: "#f8f1c8", defaultText: "#4b1d1f", defaultAccent: "#fb923c", defaultRadius: 20, defaultPadding: 44, alignment: "center", border: true, shadow: false, backgroundMode: "wishPaper" },
  { id: "K", name: "紫雾", defaultBackground: "#fefefe", defaultText: "#4c4a7d", defaultAccent: "#c4b5fd", defaultRadius: 22, defaultPadding: 48, alignment: "center", border: true, shadow: false, backgroundMode: "mistLilac" },
  { id: "L", name: "叠卡蓝", defaultBackground: "#0ea5ff", defaultText: "#0f172a", defaultAccent: "#1d9cff", defaultRadius: 24, defaultPadding: 58, alignment: "center", border: false, shadow: false, backgroundMode: "stackBlue" },
  { id: "M", name: "霓虹夜卡", defaultBackground: "#05060a", defaultText: "#f8fafc", defaultAccent: "#23f0d0", defaultRadius: 24, defaultPadding: 56, alignment: "left", border: false, shadow: true, backgroundMode: "neonDark" },
  { id: "N", name: "彩色挂卡", defaultBackground: "#b88bff", defaultText: "#111827", defaultAccent: "#b88bff", defaultRadius: 24, defaultPadding: 54, alignment: "center", border: false, shadow: false, backgroundMode: "lilacHang" },
  { id: "O", name: "彩色心情", defaultBackground: "#8fd8a0", defaultText: "#1f2937", defaultAccent: "#38bdf8", defaultRadius: 24, defaultPadding: 58, alignment: "center", border: false, shadow: false, backgroundMode: "mintMood" },
  { id: "Q", name: "暖粉漂流", defaultBackground: "#ff8eb6", defaultText: "#fff8fb", defaultAccent: "#f9a8d4", defaultRadius: 20, defaultPadding: 52, alignment: "left", border: false, shadow: false, backgroundMode: "warmPink" },
  { id: "R", name: "磨砂质感", defaultBackground: "#48b2ff", defaultText: "#1f2937", defaultAccent: "#ffffff", defaultRadius: 28, defaultPadding: 48, alignment: "left", border: false, shadow: false, backgroundMode: "glassmorphism" },
];

export const aspectPresets: AspectPreset[] = [
  { id: "3:4", label: "3:4", w: 3, h: 4 },
  { id: "1:1", label: "1:1", w: 1, h: 1 },
  { id: "5:7", label: "5:7", w: 5, h: 7 },
  { id: "9:16", label: "9:16", w: 9, h: 16 },
];

export const colorSwatches = [
  "#FF2D55", "#FFFFFF", "#1F2937", "#EF4444", "#0B0B0F", "#2563EB", "#F97316", "#F59E0B",
  "#FEE2E2", "#FFF7ED", "#FEF9C3", "#DCFCE7", "#CCFBF1", "#DBEAFE", "#EDE9FE", "#FCE7F3",
];

export const aiProviderOptions: AiProviderOption[] = [
  {
    id: "openrouter",
    name: "OpenRouter（推荐，支持多模型）",
    description: "一个 Key 可切换多家模型，适合同时体验 GPT、DeepSeek、Qwen。",
    baseUrl: "https://openrouter.ai/api",
    apiKeyPlaceholder: "sk-or-v1-...",
    models: [
      { value: "openai/gpt-4o-mini", label: "gpt-4o-mini（OpenAI）", kind: "text" },
      { value: "deepseek/deepseek-chat-v3-0324", label: "deepseek-chat-v3（DeepSeek）", kind: "text" },
      { value: "qwen/qwen-2.5-72b-instruct", label: "qwen-2.5-72b（Qwen）", kind: "text" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI（GPT 官方）",
    description: "适合直接使用 GPT 系列模型。",
    baseUrl: "https://api.openai.com",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "gpt-4o-mini", label: "gpt-4o-mini", kind: "text" },
      { value: "gpt-4o", label: "gpt-4o", kind: "text" },
      { value: "gpt-4.1-mini", label: "gpt-4.1-mini", kind: "text" },
      { value: "gpt-4.1", label: "gpt-4.1", kind: "text" },
      { value: "gpt-image2", label: "图片生成 · gpt-image2", kind: "image" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek（官方）",
    description: "支持 DeepSeek 聊天与推理模型。",
    baseUrl: "https://api.deepseek.com",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "deepseek-chat", label: "deepseek-chat", kind: "text" },
      { value: "deepseek-reasoner", label: "deepseek-reasoner", kind: "text" },
    ],
  },
  {
    id: "qwen",
    name: "通义千问（Qwen / DashScope）",
    description: "使用阿里云 DashScope 兼容模式接入 Qwen，支持文本、视觉理解与图片生成模型。",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "qwen3-max", label: "文本生成 · qwen3-max", kind: "text" },
      { value: "qwen3.5-flash", label: "文本生成 · qwen3.5-flash", kind: "text" },
      { value: "qwen3-vl-plus", label: "视觉理解 · qwen3-vl-plus", kind: "vision" },
      { value: "qwen3-vl-flash", label: "视觉理解 · qwen3-vl-flash", kind: "vision" },
      { value: "wan2.7-image-pro", label: "图片生成 · wan2.7-image-pro", kind: "image" },
      { value: "qwen-image-2.0", label: "图片生成 · qwen-image-2.0", kind: "image" },
      { value: "z-image-turbo", label: "图片生成 · z-image-turbo", kind: "image" },
      { value: "qwen-turbo", label: "文本生成 · qwen-turbo", kind: "text" },
      { value: "qwen-plus", label: "文本生成 · qwen-plus", kind: "text" },
      { value: "qwen-max", label: "文本生成 · qwen-max", kind: "text" },
    ],
  },
  {
    id: "custom",
    name: "自定义 API 端点",
    description: "适用于兼容 OpenAI Chat Completions 协议的服务。",
    baseUrl: "",
    apiKeyPlaceholder: "输入你的 API Key",
    models: [],
  },
];
