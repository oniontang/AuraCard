import DOMPurify from 'dompurify'

/**
 * 净化 HTML 字符串，防止 XSS 攻击。
 * 允许常见的 Markdown 渲染标签（p, h1-h3, ul, ol, li, pre, code, blockquote, a, strong, em, table 等），
 * 移除所有事件处理器、javascript: 协议和危险的 DOM 操作属性。
 */
const SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'pre', 'code', 'blockquote',
    'a', 'strong', 'em', 'del', 's', 'mark', 'sub', 'sup',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'span', 'div', 'section', 'del',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'width', 'height'],
  ALLOW_DATA_ATTR: false,
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button'],
}

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG) as string
}

export function hexToRgb(hex: string) {
  const normalized = hex.trim().toLowerCase();
  const m = normalized.match(/^#([0-9a-f]{6})$/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function relativeLuminance(rgb: { r: number; g: number; b: number }) {
  const toLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function safeFilename(raw: string) {
  const trimmed = raw.trim() || "card";
  return trimmed.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
}

export function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function normalizeBaseUrl(raw: string) {
  return raw.trim().replace(/\/$/, "");
}

export function chatEndpoint(baseUrl: string) {
  const base = normalizeBaseUrl(baseUrl);
  if (!base) return "";
  if (base.endsWith("/v1")) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}
