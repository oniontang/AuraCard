import { computed } from "vue";
import { icons } from "../icons";
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
} from "./state";
import { bgTab, gradientAngle, bgOpacityPercent, bgImageUrl } from "./state";
import type { TemplateId } from "./types";
import { hexToRgb, relativeLuminance } from "./utils";

function getIconDataUrl(
  iconName: keyof typeof icons,
  color: string,
  opacity: number = 1,
) {
  const svg = icons[iconName];
  if (!svg) return "";
  const coloredSvg = svg.replace(
    "<svg ",
    `<svg fill="${color}" opacity="${opacity}" `,
  );
  return `url("data:image/svg+xml,${encodeURIComponent(coloredSvg)}")`;
}
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
  if (mode === "solid") {
    return `radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.04) 0%, transparent 50%), ${background.value}`;
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
  if (mode === "glassmorphism") {
    return `radial-gradient(circle at 15% 15%, rgba(255, 200, 220, 0.8) 0%, transparent 78%), radial-gradient(circle at 85% 85%, ${background.value} 0%, transparent 50%), linear-gradient(135deg, #e0f2fe 0%, #fce7f3 100%)`;
  }
  if (mode === "notepad") {
    return `linear-gradient(90deg, transparent 44px, ${accent.value}55 44px, ${accent.value}55 46px, transparent 46px), repeating-linear-gradient(180deg, transparent 0, transparent 31px, ${accent.value}22 31px, ${accent.value}22 32px), linear-gradient(180deg, ${background.value}, ${background.value})`;
  }
  if (mode === "darkGrid") {
    return `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), linear-gradient(180deg, ${background.value}, ${background.value})`;
  }
  return background.value;
});

export const isLightText = computed(() => {
  const rgb = hexToRgb(textColor.value);
  if (!rgb) return false;
  return relativeLuminance(rgb) > 0.6;
});

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
    zIndex: 1, // ensure card container creates stacking context for internal z-indexes
    overflow: "hidden", // Prevent any content from overflowing the card bounds
  } as const;
});

export const cardCanvasStyle = computed(() => {
  return {
    background: backgroundCss.value,
  } as const;
});

export const cardDecorationStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "solid") {
    return {
      background: `
        radial-gradient(120% 100% at 50% -20%, rgba(255,255,255,0.8) 0%, transparent 100%),
        linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 15%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
      `,
    } as const;
  }
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
      background: `
        radial-gradient(circle at 10% 0%, rgba(35, 240, 208, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 90% 0%, rgba(255, 42, 127, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)
      `,
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
  if (mode === "glassmorphism") {
    return {
      background: `
        radial-gradient(circle at 85% 15%, #bae6fd 0%, transparent 35%),
        radial-gradient(circle at 15% 85%, #fbcfe8 0%, transparent 35%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 100 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
      `,
      opacity: 0.4,
      mixBlendMode: "hard-light",
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
  return {
    background: `radial-gradient(80% 55% at 100% 0%, ${accent.value}18 0%, transparent 72%)`,
  } as const;
});

export const cardFrameDecorStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  const borderRadius = `${Math.max(8, radius.value - 10)}px`;
  if (mode === "solid") {
    return {
      inset: "12px",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: `${Math.max(12, radius.value - 6)}px`,
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow:
        "0 8px 30px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
      overflow: "hidden",
    } as const;
  }
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
      border: `1px solid rgba(255, 255, 255, 0.1)`,
      borderRadius: `${Math.max(14, radius.value - 8)}px`,
      background:
        "linear-gradient(180deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.9) 100%)",
      backdropFilter: "blur(12px) saturate(120%)",
      WebkitBackdropFilter: "blur(12px) saturate(120%)",
      boxShadow:
        "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 24px rgba(0,0,0,0.8)",
      overflow: "hidden",
    } as const;
  }
  if (mode === "ticketNote") {
    return {
      inset: "16px",
      border: "none",
      borderRadius: `${Math.max(12, radius.value - 8)}px`,
      background: "#ffffff",
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
  if (mode === "glassmorphism") {
    return {
      inset: "20px",
      border: "1.5px solid rgba(255, 255, 255, 0.6)",
      borderRadius: `${Math.max(16, radius.value - 8)}px`,
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      boxShadow:
        "0 16px 32px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)",
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
  return {
    border: `1px solid ${accent.value}26`,
    borderRadius,
  } as const;
});

export const cardOrnamentStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "solid") {
    return {
      inset: "auto",
      right: "0",
      bottom: "0",
      width: "100%",
      height: "100%",
      background: `
        radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.03) 0%, transparent 60%),
        radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
      `,
      opacity: 0.4,
      mixBlendMode: "overlay",
      borderRadius: "inherit",
      zIndex: 0,
      pointerEvents: "none",
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
      inset: "16px",
      borderRadius: `${Math.max(12, radius.value - 8)}px`,
      background:
        `radial-gradient(circle at 0 88%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `radial-gradient(circle at 100% 88%, ${background.value} 0, ${background.value} 12px, transparent 13px), ` +
        `repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.4) 0, rgba(148, 163, 184, 0.4) 6px, transparent 6px, transparent 14px)`,
      backgroundSize: "auto, auto, 100% 2px",
      backgroundPosition: "left center, right center, center 88%",
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
  if (mode === "glassmorphism") {
    return {
      inset: "auto",
      left: "48px",
      bottom: "6%",
      width: "56px",
      height: "56px",
      borderRadius: "16px",
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z' fill='white'/%3E%3C/svg%3E") no-repeat center center / 24px, linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.1))`,
      backdropFilter: "blur(12px) saturate(180%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      zIndex: 2,
    } as const;
  }
  if (mode === "neonDark") {
    return {
      inset: "auto",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      background: `
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "24px 24px",
      zIndex: 0,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(circle at 50% 0%, black 10%, transparent 80%)",
      WebkitMaskImage:
        "radial-gradient(circle at 50% 0%, black 10%, transparent 80%)",
    } as const;
  }
  return { display: "none" } as const;
});

function getTemplateIconUrl(id: TemplateId, color: string, opacity: number) {
  const map: Record<TemplateId, keyof typeof icons> = {
    A: "format_quote",
    B: "blur_on",
    C: "terminal",
    D: "local_cafe",
    E: "local_activity",
    G: "edit_note",
    I: "push_pin",
    J: "favorite",
    K: "cloudy",
    L: "layers",
    M: "bolt",
    N: "loyalty",
    O: "mood",
    Q: "sailing",
    R: "lens_blur",
  };
  return getIconDataUrl(map[id], color, opacity);
}

export const cardIconStyle = computed(() => {
  const id = selectedTemplate.value.id;
  const mode = selectedTemplate.value.backgroundMode;

  // "暖粉漂流"(warmPink), "叠卡蓝"(stackBlue), "祝福纸"(wishPaper), "票根"(ticketNote) should NOT have icons
  if (
    mode === "warmPink" ||
    mode === "stackBlue" ||
    mode === "wishPaper" ||
    mode === "ticketNote"
  ) {
    return { display: "none" } as const;
  }

  // Decide color and opacity based on template background mode
  let color = accent.value;
  let opacity = 0.08;

  if (isLightText.value) {
    color = "#ffffff";
    opacity = 0.15;
  } else if (mode === "solid" || mode === "notepad") {
    color = accent.value;
    opacity = 0.1;
  }

  const iconUrl = getTemplateIconUrl(id, color, opacity);

  // Decide position based on template id to avoid overlapping with template specific ornaments
  let positionStyle: Record<string, string> = { right: "32px", bottom: "32px" };

  if (mode === "stickyBlue") {
    // TopMeta has dates on right
    positionStyle = { left: "32px", bottom: "32px" };
  } else if (mode === "lilacHang") {
    // Top has hanging hole
    positionStyle = { right: "32px", bottom: "32px" };
  } else if (mode === "glassmorphism") {
    // Bottom left has the svg icon
    positionStyle = { right: "32px", top: "32px" };
  } else if (mode === "notepad") {
    // Top has holes
    positionStyle = { right: "32px", bottom: "32px" };
  } else if (mode === "neonDark") {
    positionStyle = { right: "32px", bottom: "32px" };
  } else if (mode === "mistLilac") {
    positionStyle = { left: "32px", bottom: "32px" };
  } else if (mode === "mintMood") {
    positionStyle = { right: "32px", bottom: "32px" };
  } else {
    // Randomize for others based on ID string to keep it deterministic per template
    // Ensure we only use bottom-left and bottom-right to avoid colliding with top metas (left/right dates etc)
    const posHash = id.charCodeAt(0) % 2;
    switch (posHash) {
      case 0:
        positionStyle = { right: "32px", bottom: "32px" };
        break;
      case 1:
        positionStyle = { left: "32px", bottom: "32px" };
        break;
    }
  }

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
    ...positionStyle,
  } as const;
});

export const cardTopMeta = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;
  if (mode === "stickyBlue") {
    const today = new Date();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const monthStr = months[today.getMonth()];
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    return {
      left: "Sticky Notes",
      right: `${monthStr} ${dd} ${yyyy}`,
      showCenterDot: true,
    };
  }
  if (mode === "wishPaper") {
    return { center: "＼ Best wishes for you ／" };
  }
  if (mode === "mistLilac") {
    return { left: "● ● ●", right: "Text Note" };
  }
  if (mode === "stackBlue") {
    return { left: "• • •", right: "Text Note" };
  }
  if (mode === "neonDark") {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return { left: "@Mood", right: `${mm}-${dd}` };
  }
  if (mode === "ticketNote") {
    return { left: "ADMIT ONE", right: "NO. 0924" };
  }
  if (mode === "lilacHang") {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return { left: "@Mood", right: `${yyyy}.${mm}.${dd}` };
  }
  if (mode === "mintMood") {
    const today = new Date();
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const dayStr = days[today.getDay()];
    return { left: "Mood", right: dayStr };
  }
  if (mode === "warmPink") {
    return { left: "“Note", right: "”" };
  }
  if (mode === "glassmorphism") {
    return { left: "✦ Design", right: "Art &&&" };
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
  if (mode === "glassmorphism") {
    return {
      color: "rgba(31,41,55,0.6)",
      fontWeight: 700,
      letterSpacing: "1px",
    } as const;
  }
  return { color: textColor.value } as const;
});

export const cardBodyStyle = computed(() => {
  const mode = selectedTemplate.value.backgroundMode;

  if (mode === "notepad") {
    return { zIndex: 10, position: "relative" } as const;
  }
  if (mode === "ticketNote") {
    return {
      zIndex: 10,
      position: "relative",
      justifyContent: "center",
      paddingTop: "86px",
      paddingBottom: "86px",
    } as const;
  }
  if (
    mode === "stickyBlue" ||
    mode === "wishPaper" ||
    mode === "mistLilac" ||
    mode === "stackBlue" ||
    mode === "neonDark" ||
    mode === "lilacHang" ||
    mode === "mintMood" ||
    mode === "warmPink" ||
    mode === "glassmorphism"
  ) {
    return {
      zIndex: 10,
      position: "relative",
      justifyContent: "center",
      paddingTop: "86px",
      paddingBottom: "68px",
    } as const;
  }
  return { zIndex: 10, position: "relative" } as const;
});

export const previewScale = computed(() => {
  const w = Math.max(0, previewSize.value.width - 36);
  // 对于多卡片，我们不需要严格限制高度缩放，而是让宽度决定缩放比例
  // 但为了兼容单卡片效果，我们还是可以保留 height 的逻辑，只是多卡片时允许往下滚动
  const h = Math.max(0, previewSize.value.height - 36);
  if (!w || !h) return 1;
  const sx = w / width.value;
  // 如果内容被拆分成了多张卡片，我们就不以容器高度作为缩放限制了，保证卡片宽度充满即可
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
  // Use fit-content to allow the wrapper to organically contain the scaled cards,
  // whose height may now be larger than height.value due to max-content
  return {
    width: "100%",
    height: "fit-content",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
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
      textAlignment.value === "left" &&
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
      textAlignment.value === "left" &&
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
