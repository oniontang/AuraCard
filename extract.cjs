const fs = require('fs');

const storeTs = fs.readFileSync('src/store.ts', 'utf8');

function extract(startStr, endStr) {
  const start = storeTs.indexOf(startStr);
  const end = storeTs.indexOf(endStr, start);
  return storeTs.slice(start, end + endStr.length);
}

const templates = extract('export const templates: TemplateConfig[] = [', '];');
const aspectPresets = extract('export const aspectPresets: AspectPreset[] = [', '];');
const colorSwatches = extract('export const colorSwatches = [', '];');
const aiProviderOptions = extract('export const aiProviderOptions: AiProviderOption[] = [', '];');

const configTs = `import { TemplateConfig, AspectPreset, AiProviderOption } from './types';\n\n${templates}\n\n${aspectPresets}\n\n${colorSwatches}\n\n${aiProviderOptions}\n`;

fs.writeFileSync('src/store/config.ts', configTs);

function extractBetween(startStr, endStr) {
  const start = storeTs.indexOf(startStr);
  const end = storeTs.indexOf(endStr, start);
  if (end === -1) return storeTs.slice(start);
  return storeTs.slice(start, end);
}

let content = extractBetween('export const selectedTemplateId', 'export const backgroundCss');
const chatStateStart = 'export const chatMessages = ref<ChatMessage[]>([';
const chatStateEnd = 'export const aiProviderOptions';
let chatContent = extractBetween(chatStateStart, chatStateEnd);

const aiStateStart = 'export const aiProvider = ref<AiProviderId>("openrouter");';
const aiStateEnd = 'export function syncAiProviderSettings';
let aiContent = extractBetween(aiStateStart, aiStateEnd);

const stateTs = `import { ref, computed } from "vue";
import { templates, aspectPresets, aiProviderOptions } from "./config";
import type { TemplateId, AspectId, BgTab, SplitRule, ChatMessage, AiProviderId } from "./types";

${content}

${chatContent}

${aiContent}
`;

fs.writeFileSync('src/store/state.ts', stateTs);

console.log("Done");