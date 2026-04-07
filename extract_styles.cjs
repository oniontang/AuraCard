const fs = require('fs');
const storeTs = fs.readFileSync('src/store.ts', 'utf8');

function extractBetween(startStr, endStr) {
  const start = storeTs.indexOf(startStr);
  const end = storeTs.indexOf(endStr, start);
  if (start === -1 || end === -1) return '';
  return storeTs.slice(start, end);
}

let styleContent = extractBetween('export const backgroundCss', 'export function hexToRgb');
styleContent += extractBetween('export const isLightText', 'export function safeFilename');

let styleImports = `import { computed } from "vue";
import { icons } from "../icons";
import {
  selectedTemplate, background, accent, textColor, textAlignment, width, height, radius, padding,
  splitContents, previewSize
} from "./state";
import { bgTab, gradientAngle, bgOpacityPercent, bgImageUrl } from "./state";
import type { TemplateId } from "./types";
import { hexToRgb, relativeLuminance } from "./utils";

function getIconDataUrl(iconName: keyof typeof icons, color: string, opacity: number = 1) {
  const svg = icons[iconName];
  if (!svg) return "";
  const coloredSvg = svg.replace("<svg ", \`<svg fill="\${color}" opacity="\${opacity}" \`);
  return \`url("data:image/svg+xml,\${encodeURIComponent(coloredSvg)}")\`;
}
`;
fs.writeFileSync('src/store/styles.ts', styleImports + styleContent);
console.log('done extract_styles');