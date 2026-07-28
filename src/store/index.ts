import { watch, onBeforeUnmount, onMounted } from "vue";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import {
  aspectId,
  height,
  selectedTemplateId,
  title,
  subtitle,
  content,
  watermark,
  showWatermark,
  showSubtitle,
  background,
  textColor,
  textAlignment,
  accent,
  radius,
  padding,
  bgTab,
  activeGradientNode,
  gradientAngle,
  bgImageUrl,
  bgImageName,
  bgImageSizeText,
  bgOpacityPercent,
  errorMessage,
  previewFrameRef,
  previewSize,
  aiProvider,
  customAiBaseUrl,
  aiBaseUrl,
  aiModel,
  aiApiKey,
  isCustomAiProvider,
  aiTestMessage,
  aiTestStatus,
  isMobile,
  isSettingsCollapsed,
  isAiChatCollapsed,
} from "./state";
import { templates, aiProviderOptions } from "./config";
import { syncAiProviderSettings } from "./ai";
import { normalizeBaseUrl } from "./utils";
import type { TemplateId, AiProviderId } from "./types";
import { initSplit } from "./split";

export * from "./types";
export * from "./config";
export * from "./state";
export * from "./utils";
export * from "./background";
export * from "./styles";
export * from "./ai";
export * from "./export";

export function resetCardToInitialState() {
  selectedTemplateId.value = "A";
  aspectId.value = "3:4";
  height.value = 600;

  title.value = "把文字做成光";
  subtitle.value = "可导出 PNG";
  content.value = "输入文字、选择模板、上传图片，然后一键下载。";
  watermark.value = "— 光语 —";
  showWatermark.value = true;
  showSubtitle.value = true;

  const template = templates.find((item) => item.id === "A") ?? templates[0];
  background.value = template.defaultBackground;
  textColor.value = template.defaultText;
  textAlignment.value = template.alignment;
  accent.value = template.defaultAccent;
  radius.value = template.defaultRadius;
  padding.value = template.defaultPadding;

  bgTab.value = template.backgroundMode === "gradient" ? "gradient" : "solid";
  activeGradientNode.value = "background";
  gradientAngle.value = 135;
  bgImageUrl.value = null;
  bgImageName.value = null;
  bgImageSizeText.value = null;
  bgOpacityPercent.value = 60;
  errorMessage.value = null;
}

export function initStore() {
  // 全局一次性初始化 marked（避免每个 CardPreview 实例重复注册）
  marked.use(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
  );
  marked.use({ breaks: true });

  initSplit();

  // 移动端窗口尺寸监听
  const onResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener("resize", onResize);
  onBeforeUnmount(() => window.removeEventListener("resize", onResize));

  // 移动端下强制展开面板（折叠无意义）
  watch(isMobile, (mobile) => {
    if (mobile) {
      isSettingsCollapsed.value = false;
      isAiChatCollapsed.value = false;
    }
  });

  watch(
    () => aspectId.value,
    () => {
      height.value = 600;
    },
    { immediate: true },
  );

  watch(
    () => selectedTemplateId.value,
    (id: TemplateId) => {
      const t = templates.find((x) => x.id === id);
      if (!t) return;
      background.value = t.defaultBackground;
      textColor.value = t.defaultText;
      textAlignment.value = t.alignment;
      accent.value = t.defaultAccent;
      radius.value = t.defaultRadius;
      padding.value = t.defaultPadding;

      if (t.backgroundMode === "gradient") {
        bgTab.value = "gradient";
      } else {
        bgTab.value = "solid";
      }
    },
  );

  let ro: ResizeObserver | null = null;

  watch(
    () => previewFrameRef.value,
    (el) => {
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      if (!el) return;
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        previewSize.value = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
      });
      ro.observe(el);
    },
  );

  onBeforeUnmount(() => {
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  });

  // We no longer observe stageSize to avoid ResizeObserver loop scroll bugs

  onMounted(() => {
    const savedProvider = localStorage.getItem(
      "ai.provider",
    ) as AiProviderId | null;
    const hasSavedProvider = aiProviderOptions.some(
      (item) => item.id === savedProvider,
    );
    aiProvider.value =
      hasSavedProvider && savedProvider ? savedProvider : "openrouter";
    customAiBaseUrl.value =
      localStorage.getItem("ai.customBaseUrl") || "https://api.openai.com";
    aiBaseUrl.value = localStorage.getItem("ai.baseUrl") || "";
    aiModel.value = localStorage.getItem("ai.model") || "";
    // API Key 由服务端统一管理，不再持久化到客户端 localStorage
    // 避免 XSS 泄露风险。所有 AI 调用均通过后端 /api/ai/* 代理。

    syncAiProviderSettings(aiProvider.value, true);
  });

  watch(
    () => aiProvider.value,
    (v: AiProviderId) => {
      syncAiProviderSettings(v);
      aiTestMessage.value = "";
      aiTestStatus.value = "";
      localStorage.setItem("ai.provider", v);
    },
  );

  watch(
    () => customAiBaseUrl.value,
    (v: string) => {
      localStorage.setItem("ai.customBaseUrl", v || "");
      if (isCustomAiProvider.value) aiBaseUrl.value = normalizeBaseUrl(v);
    },
  );

  watch(
    () => aiBaseUrl.value,
    (v: string) => localStorage.setItem("ai.baseUrl", v || ""),
  );

  watch(
    () => aiModel.value,
    (v: string) => localStorage.setItem("ai.model", v || ""),
  );
}
