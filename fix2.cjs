const fs = require('fs');

let state = fs.readFileSync('src/store/state.ts', 'utf8');

// remove aspectPresets and aiProviderOptions
function removeBetween(startStr, endStr) {
  const start = state.indexOf(startStr);
  if (start === -1) return;
  const end = state.indexOf(endStr, start);
  if (end !== -1) {
    state = state.slice(0, start) + state.slice(end + endStr.length);
  }
}

removeBetween('export type AspectId', '];\n');
removeBetween('export type SplitRule', 'by-char-count";\n');
removeBetween('export type BgTab =', ';\n');
removeBetween('export type ChatRole =', '};\n');
removeBetween('export type AiProviderId =', '];\n');

fs.writeFileSync('src/store/state.ts', state);
console.log('done state');