import { computed } from "vue";
import {
  selectedTemplate,
  background,
  accent,
  textColor,
  textAlignment,
  width,
  height,
  radius,
  padding,
  splitContents,
  previewSize,
  bgTab,
  gradientAngle,
  bgOpacityPercent,
  bgImageUrl,
} from "./state";
import { hexToRgb, relativeLuminance } from "./utils";
import { modeVisuals, resolveModeStyle, getTemplateIconUrl } from "./modeVisuals";

// ---- 背景 CSS ----

export const backgroundCss = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];

  // 用户手动切换到渐变 tab
  if (bgTab.value === "gradient") {
    return `linear-gradient(${gradientAngle.value}deg, ${background.value}, ${accent.value})`;
  }

  // 用户使用纯色 tab 且模式原本是渐变 → 只显示纯色
  if (bgTab.value === "solid" && mode === "gradient") {
    return background.value;
  }

  if (!visuals) return background.value;
  return visuals.backgroundCss(background.value, accent.value, gradientAngle.value);
});

// ---- 文字亮度 ----

export const isLightText = computed(() => {
  const rgb = hexToRgb(textColor.value);
  if (!rgb) return false;
  return relativeLuminance(rgb) > 0.6;
});

// ---- 卡片基础样式 ----

export const cardStyle = computed(() => {
  const t = selectedTemplate.value;
  const contentWidth = width.value - padding.value * 2;
  const contentFontSize =
    contentWidth <= 340 ? "17px" : contentWidth <= 420 ? "18px" : "20px";
  const contentLineHeight = contentWidth <= 340 ? "1.72" : "1.65";
  return {
    width: `${width.value}px`,
    minHeight: `${height.value}px`,
    height: "max-content",
    borderRadius: `${radius.value}px`,
    padding: `${padding.value}px`,
    color: textColor.value,
    background: "transparent",
    border: t.border ? "1px solid rgba(17, 24, 39, 0.08)" : "none",
    boxShadow: t.shadow ? "0 18px 60px rgba(17, 24, 39, 0.18)" : "none",
    textAlign: textAlignment.value,
    "--card-content-font-size": contentFontSize,
    "--card-content-line-height": contentLineHeight,
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  } as const;
});

export const cardCanvasStyle = computed(() => ({
  background: backgroundCss.value,
}));

// ---- 装饰层（从注册表查找） ----

export const cardDecorationStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals?.decorationStyle) return {};
  return resolveModeStyle(visuals.decorationStyle, accent.value, radius.value);
});

export const cardFrameDecorStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals?.frameDecorStyle) return {};
  return resolveModeStyle(visuals.frameDecorStyle, accent.value, radius.value);
});

export const cardOrnamentStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals?.ornamentStyle) return { display: "none" };
  const style = resolveModeStyle(visuals.ornamentStyle, accent.value, radius.value);
  // 特殊处理 ticketNote 的 dynamic background (需要 background.value)
  if (mode === "ticketNote") {
    return {
      ...style,
      background:
        `radial-gradient(circle at 0 88%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `radial-gradient(circle at 100% 88%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.4) 0, rgba(148, 163, 184, 0.4) 6px, transparent 6px, transparent 14px)`,
    };
  }
  return style;
});

// ---- 模板图标 ----

export const cardIconStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals || visuals.hideIcon) return { display: "none" } as const;

  let color = accent.value;
  let opacity = 0.08;

  if (isLightText.value) {
    color = "#ffffff";
    opacity = 0.15;
  } else if (mode === "solid" || mode === "notepad") {
    color = accent.value;
    opacity = 0.1;
  }

  const iconUrl = getTemplateIconUrl(selectedTemplate.value.id, color, opacity);

  return {
    position: "absolute",
    width: "120px",
    height: "120px",
    backgroundImage: iconUrl,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    pointerEvents: "none",
    zIndex: 0,
    ...visuals.iconPosition,
  } as const;
});

// ---- 顶部元信息 ----

export const cardTopMeta = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals?.hasTopMeta) {
    return { left: "", right: "", center: "", showCenterDot: false };
  }
  return visuals.topMeta();
});

export const cardTopMetaStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (!visuals?.topMetaStyle) return { color: textColor.value } as const;
  return visuals.topMetaStyle as Record<string, string | number>;
});

// ---- 正文区域 ----

export const cardBodyStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  const inset = visuals?.bodyInset ?? { top: 40, bottom: 44, justifyCenter: false };

  const base: Record<string, string | number> = {
    zIndex: 10,
    position: "relative",
  };

  if (inset.justifyCenter) {
    Object.assign(base, {
      justifyContent: "center",
      paddingTop: `${inset.top}px`,
      paddingBottom: `${inset.bottom}px`,
    });
  } else if (mode === "ticketNote") {
    Object.assign(base, {
      justifyContent: "center",
      paddingTop: "86px",
      paddingBottom: "86px",
    });
  }

  return base;
});

// ---- 遮罩层 ----

export const scrimStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  if (visuals?.scrimStyle && Object.keys(visuals.scrimStyle).length === 0) {
    // 空对象 = 使用动态遮罩（根据文字亮度）
    const base = isLightText.value
      ? "rgba(0, 0, 0, 0.30)"
      : "rgba(255, 255, 255, 0.42)";
    return { background: base } as const;
  }
  return visuals?.scrimStyle ?? {};
});

// ---- 标题样式 ----

export const titleStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const visuals = modeVisuals[mode];
  const showBorder = visuals?.titleBorder ?? true;

  return {
    color: textColor.value,
    borderLeft:
      showBorder && textAlignment.value === "left"
        ? `4px solid ${accent.value}`
        : "none",
    paddingLeft:
      showBorder && textAlignment.value === "left" ? "12px" : "0",
  } as const;
});

// ---- 副标题颜色 ----

export const subtitleStyle = computed(() => {
  return {
    color:
      selectedTemplate.value.id === "C"
        ? "rgba(229, 231, 235, 0.82)"
        : "rgba(17, 24, 39, 0.72)",
  } as const;
});

// ---- 预览缩放 ----

export const previewScale = computed(() => {
  const w = Math.max(0, previewSize.value.width - 36);
  const h = Math.max(0, previewSize.value.height - 36);
  if (!w || !h) return 1;
  const sx = w / width.value;
  if (splitContents.value.length > 1) {
    return Math.min(1, sx);
  }
  const sy = h / height.value;
  return Math.min(1, sx, sy);
});

export const previewStageStyle = computed(() => {
  return {
    width: `${width.value}px`,
    transform: `scale(${previewScale.value})`,
    transformOrigin: "top center",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    paddingTop: "40px",
    paddingBottom: "40px",
  } as const;
});

export const previewWrapperStyle = computed(() => {
  return {
    width: "100%",
    height: "fit-content",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
  } as const;
});

// ---- 背景图片 ----

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
