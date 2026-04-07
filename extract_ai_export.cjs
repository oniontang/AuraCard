const fs = require('fs');
const storeTs = fs.readFileSync('src/store.ts', 'utf8');

function extractBetween(startStr, endStr) {
  const start = storeTs.indexOf(startStr);
  const end = storeTs.indexOf(endStr, start);
  if (start === -1 || end === -1) return '';
  return storeTs.slice(start, end);
}

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

let exportCode = `import { toPng } from "html-to-image";
import { cardRefs, isDownloading, errorMessage, title } from "./state";
import { safeFilename } from "./utils";
`;
exportCode += extractBetween('export async function downloadPng', 'export type ChatRole');
fs.writeFileSync('src/store/export.ts', exportCode);
console.log('done ai & export');