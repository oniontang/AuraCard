/**
 * 模板视觉注册表 — 每种 backgroundMode 的所有视觉属性集中在一个对象中。
 * 替代 styles.ts 中 11 个 computed 属性里分散的 if/else 链。
 * 新增模板只需在此文件添加一个条目即可。
 */
import { icons } from "../icons";
import type { TemplateId } from "./types";

type StyleObj = Record<string, string | number>;

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

/** 模板图标映射 */
const templateIconMap: Record<TemplateId, keyof typeof icons> = {
  A: "format_quote", B: "blur_on", C: "terminal", D: "local_cafe",
  E: "local_activity", G: "edit_note", I: "push_pin", J: "favorite",
  K: "cloudy", L: "layers", M: "bolt", N: "loyalty", O: "mood",
  Q: "sailing", R: "lens_blur",
};

export interface ModeVisuals {
  /** 背景 CSS 生成函数 (bg, accent, angle) => css */
  backgroundCss: (bg: string, accent: string, angle: number) => string;
  /** 装饰层样式 */
  decorationStyle: StyleObj;
  /** 内框装饰样式 */
  frameDecorStyle: StyleObj;
  /** 特殊装饰 (票根孔洞、挂卡孔、blob 等) */
  ornamentStyle: StyleObj;
  /** 是否在纯色 tab 下使用纯色（而非 mode 默认渐变） */
  solidOverride?: string;
  /** 是否需要顶部元信息栏 */
  hasTopMeta: boolean;
  /** 顶部元信息内容生成 */
  topMeta: () => {
    left?: string; right?: string; center?: string; showCenterDot?: boolean;
  };
  /** 顶部元信息样式 */
  topMetaStyle: StyleObj;
  /** 正文区域内边距 */
  bodyInset: { top: number; bottom: number; justifyCenter: boolean };
  /** 是否隐藏模板图标 */
  hideIcon: boolean;
  /** 图标定位 */
  iconPosition: Record<string, string>;
  /** 遮罩层样式 */
  scrimStyle: StyleObj;
  /** 标题是否需要左侧强调线 */
  titleBorder: boolean;
}

// ---- 辅助函数 ----

const today = () => new Date();

const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

const solidBg = (bg: string) =>
  `radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.04) 0%, transparent 50%), ${bg}`;

const gradientBg = (bg: string, accent: string, angle: number) =>
  `linear-gradient(${angle}deg, ${bg}, ${accent})`;

const noOrnament = { display: "none" } as const;
const transparentScrim = { background: "transparent" } as const;

function lightScrim(isLight: boolean): StyleObj {
  const base = isLight ? "rgba(0, 0, 0, 0.30)" : "rgba(255, 255, 255, 0.42)";
  return { background: base };
}

function bodyInset(top: number, bottom: number, justifyCenter = true) {
  return { top, bottom, justifyCenter };
}

// ---- 注册表 ----

export const modeVisuals: Record<string, ModeVisuals> = {
  solid: {
    backgroundCss: (bg) => solidBg(bg),
    decorationStyle: {
      background: `
        radial-gradient(120% 100% at 50% -20%, rgba(255,255,255,0.8) 0%, transparent 100%),
        linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 15%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
      `,
    },
    frameDecorStyle: {
      inset: "12px",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "",
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
      overflow: "hidden",
    },
    ornamentStyle: {
      inset: "auto", right: "0", bottom: "0",
      width: "100%", height: "100%",
      background: `radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.03) 0%, transparent 60%),
        radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      opacity: 0.4, mixBlendMode: "overlay", borderRadius: "inherit", zIndex: 0, pointerEvents: "none",
    },
    hasTopMeta: false,
    topMeta: () => ({ left: "", right: "", center: "", showCenterDot: false }),
    topMetaStyle: {},
    bodyInset: bodyInset(40, 44),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: {},
    titleBorder: true,
  },

  gradient: {
    backgroundCss: (bg, accent, angle) => gradientBg(bg, accent, angle),
    decorationStyle: {
      background: `radial-gradient(70% 50% at 10% 0%, var(--accent-placeholder)33 0%, transparent 70%), radial-gradient(60% 45% at 100% 90%, var(--text-placeholder)20 0%, transparent 72%)`,
    },
    frameDecorStyle: { border: "1px solid rgba(0,0,0,0.06)", borderRadius: "" },
    ornamentStyle: noOrnament,
    hasTopMeta: false,
    topMeta: () => ({ left: "", right: "", center: "", showCenterDot: false }),
    topMetaStyle: {},
    bodyInset: bodyInset(40, 44),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: {},
    titleBorder: true,
  },

  stickyBlue: {
    backgroundCss: (bg) => `linear-gradient(180deg, #b3eeff 0%, ${bg} 100%)`,
    solidOverride: "linear-gradient(180deg, #b3eeff 0%, var(--bg) 100%)",
    decorationStyle: {
      background: `radial-gradient(95% 12% at 50% 0%, rgba(255, 255, 255, 0.65) 0%, transparent 100%), linear-gradient(180deg, var(--accent-placeholder)1a 14%, transparent 14%)`,
    },
    frameDecorStyle: {
      inset: "22px",
      border: "1px solid var(--accent-placeholder)2a",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.98)",
      boxShadow: "0 10px 24px rgba(56, 189, 248, 0.2)",
    },
    ornamentStyle: {
      inset: "24px",
      borderRadius: "",
      background: `repeating-linear-gradient(180deg, transparent 0, transparent 52px, var(--accent-placeholder)22 52px, var(--accent-placeholder)22 53px)`,
    },
    hasTopMeta: true,
    topMeta: () => {
      const d = today();
      const mm = months[d.getMonth()];
      const dd = String(d.getDate()).padStart(2, "0");
      return { left: "Sticky Notes", right: `${mm} ${dd} ${d.getFullYear()}`, showCenterDot: true };
    },
    topMetaStyle: { color: "#356789", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { left: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  wishPaper: {
    backgroundCss: (bg) =>
      `repeating-linear-gradient(120deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 16px), linear-gradient(180deg, #fff9dc 0%, ${bg} 100%)`,
    decorationStyle: {
      background: `radial-gradient(16% 14% at 78% 74%, #fb923c 0%, #fb923c 65%, transparent 66%), radial-gradient(14% 12% at 86% 76%, #fde047 0%, #fde047 66%, transparent 67%), radial-gradient(10% 9% at 80% 72%, #f87171 0%, #f87171 68%, transparent 69%), radial-gradient(2.5% 2.5% at 18% 82%, #fdba7490 0%, #fdba7490 98%, transparent 99%), radial-gradient(2.5% 2.5% at 12% 90%, #fde68a90 0%, #fde68a90 98%, transparent 99%), radial-gradient(5% 5% at 46% 82%, #f59e0b77 0%, transparent 70%)`,
    },
    frameDecorStyle: {
      border: "1px solid var(--accent-placeholder)33",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.06)",
    },
    ornamentStyle: noOrnament,
    hasTopMeta: true,
    topMeta: () => ({ center: "＼ Best wishes for you ／" }),
    topMetaStyle: { color: "#f59e0b", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: true,
    iconPosition: {},
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  mistLilac: {
    backgroundCss: (bg) =>
      `radial-gradient(80% 70% at 30% 100%, #dbe6ff99 0%, transparent 65%), radial-gradient(60% 45% at 95% 0%, #ddd6fe88 0%, transparent 70%), linear-gradient(180deg, #ffffff 0%, ${bg} 100%)`,
    decorationStyle: {
      background: `radial-gradient(65% 45% at 15% 100%, #bfdbfe6b 0%, transparent 72%), radial-gradient(45% 35% at 100% 0%, #ddd6fe73 0%, transparent 72%)`,
    },
    frameDecorStyle: {
      border: "1px solid rgba(196, 181, 253, 0.5)",
      borderRadius: "",
      background: "rgba(255,255,255,0.35)",
    },
    ornamentStyle: noOrnament,
    hasTopMeta: true,
    topMeta: () => ({ left: "● ● ●", right: "Text Note" }),
    topMetaStyle: { color: "#c4b5fd", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { left: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  stackBlue: {
    backgroundCss: (bg) => `linear-gradient(180deg, #1ea7ff 0%, ${bg} 100%)`,
    solidOverride: "linear-gradient(180deg, #1ea7ff 0%, var(--bg) 100%)",
    decorationStyle: {
      background: `radial-gradient(70% 10% at 50% 100%, rgba(255,255,255,0.18) 0%, transparent 95%)`,
    },
    frameDecorStyle: {
      inset: "18px",
      border: "1px solid var(--accent-placeholder)44",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.99)",
      boxShadow: "8px 12px 0 rgba(160, 225, 255, 0.95)",
    },
    ornamentStyle: {
      inset: "30px 26px 22px 26px",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.93)",
      transform: "rotate(-3.2deg)",
      boxShadow: "0 14px 26px rgba(14, 116, 144, 0.2)",
    },
    hasTopMeta: true,
    topMeta: () => ({ left: "• • •", right: "Text Note" }),
    topMetaStyle: { color: "#1ea7ff", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: true,
    iconPosition: {},
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  neonDark: {
    backgroundCss: (bg) =>
      `radial-gradient(90% 55% at 50% 12%, rgba(35, 240, 208, 0.08) 0%, transparent 72%), linear-gradient(180deg, #08090f 0%, ${bg} 100%)`,
    decorationStyle: {
      background: `
        radial-gradient(circle at 10% 0%, rgba(35, 240, 208, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 90% 0%, rgba(255, 42, 127, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)
      `,
    },
    frameDecorStyle: {
      inset: "16px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "",
      background: "linear-gradient(180deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.9) 100%)",
      backdropFilter: "blur(12px) saturate(120%)",
      WebkitBackdropFilter: "blur(12px) saturate(120%)",
      boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 24px rgba(0,0,0,0.8)",
      overflow: "hidden",
    },
    ornamentStyle: {
      inset: "auto", left: "0", top: "0",
      width: "100%", height: "100%",
      background: `linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
      zIndex: 0, pointerEvents: "none",
      maskImage: "radial-gradient(circle at 50% 0%, black 10%, transparent 80%)",
      WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 10%, transparent 80%)",
    },
    hasTopMeta: true,
    topMeta: () => {
      const d = today();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return { left: "@Mood", right: `${mm}-${dd}` };
    },
    topMetaStyle: { color: "rgba(255,255,255,0.9)", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  ticketNote: {
    backgroundCss: (bg) => bg,
    decorationStyle: { background: "transparent" },
    frameDecorStyle: {
      inset: "16px",
      border: "none",
      borderRadius: "",
      background: "#ffffff",
    },
    ornamentStyle: {
      inset: "16px",
      borderRadius: "",
      background: "",
      backgroundSize: "auto, auto, 100% 2px",
      backgroundPosition: "left center, right center, center 88%",
      backgroundRepeat: "no-repeat",
    },
    hasTopMeta: true,
    topMeta: () => ({ left: "ADMIT ONE", right: "NO. 0924" }),
    topMetaStyle: { color: "rgba(15, 23, 42, 0.4)", fontWeight: 700, letterSpacing: "1px" },
    bodyInset: bodyInset(172, 126, false),
    hideIcon: true,
    iconPosition: {},
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  lilacHang: {
    backgroundCss: (bg) => `linear-gradient(180deg, #c9a7ff 0%, ${bg} 100%)`,
    solidOverride: "linear-gradient(180deg, #c9a7ff 0%, var(--bg) 100%)",
    decorationStyle: {
      background: `radial-gradient(95% 80% at 80% 10%, rgba(255,255,255,0.45) 0%, transparent 72%), radial-gradient(40% 32% at 50% 88%, rgba(184, 139, 255, 0.12) 0%, transparent 84%)`,
    },
    frameDecorStyle: {
      inset: "16px",
      border: "2px solid rgba(183, 138, 255, 0.6)",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.98)",
      boxShadow: "0 12px 28px rgba(124, 58, 237, 0.2)",
    },
    ornamentStyle: {
      inset: "auto",
      top: "24px", left: "50%",
      width: "72px", height: "11px",
      transform: "translateX(-50%)",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.8)",
    },
    hasTopMeta: true,
    topMeta: () => {
      const d = today();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return { left: "@Mood", right: `${yyyy}.${mm}.${dd}` };
    },
    topMetaStyle: { color: "rgba(120, 90, 180, 0.6)", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  mintMood: {
    backgroundCss: (bg) =>
      `radial-gradient(75% 120% at 50% -5%, rgba(255,255,255,0.34) 0%, transparent 72%), repeating-linear-gradient(135deg, rgba(16,185,129,0.06) 0, rgba(16,185,129,0.06) 3px, transparent 3px, transparent 12px), linear-gradient(180deg, #9ce8b0 0%, ${bg} 100%)`,
    decorationStyle: {
      background: `radial-gradient(42% 12% at 50% 56%, var(--accent-placeholder)70 0%, transparent 90%), radial-gradient(85% 55% at 90% 100%, rgba(16, 185, 129, 0.15) 0%, transparent 84%)`,
    },
    frameDecorStyle: {
      inset: "20px",
      border: "1px solid rgba(255,255,255,0.72)",
      borderRadius: "",
      background: "rgba(236, 255, 241, 0.96)",
      boxShadow: "0 10px 22px rgba(16, 185, 129, 0.2)",
    },
    ornamentStyle: noOrnament,
    hasTopMeta: true,
    topMeta: () => {
      const d = today();
      return { left: "Mood", right: days[d.getDay()] };
    },
    topMetaStyle: { color: "#5f9c70", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  warmPink: {
    backgroundCss: (bg) =>
      `radial-gradient(80% 45% at 25% 0%, rgba(255,255,255,0.22) 0%, transparent 78%), linear-gradient(180deg, #ffa8c7 0%, ${bg} 100%)`,
    decorationStyle: {
      background: `radial-gradient(26% 18% at 15% 20%, rgba(255,255,255,0.22) 0%, transparent 80%), radial-gradient(34% 24% at 72% 86%, rgba(236, 72, 153, 0.2) 0%, transparent 85%)`,
    },
    frameDecorStyle: {
      border: "1px solid rgba(255,255,255,0.36)",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.05)",
    },
    ornamentStyle: {
      inset: "auto",
      right: "24px", bottom: "26px",
      width: "132px", height: "132px",
      borderRadius: "38% 62% 56% 44% / 44% 35% 65% 56%",
      background: "linear-gradient(140deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.1) 75%)",
      transform: "rotate(-18deg)",
      boxShadow: "0 14px 26px rgba(190, 24, 93, 0.2)",
    },
    hasTopMeta: true,
    topMeta: () => ({ left: '"Note', right: '"' }),
    topMetaStyle: { color: "rgba(255,255,255,0.45)", fontWeight: 700 },
    bodyInset: bodyInset(154, 102),
    hideIcon: true,
    iconPosition: {},
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  glassmorphism: {
    backgroundCss: (bg) =>
      `radial-gradient(circle at 15% 15%, rgba(255, 200, 220, 0.8) 0%, transparent 78%), radial-gradient(circle at 85% 85%, ${bg} 0%, transparent 50%), linear-gradient(135deg, #e0f2fe 0%, #fce7f3 100%)`,
    decorationStyle: {
      background: `
        radial-gradient(circle at 85% 15%, #bae6fd 0%, transparent 35%),
        radial-gradient(circle at 15% 85%, #fbcfe8 0%, transparent 35%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 100 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
      `,
      opacity: 0.4,
      mixBlendMode: "hard-light",
    },
    frameDecorStyle: {
      inset: "20px",
      border: "1.5px solid rgba(255, 255, 255, 0.6)",
      borderRadius: "",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      boxShadow: "0 16px 32px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)",
    },
    ornamentStyle: {
      inset: "auto",
      left: "48px", bottom: "6%",
      width: "56px", height: "56px",
      borderRadius: "16px",
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z' fill='white'/%3E%3C/svg%3E") no-repeat center center / 24px, linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.1))`,
      backdropFilter: "blur(12px) saturate(180%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      zIndex: 2,
    },
    hasTopMeta: true,
    topMeta: () => ({ left: "✦ Design", right: "Art &&&" }),
    topMetaStyle: { color: "rgba(31,41,55,0.6)", fontWeight: 700, letterSpacing: "1px" },
    bodyInset: bodyInset(154, 102),
    hideIcon: false,
    iconPosition: { right: "32px", top: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: false,
  },

  notepad: {
    backgroundCss: (bg, accent) =>
      `linear-gradient(90deg, transparent 44px, ${accent}55 44px, ${accent}55 46px, transparent 46px), repeating-linear-gradient(180deg, transparent 0, transparent 31px, ${accent}22 31px, ${accent}22 32px), linear-gradient(180deg, ${bg}, ${bg})`,
    decorationStyle: {
      background: `repeating-radial-gradient(circle at 24px 14px, var(--accent-placeholder)40 0, var(--accent-placeholder)40 2px, transparent 2px, transparent 20px), linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%)`,
    },
    frameDecorStyle: {
      inset: "0",
      border: "1px solid rgba(255, 255, 255, 0.56)",
      borderRadius: "inherit",
      background: "rgba(255, 255, 255, 0.24)",
      backdropFilter: "blur(10px) saturate(130%)",
      WebkitBackdropFilter: "blur(10px) saturate(130%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72), 0 14px 30px var(--accent-placeholder)14",
    },
    ornamentStyle: noOrnament,
    hasTopMeta: false,
    topMeta: () => ({ left: "", right: "", center: "", showCenterDot: false }),
    topMetaStyle: {},
    bodyInset: bodyInset(40, 44),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: transparentScrim,
    titleBorder: true,
  },

  darkGrid: {
    backgroundCss: (bg) =>
      `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 32px), linear-gradient(180deg, ${bg}, ${bg})`,
    decorationStyle: {
      background: `radial-gradient(80% 55% at 100% 0%, var(--accent-placeholder)18 0%, transparent 72%)`,
    },
    frameDecorStyle: { border: "1px solid var(--accent-placeholder)26", borderRadius: "" },
    ornamentStyle: noOrnament,
    hasTopMeta: false,
    topMeta: () => ({ left: "", right: "", center: "", showCenterDot: false }),
    topMetaStyle: {},
    bodyInset: bodyInset(40, 44),
    hideIcon: false,
    iconPosition: { right: "32px", bottom: "32px" },
    scrimStyle: {},
    titleBorder: true,
  },
};

/** 构建模式下包含 accent 占位符的样式对象 */
export function resolveModeStyle(
  style: StyleObj,
  accent: string,
  radius: number,
): StyleObj {
  const resolved: StyleObj = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "string") {
      resolved[key] = value
        .replace(/var\(--accent-placeholder\)/g, accent)
        .replace(/var\(--text-placeholder\)/g, "#111827");
    } else {
      resolved[key] = value;
    }
  }
  // 动态替换 borderRadius 占位符
  if (resolved.borderRadius === "") {
    resolved.borderRadius = `${Math.max(8, radius - 10)}px`;
  }
  return resolved;
}

/** 获取模板图标数据 URL */
export function getTemplateIconUrl(id: TemplateId, color: string, opacity: number) {
  const iconName = templateIconMap[id];
  if (!iconName) return "";
  return getIconDataUrl(iconName, color, opacity);
}
