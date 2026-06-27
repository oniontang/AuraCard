import { watch } from "vue";
import { marked } from "marked";
import {
  content,
  width,
  height,
  padding,
  title,
  subtitle,
  showWatermark,
  selectedTemplate,
  splitContents,
} from "./state";

// ---- 1. Markdown 标准化 ----

function normalizeMarkdown(raw: string): string {
  let normalized = raw.replace(/\r\n/g, "\n").replace(/ /g, " ");
  normalized = normalized.replace(/[ \t]+\n/g, "\n");
  // 合并非句末换行（在非标点符号后的换行视为段落内折行，用空格替代）
  normalized = normalized.replace(
    /([^\n。！？.!?:：;；])\n(?!\n|#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```)/g,
    "$1 ",
  );
  // 在标题/列表/引用前确保有空行
  normalized = normalized.replace(/([^\n])\n(#{1,6}\s)/g, "$1\n\n$2");
  normalized = normalized.replace(
    /([^\n])\n((?:[-*+]\s|\d+\.\s))/g,
    "$1\n\n$2",
  );
  normalized = normalized.replace(/([^\n])\n(>\s)/g, "$1\n\n$2");
  // 压缩多个空行
  normalized = normalized.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n");
  return normalized.trim();
}

// ---- 2. 高度测量 ----

function createMeasureContainer(
  contentWidth: number,
  contentFontSize: number,
  contentLineHeight: number,
) {
  const el = document.createElement("div");
  el.className = "card__content markdown-body";
  el.style.width = `${contentWidth}px`;
  el.style.fontSize = `${contentFontSize}px`;
  el.style.lineHeight = `${contentLineHeight}`;
  el.style.wordBreak = "break-word";
  el.style.whiteSpace = "pre-wrap";
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  el.style.top = "-9999px";
  el.style.left = "-9999px";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);

  const measure = (md: string): number => {
    el.innerHTML = marked.parse(md) as string;
    el.querySelectorAll("p").forEach((p) => {
      (p as HTMLElement).style.marginTop = "0";
      (p as HTMLElement).style.marginBottom = "12px";
    });
    el.querySelectorAll("p:last-child").forEach((p) => {
      (p as HTMLElement).style.marginBottom = "0";
    });
    el.querySelectorAll("ul, ol").forEach((list) => {
      (list as HTMLElement).style.marginTop = "0";
      (list as HTMLElement).style.marginBottom = "12px";
      (list as HTMLElement).style.paddingLeft = "20px";
    });
    el.querySelectorAll("pre").forEach((pre) => {
      (pre as HTMLElement).style.marginTop = "0";
      (pre as HTMLElement).style.marginBottom = "12px";
      (pre as HTMLElement).style.padding = "12px";
    });
    el.querySelectorAll("img").forEach((img) => {
      if (!img.getAttribute("height")) {
        img.style.height = "200px";
        img.style.display = "block";
        img.style.objectFit = "contain";
      }
    });
    return el.scrollHeight + 36;
  };

  const dispose = () => {
    document.body.removeChild(el);
  };

  return { measure, dispose };
}

// ---- 3. Token 拆分 ----

function splitBySentence(raw: string): string[] {
  return raw.match(/[^。！？.!?\n]+[。！？.!?\n]*/g)?.filter(Boolean) || [raw];
}

function splitByClause(raw: string): string[] {
  return raw.match(/[^，,；;：:\n]+[，,；;：:\n]*/g)?.filter(Boolean) || [raw];
}

function splitByChar(raw: string): string[] {
  return Array.from(raw);
}

function splitTokensIntoPages(
  tokens: ReturnType<typeof marked.lexer>,
  measure: (md: string) => number,
  firstCardAvailableHeight: number,
  baseAvailableHeight: number,
): string[] {
  const cards: string[] = [];
  let currentCard = "";
  let isFirstCard = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let limit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;

    // `---` 手动分页
    if (token.type === "hr") {
      if (currentCard.trim()) cards.push(currentCard.trim());
      currentCard = "";
      isFirstCard = false;
      continue;
    }

    // 标题隐式分页 (H1, H2)
    if (token.type === "heading" && (token.depth === 1 || token.depth === 2)) {
      if (currentCard.trim()) {
        const currentHeight = measure(currentCard);
        const headingHeight = measure(token.raw);
        const shouldSplit =
          currentHeight > limit * 0.42 ||
          currentHeight + headingHeight > limit * 0.88;
        if (shouldSplit) {
          cards.push(currentCard.trim());
          currentCard = "";
          isFirstCard = false;
          limit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;
        }
      }
    }

    // 标题后无足够空间则切页
    let isHeadingWithContent = false;
    if (token.type === "heading" && currentCard.trim().length > 0) {
      let j = i + 1;
      while (j < tokens.length && tokens[j].type === "space") j++;
      if (j < tokens.length) isHeadingWithContent = true;
    }

    if (isHeadingWithContent) {
      const hHeight = measure(currentCard + token.raw);
      if (limit - hHeight < 160) {
        cards.push(currentCard.trim());
        currentCard = "";
        isFirstCard = false;
        limit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;
      }
    }

    if (token.type === "space") continue;

    const testMd = currentCard + token.raw;
    const testHeight = measure(testMd);

    if (testHeight <= limit) {
      currentCard += token.raw;
    } else {
      // Token 放不进当前卡片，检查能否放入新卡片
      if (currentCard.trim().length > 0 && measure(token.raw) <= baseAvailableHeight) {
        cards.push(currentCard.trim());
        currentCard = token.raw;
        isFirstCard = false;
        continue;
      }

      // 大 token 拆分
      if (token.type === "code") {
        const codeLines = token.text.split("\n");
        let chunk = "";
        for (const line of codeLines) {
          const currentLimit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;
          const testCode =
            currentCard +
            (currentCard ? "\n" : "") +
            `\`\`\`${token.lang || ""}\n${chunk + (chunk ? "\n" : "") + line}\n\`\`\``;
          if (measure(testCode) > currentLimit && chunk) {
            currentCard +=
              (currentCard ? "\n" : "") +
              `\`\`\`${token.lang || ""}\n${chunk}\n\`\`\``;
            cards.push(currentCard.trim());
            currentCard = "";
            isFirstCard = false;
            chunk = line;
          } else {
            chunk += (chunk ? "\n" : "") + line;
          }
        }
        if (chunk) {
          currentCard +=
            (currentCard ? "\n" : "") +
            `\`\`\`${token.lang || ""}\n${chunk}\n\`\`\``;
        }
      } else if (token.type === "list") {
        for (let j = 0; j < token.items.length; j++) {
          const item = token.items[j];
          const currentLimit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;
          const testList =
            currentCard + (currentCard.endsWith("\n") ? "" : "\n") + item.raw;
          if (measure(testList) > currentLimit && currentCard.trim()) {
            cards.push(currentCard.trim());
            currentCard = item.raw;
            isFirstCard = false;
          } else {
            currentCard += (currentCard.endsWith("\n") ? "" : "\n") + item.raw;
          }
        }
      } else if (token.type === "paragraph" || token.type === "text") {
        const pushCard = () => {
          if (currentCard.trim().length > 0) {
            cards.push(currentCard.trim());
            currentCard = "";
            isFirstCard = false;
          }
        };

        const tryAppend = (segment: string): boolean => {
          const currentLimit = isFirstCard ? firstCardAvailableHeight : baseAvailableHeight;
          if (measure(currentCard + segment) <= currentLimit) {
            currentCard += segment;
            return true;
          }
          return false;
        };

        const appendGranular = (segment: string) => {
          if (tryAppend(segment)) return;
          pushCard();
          if (tryAppend(segment)) return;
          const clauses = splitByClause(segment);
          if (clauses.length > 1) {
            for (const clause of clauses) appendGranular(clause);
            return;
          }
          const chars = splitByChar(segment);
          for (const char of chars) {
            if (!tryAppend(char)) {
              pushCard();
              if (!tryAppend(char)) {
                currentCard += char;
              }
            }
          }
        };

        const sentences = splitBySentence(token.raw);
        for (const sentence of sentences) {
          appendGranular(sentence);
        }
      } else {
        if (currentCard.trim()) cards.push(currentCard.trim());
        currentCard = token.raw;
        isFirstCard = false;
      }
    }
  }

  if (currentCard.trim()) cards.push(currentCard.trim());
  return cards;
}

// ---- 4. 计算可用高度 ----

function calcAvailableHeight(
  contentWidth: number,
  mode: string,
) {
  const innerHeight = height.value - padding.value * 2;
  const heavyModes = [
    "stickyBlue", "wishPaper", "mistLilac", "stackBlue",
    "neonDark", "lilacHang", "mintMood", "warmPink", "glassmorphism",
  ];
  const hasHeavyBodyInset = heavyModes.includes(mode);
  const baseBodyInset = mode === "ticketNote" ? 172 : hasHeavyBodyInset ? 154 : 40;
  const footerInset = showWatermark.value ? 34 : 10;
  const baseAvailableHeight = innerHeight - baseBodyInset - footerInset;

  let firstCardAvailableHeight = baseAvailableHeight;
  if (title.value) {
    const titleCharsPerLine = Math.max(1, Math.floor(contentWidth / 38));
    const titleLines = Math.ceil((title.value.length || 1) / titleCharsPerLine);
    firstCardAvailableHeight -= titleLines * 52 + 80;
  }
  if (subtitle.value) {
    const subCharsPerLine = Math.max(1, Math.floor(contentWidth / 15));
    const subLines = Math.ceil((subtitle.value.length || 1) / subCharsPerLine);
    firstCardAvailableHeight -= subLines * 28 + 50;
  }
  firstCardAvailableHeight = Math.max(150, firstCardAvailableHeight);

  return { firstCardAvailableHeight, baseAvailableHeight };
}

// ---- 5. 主流程（含 debounce + try/finally） ----

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 250;

export function initSplit() {
  watch(
    [content, width, height, padding, title, subtitle, showWatermark, selectedTemplate],
    () => {
      // Debounce：避免每次按键触发完整重算
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        doSplit();
      }, DEBOUNCE_MS);
    },
    { immediate: true },
  );
}

function doSplit() {
  const text = content.value.trim();
  if (!text) {
    splitContents.value = [""];
    return;
  }

  const normalizedText = normalizeMarkdown(text);
  const contentWidth = width.value - padding.value * 2;
  const contentFontSize =
    contentWidth <= 340 ? 17 : contentWidth <= 420 ? 18 : 20;
  const contentLineHeight = contentWidth <= 340 ? 1.72 : 1.65;
  const mode = selectedTemplate.value.backgroundMode;

  const { firstCardAvailableHeight, baseAvailableHeight } = calcAvailableHeight(
    contentWidth, mode,
  );

  const { measure, dispose } = createMeasureContainer(
    contentWidth, contentFontSize, contentLineHeight,
  );

  try {
    const tokens = marked.lexer(normalizedText);
    const cards = splitTokensIntoPages(
      tokens, measure, firstCardAvailableHeight, baseAvailableHeight,
    );
    splitContents.value = cards.length ? cards : [""];
  } finally {
    dispose(); // P1 #3: 确保测量容器始终被清除
  }
}
