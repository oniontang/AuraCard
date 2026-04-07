import { watch, onBeforeUnmount, onMounted } from "vue";
import {
  aspectId,
  height,
  selectedTemplateId,
  background,
  textColor,
  textAlignment,
  accent,
  radius,
  padding,
  bgTab,
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

export function initStore() {
  initSplit();

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
