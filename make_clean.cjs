const fs = require('fs');

const storeTs = fs.readFileSync('src/store.ts', 'utf8');

function extractBetween(startStr, endStr) {
  const start = storeTs.indexOf(startStr);
  const end = storeTs.indexOf(endStr, start);
  if (start === -1 || end === -1) return '';
  return storeTs.slice(start, end);
}

// Write background.ts
let bgContent = extractBetween('export const bgTab', 'export const cardRefs');
bgContent = bgContent.replace(/export function formatBytes[\\s\\S]*?\\}\\n/, '');
let bgImports = `import { ref } from "vue";
import { formatBytes } from "./utils";
import { selectedTemplate, background, accent, gradientAngle, activeGradientNode } from "./state";
`;
fs.writeFileSync('src/store/background.ts', bgImports + bgContent);

// Write state.ts
let stateContent = extractBetween('export const selectedTemplateId', 'export const backgroundCss');
// Remove bgTab down to bgDrop
let bgLogic = extractBetween('export const bgTab', 'export const cardRefs');
stateContent = stateContent.replace(bgLogic, '');
// Remove split logic watch
let watchLogic = extractBetween('watch(', 'export const bgTab');
stateContent = stateContent.replace(watchLogic, '');

let chatContent = extractBetween('export const chatMessages', 'export const aiProviderOptions');
let aiStateContent = extractBetween('export const aiProvider = ref', 'export const selectedAiProvider');
aiStateContent += extractBetween('export const selectedAiProvider', 'export function syncAiProviderSettings');

let stateImports = `import { ref, computed } from "vue";
import { templates, aspectPresets, aiProviderOptions } from "./config";
import type { TemplateId, AspectId, SplitRule, ChatMessage, AiProviderId } from "./types";
`;
fs.writeFileSync('src/store/state.ts', stateImports + stateContent + chatContent + aiStateContent);

// Write ai.ts
let aiLogicContent = extractBetween('export function syncAiProviderSettings', 'export function initStore');
aiLogicContent = aiLogicContent.replace(/export function newId[\\s\\S]*?\\}\\n/, '');
aiLogicContent = aiLogicContent.replace(/export function normalizeBaseUrl[\\s\\S]*?\\}\\n/, '');
aiLogicContent = aiLogicContent.replace(/export function chatEndpoint[\\s\\S]*?\\}\\n/, '');

let aiImports = `import { chatMessages, chatInput, isChatLoading, chatError, aiProvider, aiBaseUrl, aiApiKey, aiModel, customAiBaseUrl, isTestingAiConnection, aiTestMessage, aiTestStatus, selectedAiProvider, isCustomAiProvider, title, subtitle, content, watermark } from "./state";
import { normalizeBaseUrl, chatEndpoint, newId } from "./utils";
import type { ChatMessage, AiProviderId } from "./types";
import { aiProviderOptions } from "./config";
`;
fs.writeFileSync('src/store/ai.ts', aiImports + aiLogicContent);

// Write styles.ts
let styleContent = extractBetween('export const backgroundCss', 'export function hexToRgb');
styleContent += extractBetween('export const isLightText', 'export function safeFilename');

let styleImports = `import { computed } from "vue";
import { icons } from "../icons";
import {
  selectedTemplate, background, accent, textColor, textAlignment, width, height, radius, padding,
  splitContents, previewSize
} from "./state";
import { bgTab, gradientAngle, bgOpacityPercent, bgImageUrl } from "./background";
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

console.log('done make_clean');
