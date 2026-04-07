import {
  aiProvider,
  chatMessages,
  chatInput,
  isChatLoading,
  chatError,
  aiBaseUrl,
  aiApiKey,
  aiModel,
  customAiBaseUrl,
  isTestingAiConnection,
  aiTestMessage,
  aiTestStatus,
  selectedAiProvider,
  selectedAiModel,
  title,
  subtitle,
  content,
  watermark,
} from "./state";
import { request } from "../request";
import { normalizeBaseUrl, chatEndpoint, newId } from "./utils";
import type { ChatMessage, AiProviderId } from "./types";
import { aiProviderOptions } from "./config";

const QWEN_IMAGE_MODELS = new Set([
  "wan2.7-image-pro",
  "qwen-image-2.0",
  "z-image-turbo",
]);

const IMAGE_TERMINAL_FAILURE_STATUS = new Set([
  "FAILED",
  "CANCELED",
  "CANCELLED",
]);

type CreateImageTaskResponse = {
  taskId?: string | null;
  message?: string | null;
};

type ImageTaskResponse = {
  status?: string | null;
  message?: string | null;
  imageUrl?: string | null;
};

function isImageGenerationModel() {
  return selectedAiModel.value?.kind === "image";
}

async function createImageTask(prompt: string) {
  if (aiProvider.value !== "qwen") {
    throw new Error("当前仅支持通过通义千问（DashScope）图片模型生成封面。");
  }
  if (!QWEN_IMAGE_MODELS.has(aiModel.value.trim())) {
    throw new Error("当前选择的不是可用的图片生成模型。");
  }

  const data = await request<CreateImageTaskResponse>("/ai/images/generate", {
    method: "POST",
    data: {
      prompt,
      model: aiModel.value.trim(),
      size: "768*1024",
    },
    timeoutMs: 30000,
  });

  if (!data.taskId) {
    throw new Error(data.message || "图片任务创建失败，请稍后重试。");
  }

  return data.taskId;
}

async function pollImageResult(taskId: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const data = await request<ImageTaskResponse>(
      `/ai/images/tasks/${encodeURIComponent(taskId)}`,
      {
        timeoutMs: 30000,
      },
    );
    const status = (data.status || "").toUpperCase();

    if (status === "SUCCEEDED") {
      const imageUrl = data.imageUrl;
      if (!imageUrl) throw new Error("图片生成成功，但未返回图片地址。");
      return imageUrl;
    }

    if (IMAGE_TERMINAL_FAILURE_STATUS.has(status)) {
      throw new Error(data.message || "图片生成失败，请稍后重试。");
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }

  throw new Error("图片生成超时，请稍后重试。");
}

export async function generateAiImageUrl(prompt: string) {
  const taskId = await createImageTask(prompt);
  return pollImageResult(taskId);
}

export async function testAiImageConnection() {
  await createImageTask(
    "极简高级感封面背景，无文字，柔和渐变，留白充足",
  );
}
export function syncAiProviderSettings(
  providerId: AiProviderId,
  keepCurrentModel = false,
) {
  const provider = aiProviderOptions.find((item) => item.id === providerId);
  if (!provider) return;

  if (providerId === "custom") {
    aiBaseUrl.value = normalizeBaseUrl(customAiBaseUrl.value);
    if (!keepCurrentModel && !aiModel.value.trim())
      aiModel.value = "gpt-4o-mini";
    return;
  }

  aiBaseUrl.value = provider.baseUrl;
  if (
    !keepCurrentModel ||
    !provider.models.some(
      (model) => model.value === aiModel.value && model.kind !== "image",
    )
  ) {
    aiModel.value =
      provider.models.find((model) => model.kind !== "image")?.value || "";
  }
}

export function setChatError(message: string) {
  chatError.value = message;
  window.setTimeout(() => {
    if (chatError.value === message) chatError.value = null;
  }, 3500);
}

export function setAiTestFeedback(
  status: "success" | "error",
  message: string,
) {
  aiTestStatus.value = status;
  aiTestMessage.value = message;
}

function ensureChatCompatibleModel() {
  if (!isImageGenerationModel()) return;
  throw new Error(
    "当前项目的对话和连接测试基于 Chat Completions，暂不支持图片生成模型。请改用 qwen3-max、qwen3.5-flash、qwen3-vl-plus 或 qwen3-vl-flash。",
  );
}

export async function callAiChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
) {
  const base = normalizeBaseUrl(aiBaseUrl.value);
  const key = aiApiKey.value.trim();
  const model = aiModel.value.trim();
  const endpoint = chatEndpoint(base);
  if (!endpoint) throw new Error("请先填写 API Base URL。");
  if (!key) throw new Error("请先填写 API Key。");
  if (!model) throw new Error("请先填写 Model。");
  ensureChatCompatibleModel();

  const data = await request<any>(endpoint, {
    method: "POST",
    token: key,
    data: {
      model,
      messages,
      temperature: 0.6,
    },
    timeoutMs: 60000,
  });

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim())
    throw new Error("AI 返回为空。");
  return content.trim();
}

export async function sendChat() {
  const text = chatInput.value.trim();
  if (!text || isChatLoading.value) return;
  chatError.value = null;
  chatInput.value = "";

  chatMessages.value.push({
    id: newId(),
    role: "user",
    content: text,
    createdAt: Date.now(),
  });
  isChatLoading.value = true;
  try {
    const assistantText = await callAiChat(
      chatMessages.value.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    );
    chatMessages.value.push({
      id: newId(),
      role: "assistant",
      content: assistantText,
      createdAt: Date.now(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "请求失败";
    setChatError(msg);
  } finally {
    isChatLoading.value = false;
  }
}

export async function testAiConnection() {
  if (isTestingAiConnection.value) return;

  aiTestMessage.value = "";
  aiTestStatus.value = "";

  if (!aiModel.value.trim()) {
    setAiTestFeedback("error", "请先选择 AI 模型");
    return;
  }
  if (!isImageGenerationModel() && !aiApiKey.value.trim()) {
    setAiTestFeedback("error", "请先填写 API Key");
    return;
  }
  if (!isImageGenerationModel() && !aiBaseUrl.value.trim()) {
    setAiTestFeedback("error", "请先填写 API 地址");
    return;
  }

  isTestingAiConnection.value = true;
  try {
    if (isImageGenerationModel()) {
      await testAiImageConnection();
      setAiTestFeedback(
        "success",
        `${selectedAiProvider.value.name} 图片模型连接成功`,
      );
    } else {
      await callAiChat([{ role: "user", content: "请仅回复：连接成功" }]);
      setAiTestFeedback("success", `${selectedAiProvider.value.name} 连接成功`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "连接失败";
    setAiTestFeedback("error", msg);
  } finally {
    isTestingAiConnection.value = false;
  }
}

export function localSummarizeToCard(raw: string) {
  const text = raw.trim().replace(/\n{3,}/g, "\n\n");
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const t = (lines[0] || "一张卡片").slice(0, 24);
  const sub = (lines[1] || "AI 总结").slice(0, 28);
  const bodyLines = lines.slice(2);
  const body = bodyLines.length ? bodyLines.join("\n") : text;
  title.value = t;
  subtitle.value = sub;
  content.value = body;
  watermark.value = "— AI";
}

export function parseCardFromText(text: string) {
  const t = text.match(/标题[:：]\s*(.+)/)?.[1]?.trim();
  const sub = text.match(/副标题[:：]\s*(.+)/)?.[1]?.trim();
  const body = text
    .match(/正文[:：]\s*([\s\S]+?)(?=\n水印[:：]|$)/)?.[1]
    ?.trim();
  const wm = text.match(/水印[:：]\s*(.+)/)?.[1]?.trim();
  return { t, sub, body, wm };
}

export async function aiSummarizeMessage(rawContent: string) {
  const source = rawContent.trim();
  if (!source) return;
  if (!aiApiKey.value.trim()) {
    localSummarizeToCard(source);
    return;
  }
  isChatLoading.value = true;
  chatError.value = null;
  try {
    const summary = await callAiChat([
      {
        role: "system",
        content:
          "你是卡片内容编辑助手。请将用户提供的文字整理成卡片内容格式。如果内容较长，请尽量保留原始正文细节，只需生成合适的标题、副标题和水印。输出格式必须为：\n标题：...\n副标题：...\n正文：...\n水印：...",
      },
      { role: "user", content: source },
    ]);
    const parsed = parseCardFromText(summary);
    title.value = (parsed.t || title.value).slice(0, 32);
    subtitle.value = (parsed.sub || subtitle.value).slice(0, 40);
    // 这里我们不再将长正文进行过度裁剪，保留完整文本交由前面的 splitContents 自动拆分逻辑去处理多卡片
    content.value = parsed.body || source;
    watermark.value = (parsed.wm || watermark.value).slice(0, 24);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "整理失败";
    setChatError(msg);
    localSummarizeToCard(source);
  } finally {
    isChatLoading.value = false;
  }
}

export async function aiSummarizeLastAssistant() {
  const last = [...chatMessages.value]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!last) return;
  await aiSummarizeMessage(last.content);
}

export function clearChat() {
  chatMessages.value = chatMessages.value.slice(0, 1);
  chatError.value = null;
  chatInput.value = "";
}
