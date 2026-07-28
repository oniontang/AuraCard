import { ref, computed } from "vue";
import { templates, aspectPresets, aiProviderOptions } from "./config";
import type {
  TemplateId,
  AspectId,
  BgTab,
  ChatMessage,
  AiProviderId,
} from "./types";

export const selectedTemplateId = ref<TemplateId>("A");
export const selectedTemplate = computed(
  () =>
    templates.find((t) => t.id === selectedTemplateId.value) ?? templates[0],
);

export const aspectId = ref<AspectId>("3:4");
export const height = ref(600);
export const activeAspect = computed(
  () => aspectPresets.find((p) => p.id === aspectId.value) ?? aspectPresets[0],
);
export const width = computed(() =>
  Math.round((height.value * activeAspect.value.w) / activeAspect.value.h),
);

export const title = ref("把文字做成光");
export const subtitle = ref("可导出 PNG");
export const content = ref("输入文字、选择模板、上传图片，然后一键下载。");
export const watermark = ref("— 光语 —");
export const showWatermark = ref(true);
export const showSubtitle = ref(true);

export const background = ref(selectedTemplate.value.defaultBackground);
export const textColor = ref(selectedTemplate.value.defaultText);
export const textAlignment = ref<"left" | "center" | "right" | "justify">(
  "left",
);
export const accent = ref(selectedTemplate.value.defaultAccent);
export const radius = ref(selectedTemplate.value.defaultRadius);
export const padding = ref(selectedTemplate.value.defaultPadding);

export const splitContents = ref<string[]>([""]);
export const isAiChatCollapsed = ref(false);

export const bgTab = ref<BgTab>("solid");
export const activeGradientNode = ref<"background" | "accent">("background");
export const gradientAngle = ref(135);

export const bgImageUrl = ref<string | null>(null);
export const bgImageName = ref<string | null>(null);
export const bgImageSizeText = ref<string | null>(null);
export const bgOpacityPercent = ref(60);
export const isBgDragging = ref(false);
export const bgFileInputRef = ref<HTMLInputElement | null>(null);

export const cardRefs = ref<HTMLElement[]>([]);
export const previewFrameRef = ref<HTMLElement | null>(null);
export const previewSize = ref({ width: 0, height: 0 });
export const isDownloading = ref(false);
export const errorMessage = ref<string | null>(null);
export const isSettingsCollapsed = ref(false);

// ---- 移动端适配 ----
export const isMobile = ref(window.innerWidth < 768);
export const mobileTab = ref<"settings" | "preview" | "chat">("preview");

export const chatMessages = ref<ChatMessage[]>([
  {
    id: "welcome",
    role: "assistant",
    content: "把你的想法发给我，我会帮你整理成适合视觉表达的图文内容～",
    createdAt: Date.now(),
  },
]);
export const chatInput = ref("");
export const isChatLoading = ref(false);
export const chatError = ref<string | null>(null);

export const aiProvider = ref<AiProviderId>("openrouter");
export const aiBaseUrl = ref("");
export const aiApiKey = ref("");
export const aiModel = ref("");
export const customAiBaseUrl = ref("");
export const isAiKeyVisible = ref(false);
export const isAiSettingsOpen = ref(false);
export const isTestingAiConnection = ref(false);
export const aiTestMessage = ref("");
export const aiTestStatus = ref<"success" | "error" | "">("");

export const selectedAiProvider = computed(
  () =>
    aiProviderOptions.find((item) => item.id === aiProvider.value) ??
    aiProviderOptions[0],
);
export const isCustomAiProvider = computed(() => aiProvider.value === "custom");
export const availableAiModels = computed(
  () => selectedAiProvider.value.models,
);
export const selectedAiModel = computed(
  () =>
    availableAiModels.value.find((model) => model.value === aiModel.value) ??
    null,
);
