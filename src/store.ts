import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { toPng } from "html-to-image";

export type TemplateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "Q";

export type TemplateConfig = {
  id: TemplateId;
  name: string;
  defaultBackground: string;
  defaultText: string;
  defaultAccent: string;
  defaultRadius: number;
  defaultPadding: number;
  alignment: "left" | "center";
  border: boolean;
  shadow: boolean;
  backgroundMode:
    | "solid"
    | "gradient"
    | "notepad"
    | "grid"
    | "stickyBlue"
    | "wishPaper"
    | "mistLilac"
    | "stackBlue"
    | "darkGrid"
    | "neonDark"
    | "ticketNote"
    | "lilacHang"
    | "mintMood"
    | "warmPink";
};

export const templates: TemplateConfig[] = [
  {
    id: "A",
    name: "极简",
    defaultBackground: "#ffffff",
    defaultText: "#111827",
    defaultAccent: "#2563eb",
    defaultRadius: 16,
    defaultPadding: 36,
    alignment: "left",
    border: true,
    shadow: false,
    backgroundMode: "solid",
  },
  {
    id: "B",
    name: "渐变",
    defaultBackground: "#fff1f2",
    defaultText: "#111827",
    defaultAccent: "#8b5cf6",
    defaultRadius: 20,
    defaultPadding: 40,
    alignment: "center",
    border: false,
    shadow: true,
    backgroundMode: "gradient",
  },
  {
    id: "C",
    name: "深色",
    defaultBackground: "#0b1220",
    defaultText: "#e5e7eb",
    defaultAccent: "#22c55e",
    defaultRadius: 18,
    defaultPadding: 38,
    alignment: "left",
    border: false,
    shadow: true,
    backgroundMode: "darkGrid",
  },
  {
    id: "D",
    name: "奶油",
    defaultBackground: "#fff7ed",
    defaultText: "#4a2c2a",
    defaultAccent: "#f97316",
    defaultRadius: 22,
    defaultPadding: 40,
    alignment: "left",
    border: true,
    shadow: false,
    backgroundMode: "solid",
  },
  {
    id: "E",
    name: "票根",
    defaultBackground: "#e11d48",
    defaultText: "#0f172a",
    defaultAccent: "#94a3b8",
    defaultRadius: 20,
    defaultPadding: 56,
    alignment: "left",
    border: false,
    shadow: false,
    backgroundMode: "ticketNote",
  },
  {
    id: "G",
    name: "备忘录",
    defaultBackground: "#fffef2",
    defaultText: "#3f3f46",
    defaultAccent: "#ef4444",
    defaultRadius: 16,
    defaultPadding: 40,
    alignment: "left",
    border: true,
    shadow: false,
    backgroundMode: "notepad",
  },
  {
    id: "H",
    name: "网格",
    defaultBackground: "#f8fafc",
    defaultText: "#111827",
    defaultAccent: "#60a5fa",
    defaultRadius: 18,
    defaultPadding: 38,
    alignment: "left",
    border: true,
    shadow: false,
    backgroundMode: "grid",
  },
  {
    id: "I",
    name: "便签蓝",
    defaultBackground: "#acebff",
    defaultText: "#1f2937",
    defaultAccent: "#3b82f6",
    defaultRadius: 26,
    defaultPadding: 54,
    alignment: "center",
    border: false,
    shadow: false,
    backgroundMode: "stickyBlue",
  },
  {
    id: "J",
    name: "祝福纸",
    defaultBackground: "#f8f1c8",
    defaultText: "#4b1d1f",
    defaultAccent: "#fb923c",
    defaultRadius: 20,
    defaultPadding: 44,
    alignment: "center",
    border: true,
    shadow: false,
    backgroundMode: "wishPaper",
  },
  {
    id: "K",
    name: "紫雾",
    defaultBackground: "#fefefe",
    defaultText: "#4c4a7d",
    defaultAccent: "#c4b5fd",
    defaultRadius: 22,
    defaultPadding: 48,
    alignment: "center",
    border: true,
    shadow: false,
    backgroundMode: "mistLilac",
  },
  {
    id: "L",
    name: "叠卡蓝",
    defaultBackground: "#0ea5ff",
    defaultText: "#0f172a",
    defaultAccent: "#1d9cff",
    defaultRadius: 24,
    defaultPadding: 58,
    alignment: "center",
    border: false,
    shadow: false,
    backgroundMode: "stackBlue",
  },
  {
    id: "M",
    name: "霓虹夜卡",
    defaultBackground: "#05060a",
    defaultText: "#f8fafc",
    defaultAccent: "#23f0d0",
    defaultRadius: 24,
    defaultPadding: 56,
    alignment: "left",
    border: false,
    shadow: true,
    backgroundMode: "neonDark",
  },
  {
    id: "N",
    name: "彩色挂卡",
    defaultBackground: "#b88bff",
    defaultText: "#111827",
    defaultAccent: "#b88bff",
    defaultRadius: 24,
    defaultPadding: 54,
    alignment: "center",
    border: false,
    shadow: false,
    backgroundMode: "lilacHang",
  },
  {
    id: "O",
    name: "彩色心情",
    defaultBackground: "#8fd8a0",
    defaultText: "#1f2937",
    defaultAccent: "#38bdf8",
    defaultRadius: 24,
    defaultPadding: 58,
    alignment: "center",
    border: false,
    shadow: false,
    backgroundMode: "mintMood",
  },
  {
    id: "Q",
    name: "暖粉漂流",
    defaultBackground: "#ff8eb6",
    defaultText: "#fff8fb",
    defaultAccent: "#f9a8d4",
    defaultRadius: 20,
    defaultPadding: 52,
    alignment: "left",
    border: false,
    shadow: false,
    backgroundMode: "warmPink",
  },
];

export const selectedTemplateId = ref<TemplateId>("A");
export const selectedTemplate = computed(
  () =>
    templates.find((t) => t.id === selectedTemplateId.value) ?? templates[0],
);

export type AspectId = "3:4" | "1:1" | "5:7" | "9:16";
export type AspectPreset = {
  id: AspectId;
  label: string;
  w: number;
  h: number;
};

export const aspectPresets: AspectPreset[] = [
  { id: "3:4", label: "3:4", w: 3, h: 4 },
  { id: "1:1", label: "1:1", w: 1, h: 1 },
  { id: "5:7", label: "5:7", w: 5, h: 7 },
  { id: "9:16", label: "9:16", w: 9, h: 16 },
];

export const aspectId = ref<AspectId>("3:4");

export const height = ref(600);
export const activeAspect = computed(
  () => aspectPresets.find((p) => p.id === aspectId.value) ?? aspectPresets[0],
);
export const width = computed(() =>
  Math.round((height.value * activeAspect.value.w) / activeAspect.value.h),
);

export const title = ref("把想法做成一张卡片");
export const subtitle = ref("极简 · 可导出 PNG");
export const content = ref("输入文字、选择模板、上传图片，然后一键下载。");
export const watermark = ref("— card");
export const showWatermark = ref(true);

export const background = ref(selectedTemplate.value.defaultBackground);
export const textColor = ref(selectedTemplate.value.defaultText);
export const accent = ref(selectedTemplate.value.defaultAccent);
export const radius = ref(selectedTemplate.value.defaultRadius);
export const padding = ref(selectedTemplate.value.defaultPadding);

export type BgTab = "solid" | "gradient" | "image";
export const bgTab = ref<BgTab>("solid");

export const activeGradientNode = ref<"background" | "accent">("background");
export const gradientAngle = ref(135);

export function swapColors() {
  const temp = background.value;
  background.value = accent.value;
  accent.value = temp;
}

export function rotateGradient() {
  gradientAngle.value = (gradientAngle.value + 45) % 360;
}

export function updateActiveGradientColor(color: string) {
  if (activeGradientNode.value === "background") {
    background.value = color;
  } else {
    accent.value = color;
  }
}

export const colorSwatches = [
  "#FF2D55",
  "#FFFFFF",
  "#1F2937",
  "#EF4444",
  "#0B0B0F",
  "#2563EB",
  "#F97316",
  "#F59E0B",
  "#FEE2E2",
  "#FFF7ED",
  "#FEF9C3",
  "#DCFCE7",
  "#CCFBF1",
  "#DBEAFE",
  "#EDE9FE",
  "#FCE7F3",
];

export const bgImageUrl = ref<string | null>(null);
export const bgImageName = ref<string | null>(null);
export const bgImageSizeText = ref<string | null>(null);
export const bgOpacityPercent = ref(60);
export const isBgDragging = ref(false);

export const bgFileInputRef = ref<HTMLInputElement | null>(null);

export function openBgPicker() {
  bgFileInputRef.value?.click();
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function setBgFile(file: File) {
  if (!file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    bgImageUrl.value = e.target?.result as string;
    bgImageName.value = file.name;
    bgImageSizeText.value = formatBytes(file.size);
  };
  reader.readAsDataURL(file);
}

export function onPickBgImage(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  setBgFile(file);
  input.value = "";
}

export function clearBgImage() {
  bgImageUrl.value = null;
  bgImageName.value = null;
  bgImageSizeText.value = null;
}

export function onBgDragEnter() {
  isBgDragging.value = true;
}

export function onBgDragLeave(e: DragEvent) {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) {
    isBgDragging.value = false;
    return;
  }
  const next = e.relatedTarget as Node | null;
  if (!next || !el.contains(next)) isBgDragging.value = false;
}

export function onBgDrop(e: DragEvent) {
  isBgDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  setBgFile(file);
}

export const cardRef = ref<HTMLElement | null>(null);
export const previewFrameRef = ref<HTMLElement | null>(null);
export const previewSize = ref({ width: 0, height: 0 });
export const isDownloading = ref(false);
export const errorMessage = ref<string | null>(null);
export const isSettingsCollapsed = ref(false);

export const backgroundCss = computed(() => {
  if (bgTab.value === "gradient") {
    return `linear-gradient(${gradientAngle.value}deg, ${background.value}, ${accent.value})`;
  }

  const mode = selectedTemplate.value.backgroundMode;

  if (bgTab.value === "solid" && mode === "gradient") {
    return background.value;
  }

  if (mode === "gradient") {
    return `linear-gradient(${gradientAngle.value}deg, ${background.value}, ${accent.value})`;
  }
  if (mode === "stickyBlue") {
    return `linear-gradient(180deg, #b3eeff 0%, ${background.value} 100%)`;
  }
  if (mode === "wishPaper") {
    return `repeating-linear-gradient(120deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 16px), linear-gradient(180deg, #fff9dc 0%, ${background.value} 100%)`;
  }
  if (mode === "mistLilac") {
    return `radial-gradient(80% 70% at 30% 100%, #dbe6ff99 0%, transparent 65%), radial-gradient(60% 45% at 95% 0%, #ddd6fe88 0%, transparent 70%), linear-gradient(180deg, #ffffff 0%, ${background.value} 100%)`;
  }
  if (mode === "stackBlue") {
    return `linear-gradient(180deg, #1ea7ff 0%, ${background.value} 100%)`;
  }
  if (mode === "neonDark") {
    return `radial-gradient(90% 55% at 50% 12%, rgba(35, 240, 208, 0.08) 0%, transparent 72%), linear-gradient(180deg, #08090f 0%, ${background.value} 100%)`;
  }
  if (mode === "ticketNote") {
    return background.value;
  }
  if (mode === "lilacHang") {
    return `linear-gradient(180deg, #c9a7ff 0%, ${background.value} 100%)`;
  }
  if (mode === "mintMood") {
    return `radial-gradient(75% 120% at 50% -5%, rgba(255,255,255,0.34) 0%, transparent 72%), repeating-linear-gradient(135deg, rgba(16,185,129,0.06) 0, rgba(16,185,129,0.06) 3px, transparent 3px, transparent 12px), linear-gradient(180deg, #9ce8b0 0%, ${background.value} 100%)`;
  }
  if (mode === "warmPink") {
    return `radial-gradient(80% 45% at 25% 0%, rgba(255,255,255,0.22) 0%, transparent 78%), linear-gradient(180deg, #ffa8c7 0%, ${background.value} 100%)`;
  }
  if (mode === "notepad") {
    return `linear-gradient(90deg, transparent 44px, ${accent.value}55 44px, ${accent.value}55 46px, transparent 46px), repeating-linear-gradient(180deg, transparent 0, transparent 31px, ${accent.value}22 31px, ${accent.value}22 32px), linear-gradient(180deg, ${background.value}, ${background.value})`;
  }
  if (mode === "grid") {
    return `repeating-linear-gradient(0deg, ${accent.value}1f 0, ${accent.value}1f 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, ${accent.value}1f 0, ${accent.value}1f 1px, transparent 1px, transparent 28px), linear-gradient(180deg, ${background.value}, ${background.value})`;
  }
  if (mode === "darkGrid") {
    return `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), linear-gradient(180deg, ${background.value}, ${background.value})`;
  }
  return background.value;
});

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

export const isLightText = computed(() => {
  const rgb = hexToRgb(textColor.value);
  if (!rgb) return false;
  return relativeLuminance(rgb) > 0.6;
});

export const cardStyle = computed(() => {
  const t = selectedTemplate.value;
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
    borderRadius: `${radius.value}px`,
    padding: `${padding.value}px`,
    color: textColor.value,
    background: "transparent",
    border: t.border ? "1px solid rgba(17, 24, 39, 0.08)" : "none",
    boxShadow: t.shadow ? "0 18px 60px rgba(17, 24, 39, 0.18)" : "none",
    textAlign: t.alignment,
    position: "relative",
  } as const;
});

export const cardCanvasStyle = computed(() => {
  return {
    background: backgroundCss.value,
  } as const;
});

export const cardDecorationStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "stickyBlue") {
    return {
      background: `radial-gradient(95% 12% at 50% 0%, rgba(255, 255, 255, 0.65) 0%, transparent 100%), linear-gradient(180deg, ${accent.value}1a 14%, transparent 14%)`,
    } as const;
  }
  if (mode === "wishPaper") {
    return {
      background: `radial-gradient(16% 14% at 78% 74%, #fb923c 0%, #fb923c 65%, transparent 66%), radial-gradient(14% 12% at 86% 76%, #fde047 0%, #fde047 66%, transparent 67%), radial-gradient(10% 9% at 80% 72%, #f87171 0%, #f87171 68%, transparent 69%), radial-gradient(2.5% 2.5% at 18% 82%, #fdba7490 0%, #fdba7490 98%, transparent 99%), radial-gradient(2.5% 2.5% at 12% 90%, #fde68a90 0%, #fde68a90 98%, transparent 99%), radial-gradient(5% 5% at 46% 82%, #f59e0b77 0%, transparent 70%)`,
    } as const;
  }
  if (mode === "mistLilac") {
    return {
      background: `radial-gradient(65% 45% at 15% 100%, #bfdbfe6b 0%, transparent 72%), radial-gradient(45% 35% at 100% 0%, #ddd6fe73 0%, transparent 72%)`,
    } as const;
  }
  if (mode === "stackBlue") {
    return {
      background: `radial-gradient(70% 10% at 50% 100%, rgba(255,255,255,0.18) 0%, transparent 95%)`,
    } as const;
  }
  if (mode === "neonDark") {
    return {
      background: `radial-gradient(38% 14% at 50% 56%, ${accent.value}4d 0%, transparent 85%), radial-gradient(58% 36% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 82%)`,
    } as const;
  }
  if (mode === "ticketNote") {
    return {
      background: "transparent",
    } as const;
  }
  if (mode === "lilacHang") {
    return {
      background: `radial-gradient(95% 80% at 80% 10%, rgba(255,255,255,0.45) 0%, transparent 72%), radial-gradient(40% 32% at 50% 88%, rgba(184, 139, 255, 0.12) 0%, transparent 84%)`,
    } as const;
  }
  if (mode === "mintMood") {
    return {
      background: `radial-gradient(42% 12% at 50% 56%, ${accent.value}70 0%, transparent 90%), radial-gradient(85% 55% at 90% 100%, rgba(16, 185, 129, 0.15) 0%, transparent 84%)`,
    } as const;
  }
  if (mode === "warmPink") {
    return {
      background: `radial-gradient(26% 18% at 15% 20%, rgba(255,255,255,0.22) 0%, transparent 80%), radial-gradient(34% 24% at 72% 86%, rgba(236, 72, 153, 0.2) 0%, transparent 85%)`,
    } as const;
  }
  if (mode === "gradient") {
    return {
      background: `radial-gradient(70% 50% at 10% 0%, ${accent.value}33 0%, transparent 70%), radial-gradient(60% 45% at 100% 90%, ${textColor.value}20 0%, transparent 72%)`,
    } as const;
  }
  if (mode === "notepad") {
    return {
      background: `repeating-radial-gradient(circle at 24px 14px, ${accent.value}40 0, ${accent.value}40 2px, transparent 2px, transparent 20px), linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%)`,
    } as const;
  }
  if (mode === "grid") {
    return {
      background: `radial-gradient(55% 40% at 50% 10%, ${accent.value}2b 0%, transparent 75%), linear-gradient(135deg, ${accent.value}14 0%, transparent 40%)`,
    } as const;
  }
  return {
    background: `radial-gradient(80% 55% at 100% 0%, ${accent.value}18 0%, transparent 72%)`,
  } as const;
});

export const cardFrameDecorStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const borderRadius = `${Math.max(8, radius.value - 10)}px`;
  if (mode === "stickyBlue") {
    return {
      inset: "22px",
      border: `1px solid ${accent.value}2a`,
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background: "rgba(255, 255, 255, 0.98)",
      boxShadow: "0 10px 24px rgba(56, 189, 248, 0.2)",
    } as const;
  }
  if (mode === "wishPaper") {
    return {
      border: `1px solid ${accent.value}33`,
      borderRadius,
      background: "rgba(255, 255, 255, 0.06)",
    } as const;
  }
  if (mode === "mistLilac") {
    return {
      border: "1px solid rgba(196, 181, 253, 0.5)",
      borderRadius,
      background: "rgba(255,255,255,0.35)",
    } as const;
  }
  if (mode === "stackBlue") {
    return {
      inset: "18px",
      border: `1px solid ${accent.value}44`,
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background: "rgba(255, 255, 255, 0.99)",
      boxShadow: "8px 12px 0 rgba(160, 225, 255, 0.95)",
    } as const;
  }
  if (mode === "neonDark") {
    return {
      inset: "16px",
      border: `1px solid rgba(35, 240, 208, 0.3)`,
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background: "rgba(0, 0, 0, 0.72)",
      boxShadow:
        "inset 0 0 0 1px rgba(255,255,255,0.04), 0 18px 32px rgba(0,0,0,0.45)",
    } as const;
  }
  if (mode === "ticketNote") {
    return {
      inset: "26px 24px 34px 24px",
      border: "none",
      borderRadius: `${Math.max(12, radius.value - 8)}px`,
      background: "#ffffff",
      boxShadow: "0 12px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
    } as const;
  }
  if (mode === "lilacHang") {
    return {
      inset: "16px",
      border: "2px solid rgba(183, 138, 255, 0.6)",
      borderRadius: `${Math.max(16, radius.value - 8)}px`,
      background: "rgba(255, 255, 255, 0.98)",
      boxShadow: "0 12px 28px rgba(124, 58, 237, 0.2)",
    } as const;
  }
  if (mode === "mintMood") {
    return {
      inset: "20px",
      border: "1px solid rgba(255,255,255,0.72)",
      borderRadius: `${Math.max(18, radius.value - 6)}px`,
      background: "rgba(236, 255, 241, 0.96)",
      boxShadow: "0 10px 22px rgba(16, 185, 129, 0.2)",
    } as const;
  }
  if (mode === "warmPink") {
    return {
      border: "1px solid rgba(255,255,255,0.36)",
      borderRadius,
      background: "rgba(255, 255, 255, 0.05)",
    } as const;
  }
  if (mode === "notepad") {
    return {
      inset: "0",
      border: "1px solid rgba(255, 255, 255, 0.56)",
      borderRadius: "inherit",
      background: "rgba(255, 255, 255, 0.24)",
      backdropFilter: "blur(10px) saturate(130%)",
      WebkitBackdropFilter: "blur(10px) saturate(130%)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.72), 0 14px 30px ${accent.value}14`,
    } as const;
  }
  if (mode === "grid") {
    return {
      border: `1px solid ${accent.value}30`,
      borderRadius,
    } as const;
  }
  return {
    border: `1px solid ${accent.value}26`,
    borderRadius,
  } as const;
});

export const cardOrnamentStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "grid") {
    return {
      inset: "10px",
      borderRadius: `${Math.max(10, radius.value - 10)}px`,
      backgroundImage: `linear-gradient(${accent.value}1a 1px, transparent 1px), linear-gradient(90deg, ${accent.value}1a 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
      backgroundPosition: "center center",
      opacity: 0.6,
    } as const;
  }
  if (mode === "stickyBlue") {
    return {
      inset: "24px",
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background: `repeating-linear-gradient(180deg, transparent 0, transparent 52px, ${accent.value}22 52px, ${accent.value}22 53px)`,
    } as const;
  }
  if (mode === "stackBlue") {
    return {
      inset: "30px 26px 22px 26px",
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background: "rgba(255, 255, 255, 0.93)",
      transform: "rotate(-3.2deg)",
      boxShadow: "0 14px 26px rgba(14, 116, 144, 0.2)",
    } as const;
  }
  if (mode === "lilacHang") {
    return {
      inset: "auto",
      top: "24px",
      left: "50%",
      width: "72px",
      height: "11px",
      transform: "translateX(-50%)",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.8)",
    } as const;
  }
  if (mode === "ticketNote") {
    return {
      inset: "26px 24px 34px 24px",
      borderRadius: `${Math.max(12, radius.value - 8)}px`,
      background:
        `radial-gradient(circle at 0 78%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `radial-gradient(circle at 100% 78%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.4) 0, rgba(148, 163, 184, 0.4) 6px, transparent 6px, transparent 14px)`,
      backgroundSize: "auto, auto, 100% 2px",
      backgroundPosition: "left center, right center, center 78%",
      backgroundRepeat: "no-repeat",
    } as const;
  }
  if (mode === "warmPink") {
    return {
      inset: "auto",
      right: "24px",
      bottom: "26px",
      width: "132px",
      height: "132px",
      borderRadius: "38% 62% 56% 44% / 44% 35% 65% 56%",
      background:
        "linear-gradient(140deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.1) 75%)",
      transform: "rotate(-18deg)",
      boxShadow: "0 14px 26px rgba(190, 24, 93, 0.2)",
    } as const;
  }
  return { display: "none" } as const;
});

export const cardTopMeta = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "stickyBlue") {
    return { left: "Sticky Notes", right: "MAR 25 2026", showCenterDot: true };
  }
  if (mode === "wishPaper") {
    return { center: "＼ Best wishes for you ／" };
  }
  if (mode === "mistLilac") {
    return { left: "● ● ●", right: "MAR 25" };
  }
  if (mode === "stackBlue") {
    return { left: "• • •", right: "Text Note" };
  }
  if (mode === "neonDark") {
    return { left: "@柚子日记", right: "03-26" };
  }
  if (mode === "ticketNote") {
    return { left: "ADMIT ONE", right: "NO. 0924" };
  }
  if (mode === "lilacHang") {
    return { left: "@柚子日记", right: "2026.03.26" };
  }
  if (mode === "mintMood") {
    return { left: "Mood", right: "THURSDAY" };
  }
  if (mode === "warmPink") {
    return { left: "“", right: "”" };
  }
  return { left: "", right: "", center: "", showCenterDot: false };
});

export const cardTopMetaStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "stickyBlue") {
    return { color: "#356789", fontWeight: 700 } as const;
  }
  if (mode === "wishPaper") {
    return { color: "#f59e0b", fontWeight: 700 } as const;
  }
  if (mode === "mistLilac") {
    return { color: "#c4b5fd", fontWeight: 700 } as const;
  }
  if (mode === "stackBlue") {
    return { color: "#1ea7ff", fontWeight: 700 } as const;
  }
  if (mode === "neonDark") {
    return { color: "rgba(255,255,255,0.9)", fontWeight: 700 } as const;
  }
  if (mode === "ticketNote") {
    return {
      color: "rgba(15, 23, 42, 0.4)",
      fontWeight: 700,
      letterSpacing: "1px",
    } as const;
  }
  if (mode === "lilacHang") {
    return { color: "rgba(120, 90, 180, 0.6)", fontWeight: 700 } as const;
  }
  if (mode === "mintMood") {
    return { color: "#5f9c70", fontWeight: 700 } as const;
  }
  if (mode === "warmPink") {
    return { color: "rgba(255,255,255,0.45)", fontWeight: 700 } as const;
  }
  return { color: textColor.value } as const;
});

export const cardBodyStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "notepad") {
    return {} as const;
  }
  if (
    mode === "stickyBlue" ||
    mode === "wishPaper" ||
    mode === "mistLilac" ||
    mode === "stackBlue" ||
    mode === "neonDark" ||
    mode === "ticketNote" ||
    mode === "lilacHang" ||
    mode === "mintMood" ||
    mode === "warmPink"
  ) {
    return {
      justifyContent: "center",
      paddingTop: "86px",
      paddingBottom: "68px",
    } as const;
  }
  return {} as const;
});

export const previewScale = computed(() => {
  const w = Math.max(0, previewSize.value.width - 36);
  const h = Math.max(0, previewSize.value.height - 36);
  if (!w || !h) return 1;
  const sx = w / width.value;
  const sy = h / height.value;
  return Math.min(1, sx, sy);
});

export const previewStageStyle = computed(() => {
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
    transform: `scale(${previewScale.value})`,
    transformOrigin: "center center",
  } as const;
});

export const bgOpacity = computed(
  () => Math.max(0, Math.min(100, bgOpacityPercent.value)) / 100,
);

export const bgImageStyle = computed(() => {
  if (!bgImageUrl.value) return {};
  return {
    backgroundImage: `url("${bgImageUrl.value}")`,
    opacity: bgOpacity.value,
  } as const;
});

export const scrimStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (
    mode === "notepad" ||
    mode === "stickyBlue" ||
    mode === "wishPaper" ||
    mode === "mistLilac" ||
    mode === "stackBlue" ||
    mode === "neonDark" ||
    mode === "ticketNote" ||
    mode === "lilacHang" ||
    mode === "mintMood" ||
    mode === "warmPink"
  ) {
    return {
      background: "transparent",
    } as const;
  }
  const base = isLightText.value
    ? "rgba(0, 0, 0, 0.30)"
    : "rgba(255, 255, 255, 0.42)";
  return {
    background: base,
  } as const;
});

export const titleStyle = computed(() => {
  return {
    color: textColor.value,
    borderLeft:
      selectedTemplate.value.alignment === "left" &&
      ![
        "stickyBlue",
        "wishPaper",
        "mistLilac",
        "stackBlue",
        "neonDark",
        "ticketNote",
        "warmPink",
      ].includes(selectedTemplate.value.backgroundMode)
        ? `4px solid ${accent.value}`
        : "none",
    paddingLeft:
      selectedTemplate.value.alignment === "left" &&
      ![
        "stickyBlue",
        "wishPaper",
        "mistLilac",
        "stackBlue",
        "neonDark",
        "ticketNote",
        "warmPink",
      ].includes(selectedTemplate.value.backgroundMode)
        ? "12px"
        : "0",
  } as const;
});

export const subtitleStyle = computed(() => {
  return {
    color:
      selectedTemplate.value.id === "C"
        ? "rgba(229, 231, 235, 0.82)"
        : "rgba(17, 24, 39, 0.72)",
  } as const;
});

export function safeFilename(raw: string) {
  const trimmed = raw.trim() || "card";
  return trimmed.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
}

export async function downloadPng() {
  errorMessage.value = null;
  const node = cardRef.value;
  if (!node) return;

  isDownloading.value = true;
  try {
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.download = `${safeFilename(title.value)}.png`;
    link.href = dataUrl;
    link.click();
  } catch (e) {
    errorMessage.value = "导出失败：请尝试换一个模板或缩短文字。";
  } finally {
    isDownloading.value = false;
  }
}

export type ChatRole = "user" | "assistant";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export const chatMessages = ref<ChatMessage[]>([
  {
    id: "welcome",
    role: "assistant",
    content: "把你的想法发给我，我会先和你聊清楚，然后帮你整理成一张卡片。",
    createdAt: Date.now(),
  },
]);
export const chatInput = ref("");
export const isChatLoading = ref(false);
export const chatError = ref<string | null>(null);

export type AiProviderId =
  | "openrouter"
  | "openai"
  | "deepseek"
  | "qwen"
  | "custom";
export type AiModelOption = { value: string; label: string };
export type AiProviderOption = {
  id: AiProviderId;
  name: string;
  description: string;
  baseUrl: string;
  apiKeyPlaceholder: string;
  models: AiModelOption[];
};

export const aiProviderOptions: AiProviderOption[] = [
  {
    id: "openrouter",
    name: "OpenRouter（推荐，支持多模型）",
    description: "一个 Key 可切换多家模型，适合同时体验 GPT、DeepSeek、Qwen。",
    baseUrl: "https://openrouter.ai/api",
    apiKeyPlaceholder: "sk-or-v1-...",
    models: [
      { value: "openai/gpt-4o-mini", label: "gpt-4o-mini（OpenAI）" },
      {
        value: "deepseek/deepseek-chat-v3-0324",
        label: "deepseek-chat-v3（DeepSeek）",
      },
      { value: "qwen/qwen-2.5-72b-instruct", label: "qwen-2.5-72b（Qwen）" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI（GPT 官方）",
    description: "适合直接使用 GPT 系列模型。",
    baseUrl: "https://api.openai.com",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "gpt-4o-mini", label: "gpt-4o-mini" },
      { value: "gpt-4o", label: "gpt-4o" },
      { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
      { value: "gpt-4.1", label: "gpt-4.1" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek（官方）",
    description: "支持 DeepSeek 聊天与推理模型。",
    baseUrl: "https://api.deepseek.com",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "deepseek-chat", label: "deepseek-chat" },
      { value: "deepseek-reasoner", label: "deepseek-reasoner" },
    ],
  },
  {
    id: "qwen",
    name: "通义千问（Qwen / DashScope）",
    description: "使用阿里云 DashScope 兼容模式接入 Qwen。",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKeyPlaceholder: "sk-...",
    models: [
      { value: "qwen-turbo", label: "qwen-turbo" },
      { value: "qwen-plus", label: "qwen-plus" },
      { value: "qwen-max", label: "qwen-max" },
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
    !provider.models.some((model) => model.value === aiModel.value)
  ) {
    aiModel.value = provider.models[0]?.value || "";
  }
}

export function normalizeBaseUrl(raw: string) {
  return raw.trim().replace(/\/$/, "");
}

export function chatEndpoint(baseUrl: string) {
  const base = normalizeBaseUrl(baseUrl);
  if (!base) return "";
  if (base.endsWith("/v1")) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}

export function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
    }),
  });

  const data = (await res.json()) as any;
  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || `请求失败（${res.status}）`;
    throw new Error(msg);
  }

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

  if (!aiApiKey.value.trim()) {
    setAiTestFeedback("error", "请先填写 API Key");
    return;
  }
  if (!aiBaseUrl.value.trim()) {
    setAiTestFeedback("error", "请先填写 API 地址");
    return;
  }
  if (!aiModel.value.trim()) {
    setAiTestFeedback("error", "请先选择 AI 模型");
    return;
  }

  isTestingAiConnection.value = true;
  try {
    await callAiChat([{ role: "user", content: "请仅回复：连接成功" }]);
    setAiTestFeedback("success", `${selectedAiProvider.value.name} 连接成功`);
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
  const body = text.match(/正文[:：]\s*([\s\S]+)/)?.[1]?.trim();
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
          "你是卡片内容编辑助手。把用户提供的文字整理成一张 3:4 卡片内容，输出四行：\n标题：...\n副标题：...\n正文：...\n水印：...",
      },
      { role: "user", content: source },
    ]);
    const parsed = parseCardFromText(summary);
    title.value = (parsed.t || title.value).slice(0, 32);
    subtitle.value = (parsed.sub || subtitle.value).slice(0, 40);
    content.value = (parsed.body || summary).trim();
    watermark.value = (parsed.wm || "— AI").slice(0, 40);
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
