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
