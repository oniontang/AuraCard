const fs = require('fs');

const src = fs.readFileSync('src/store.ts', 'utf8');

function extract(regex) {
  const m = src.match(regex);
  return m ? m[0] : '';
}

function extractBetween(start, end) {
  const i1 = src.indexOf(start);
  const i2 = src.indexOf(end, i1);
  return i1 !== -1 && i2 !== -1 ? src.slice(i1, i2) : '';
}

// state.ts
let stateCode = `import { ref, computed, watch } from "vue";
import { marked } from "marked";
import { templates, aspectPresets, aiProviderOptions } from "./config";
import type { TemplateId, AspectId, BgTab, SplitRule, ChatMessage, AiProviderId } from "./types";
import { normalizeBaseUrl } from "./utils";
`;
stateCode += extractBetween('export const selectedTemplateId', 'export const backgroundCss');
stateCode += extractBetween('export const chatMessages', 'export const aiProviderOptions');
stateCode += extractBetween('export const aiProvider', 'export function syncAiProviderSettings');

fs.writeFileSync('src/store/state.ts', stateCode);

// utils.ts
let utilsCode = `
export function hexToRgb(hex: string) {
  const normalized = hex.trim().toLowerCase();
  const m = normalized.match(/^#([0-9a-f]{6})$/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function relativeLuminance(rgb: { r: number; g: number; b: number }) {
  const toLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  const kb = bytes / 1024;
  if (kb < 1024) return \`\${kb.toFixed(0)} KB\`;
  const mb = kb / 1024;
  return \`\${mb.toFixed(1)} MB\`;
}

export function safeFilename(raw: string) {
  const trimmed = raw.trim() || "card";
  return trimmed.replace(/[\\\\/:*?"<>|]/g, "_").slice(0, 40);
}

export function newId() {
  return \`\${Date.now()}_\${Math.random().toString(16).slice(2)}\`;
}

export function normalizeBaseUrl(raw: string) {
  return raw.trim().replace(/\\/$/, "");
}

export function chatEndpoint(baseUrl: string) {
  const base = normalizeBaseUrl(baseUrl);
  if (!base) return "";
  if (base.endsWith("/v1")) return \`\${base}/chat/completions\`;
  return \`\${base}/v1/chat/completions\`;
}
`;
fs.writeFileSync('src/store/utils.ts', utilsCode);

// background.ts
let bgCode = `import { bgImageUrl, bgImageName, bgImageSizeText, isBgDragging, bgFileInputRef } from "./state";
import { formatBytes } from "./utils";
`;
bgCode += extractBetween('export function openBgPicker', 'export const cardRefs');
fs.writeFileSync('src/store/background.ts', bgCode);

// ai.ts
let aiCode = `import { aiProviderOptions } from "./config";
import { chatMessages, chatInput, isChatLoading, chatError, aiProvider, aiBaseUrl, aiApiKey, aiModel, customAiBaseUrl, isTestingAiConnection, aiTestMessage, aiTestStatus, selectedAiProvider, title, subtitle, content, watermark } from "./state";
import { normalizeBaseUrl, chatEndpoint, newId } from "./utils";
import type { ChatMessage, AiProviderId } from "./types";
`;
aiCode += extractBetween('export function syncAiProviderSettings', 'export function initStore');
fs.writeFileSync('src/store/ai.ts', aiCode);

// export.ts
let exportCode = `import { toPng } from "html-to-image";
import { cardRefs, isDownloading, errorMessage, title } from "./state";
import { safeFilename } from "./utils";
`;
exportCode += extractBetween('export async function downloadPng', 'export type ChatRole');
fs.writeFileSync('src/store/export.ts', exportCode);

// styles.ts
let stylesCode = `import { computed } from "vue";
import { icons } from "../icons";
import {
  selectedTemplate, background, accent, textColor, textAlignment, width, height, radius, padding,
  bgTab, gradientAngle, isLightText, splitContents, previewSize, bgOpacityPercent, bgImageUrl
} from "./state";
import type { TemplateId } from "./types";
import { hexToRgb, relativeLuminance } from "./utils";

function getIconDataUrl(iconName: keyof typeof icons, color: string, opacity: number = 1) {
  const svg = icons[iconName];
  if (!svg) return "";
  const coloredSvg = svg.replace("<svg ", \`<svg fill="\${color}" opacity="\${opacity}" \`);
  return \`url("data:image/svg+xml,\${encodeURIComponent(coloredSvg)}")\`;
}
`;
stylesCode += extractBetween('export const backgroundCss', 'export function hexToRgb');
stylesCode += extractBetween('export const isLightText', 'export function safeFilename');
fs.writeFileSync('src/store/styles.ts', stylesCode);

// index.ts
let indexCode = `import { watch, onBeforeUnmount, onMounted } from "vue";
import { aspectId, height, selectedTemplateId, background, textColor, textAlignment, accent, radius, padding, bgTab, previewFrameRef, previewSize, aiProvider, customAiBaseUrl, aiBaseUrl, aiModel, aiApiKey, isCustomAiProvider, aiTestMessage, aiTestStatus } from "./state";
import { templates, aiProviderOptions } from "./config";
import { syncAiProviderSettings } from "./ai";
import { normalizeBaseUrl } from "./utils";
import type { TemplateId, AiProviderId } from "./types";

export * from "./types";
export * from "./config";
export * from "./state";
export * from "./utils";
export * from "./background";
export * from "./styles";
export * from "./ai";
export * from "./export";

export function initStore() {
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
  onBeforeUnmount(() => {
    // cleanup if necessary
  });
  onMounted(() => {
    const el = previewFrameRef.value;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      previewSize.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
    });
    ro.observe(el);
    onBeforeUnmount(() => ro.disconnect());
  });
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
    aiApiKey.value = localStorage.getItem("ai.apiKey") || "";
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
  watch(
    () => aiApiKey.value,
    (v: string) => localStorage.setItem("ai.apiKey", v || ""),
  );
}
`;
fs.writeFileSync('src/store/index.ts', indexCode);
console.log('done');
