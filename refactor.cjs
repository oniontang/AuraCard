const fs = require('fs');

let state = fs.readFileSync('src/store/state.ts', 'utf8');

// remove background logic
const bgStart = state.indexOf('export function swapColors() {');
const bgEnd = state.indexOf('export const cardRefs', bgStart);
if (bgStart !== -1 && bgEnd !== -1) {
  const bgCode = state.slice(bgStart, bgEnd);
  state = state.slice(0, bgStart) + state.slice(bgEnd);
  let background = fs.readFileSync('src/store/background.ts', 'utf8');

  // remove duplicate formatBytes in background.ts
  const formatStart = background.indexOf('export function formatBytes(');
  const formatEnd = background.indexOf('export function setBgFile(', formatStart);
  if (formatStart !== -1 && formatEnd !== -1) {
    background = background.slice(0, formatStart) + background.slice(formatEnd);
  }
  
  // prepend bgCode
  background = `import { background, accent, gradientAngle, activeGradientNode } from "./state";\n` + bgCode + background;
  fs.writeFileSync('src/store/background.ts', background);
}

// Extract split logic to split.ts
const watchStart = state.indexOf('watch(');
const watchEnd = state.indexOf('export type BgTab', watchStart);
if (watchStart !== -1 && watchEnd !== -1) {
  const watchCode = state.slice(watchStart, watchEnd);
  state = state.slice(0, watchStart) + state.slice(watchEnd);
  const splitCode = `import { watch } from "vue";
import { marked } from "marked";
import { content, width, height, padding, title, subtitle, selectedTemplateId, splitRule, splitDelimiter, splitCharCount, splitContents } from "./state";

export function initSplit() {
  ${watchCode}
}
`;
  fs.writeFileSync('src/store/split.ts', splitCode);
}

// Remove safeFilename, formatBytes, hexToRgb, etc. from state.ts if they are there
const utilsToRemove = [
  { start: 'export function hexToRgb', end: 'export const isLightText' },
  { start: 'export function relativeLuminance', end: 'export const isLightText' },
  { start: 'export function safeFilename', end: 'export async function downloadPng' },
  { start: 'export function newId', end: 'export function setChatError' },
  { start: 'export function normalizeBaseUrl', end: 'export function chatEndpoint' },
  { start: 'export function chatEndpoint', end: 'export function newId' },
];
utilsToRemove.forEach(u => {
  const s = state.indexOf(u.start);
  if (s !== -1) {
    const e = state.indexOf(u.end, s);
    if (e !== -1) {
      state = state.slice(0, s) + state.slice(e);
    }
  }
});

fs.writeFileSync('src/store/state.ts', state);
console.log('done');