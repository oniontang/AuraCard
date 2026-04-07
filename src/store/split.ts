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

export function initSplit() {
  watch(
    [
      content,
      width,
      height,
      padding,
      title,
      subtitle,
      showWatermark,
      selectedTemplate,
    ],
    () => {
      const applyBuiltInLayoutSkill = (raw: string) => {
        let normalized = raw.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ");
        normalized = normalized.replace(/[ \t]+\n/g, "\n");
        normalized = normalized.replace(
          /([^\n。！？.!?:：;；])\n(?!\n|#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```)/g,
          "$1",
        );
        normalized = normalized.replace(/([^\n])\n(#{1,6}\s)/g, "$1\n\n$2");
        normalized = normalized.replace(
          /([^\n])\n((?:[-*+]\s|\d+\.\s))/g,
          "$1\n\n$2",
        );
        normalized = normalized.replace(/([^\n])\n(>\s)/g, "$1\n\n$2");
        normalized = normalized.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n");
        return normalized.trim();
      };

      const text = content.value.trim();
      if (!text) {
        splitContents.value = [""];
        return;
      }
      const normalizedText = applyBuiltInLayoutSkill(text);

      const contentWidth = width.value - padding.value * 2;
      const contentFontSize =
        contentWidth <= 340 ? 17 : contentWidth <= 420 ? 18 : 20;
      const contentLineHeight = contentWidth <= 340 ? 1.72 : 1.65;
      const innerHeight = height.value - padding.value * 2;
      const mode = selectedTemplate.value.backgroundMode;
      const hasHeavyBodyInset =
        mode === "stickyBlue" ||
        mode === "wishPaper" ||
        mode === "mistLilac" ||
        mode === "stackBlue" ||
        mode === "neonDark" ||
        mode === "lilacHang" ||
        mode === "mintMood" ||
        mode === "warmPink" ||
        mode === "glassmorphism";
      const baseBodyInset =
        mode === "ticketNote" ? 172 : hasHeavyBodyInset ? 154 : 40;
      const footerInset = showWatermark.value ? 34 : 10;
      const baseAvailableHeight = innerHeight - baseBodyInset - footerInset;

      let firstCardAvailableHeight = baseAvailableHeight;
      if (title.value) {
        const titleCharsPerLine = Math.max(1, Math.floor(contentWidth / 38));
        const titleLines = Math.ceil(
          (title.value.length || 1) / titleCharsPerLine,
        );
        // 给大标题额外预留充足的 margin buffer，并适当增加预估行高系数
        firstCardAvailableHeight -= titleLines * 52 + 80;
      }
      if (subtitle.value) {
        const subCharsPerLine = Math.max(1, Math.floor(contentWidth / 15));
        const subLines = Math.ceil(
          (subtitle.value.length || 1) / subCharsPerLine,
        );
        // 给副标题额外预留充足的 margin buffer
        firstCardAvailableHeight -= subLines * 28 + 50;
      }
      firstCardAvailableHeight = Math.max(150, firstCardAvailableHeight);

      const measureContainer = document.createElement("div");
      measureContainer.className = "card__content markdown-body";
      measureContainer.style.width = `${contentWidth}px`;
      measureContainer.style.fontSize = `${contentFontSize}px`;
      measureContainer.style.lineHeight = `${contentLineHeight}`;
      measureContainer.style.wordBreak = "break-word";
      measureContainer.style.whiteSpace = "pre-wrap";
      measureContainer.style.position = "absolute";
      measureContainer.style.visibility = "hidden";
      measureContainer.style.top = "-9999px";
      measureContainer.style.left = "-9999px";
      measureContainer.style.pointerEvents = "none";
      document.body.appendChild(measureContainer);

      const measureMarkdown = (md: string) => {
        measureContainer.innerHTML = marked.parse(md) as string;
        measureContainer.querySelectorAll("p").forEach((el) => {
          (el as HTMLElement).style.marginTop = "0";
          (el as HTMLElement).style.marginBottom = "12px";
        });
        measureContainer.querySelectorAll("p:last-child").forEach((el) => {
          (el as HTMLElement).style.marginBottom = "0";
        });
        measureContainer.querySelectorAll("ul, ol").forEach((el) => {
          (el as HTMLElement).style.marginTop = "0";
          (el as HTMLElement).style.marginBottom = "12px";
          (el as HTMLElement).style.paddingLeft = "20px";
        });
        measureContainer.querySelectorAll("pre").forEach((el) => {
          (el as HTMLElement).style.marginTop = "0";
          (el as HTMLElement).style.marginBottom = "12px";
          (el as HTMLElement).style.padding = "12px";
        });
        // 获取所有图片并强制设置它们的高度，防止因为异步加载导致的测量高度塌陷
        const images = measureContainer.querySelectorAll("img");
        images.forEach((img) => {
          if (!img.getAttribute("height")) {
            // 给未加载的图片一个默认预估高度，防止拆分时高度漏算导致最后溢出
            img.style.height = "200px";
            img.style.display = "block";
            img.style.objectFit = "contain";
          }
        });
        return measureContainer.scrollHeight + 36;
      };

      const splitBySentence = (raw: string) =>
        raw.match(/[^。！？.!?\n]+[。！？.!?\n]*/g)?.filter(Boolean) || [raw];
      const splitByClause = (raw: string) =>
        raw.match(/[^，,；;：:\n]+[，,；;：:\n]*/g)?.filter(Boolean) || [raw];
      const splitByChar = (raw: string) => Array.from(raw);

      const tokens = marked.lexer(normalizedText);
      const cards: string[] = [];
      let currentCard = "";
      let isFirstCard = true;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let limit = isFirstCard
          ? firstCardAvailableHeight
          : baseAvailableHeight;

        // Explicit manual split via horizontal rule (---)
        if (token.type === "hr") {
          if (currentCard.trim()) cards.push(currentCard.trim());
          currentCard = "";
          isFirstCard = false;
          continue;
        }

        // Implicit semantic split via top-level headings (H1, H2)
        if (
          token.type === "heading" &&
          (token.depth === 1 || token.depth === 2)
        ) {
          if (currentCard.trim()) {
            const currentHeight = measureMarkdown(currentCard);
            const headingHeight = measureMarkdown(token.raw);
            const shouldSplitByHeading =
              currentHeight > limit * 0.42 ||
              currentHeight + headingHeight > limit * 0.88;
            if (shouldSplitByHeading) {
              cards.push(currentCard.trim());
              currentCard = "";
              isFirstCard = false;
              limit = isFirstCard
                ? firstCardAvailableHeight
                : baseAvailableHeight;
            }
          }
        }

        let isHeadingWithContent = false;
        if (token.type === "heading" && currentCard.trim().length > 0) {
          let j = i + 1;
          while (j < tokens.length && tokens[j].type === "space") j++;
          if (j < tokens.length) isHeadingWithContent = true;
        }

        if (isHeadingWithContent) {
          const hHeight = measureMarkdown(currentCard + token.raw);
          // 当标题后面的空间小于 160px 时（原来是 120），直接把这个标题切到下一页去
          if (limit - hHeight < 160) {
            cards.push(currentCard.trim());
            currentCard = "";
            isFirstCard = false;
            limit = isFirstCard
              ? firstCardAvailableHeight
              : baseAvailableHeight;
          }
        }

        if (token.type === "space") {
          continue;
        }

        const testMarkdown = currentCard + token.raw;
        const testHeight = measureMarkdown(testMarkdown);

        if (testHeight <= limit) {
          currentCard += token.raw;
        } else {
          // Token doesn't fit. Check if it fits on a new card.
          if (
            currentCard.trim().length > 0 &&
            measureMarkdown(token.raw) <= baseAvailableHeight
          ) {
            cards.push(currentCard.trim());
            currentCard = token.raw;
            isFirstCard = false;
            continue;
          }

          // Split logic for large tokens
          if (token.type === "code") {
            const codeLines = token.text.split("\n");
            let chunk = "";
            for (const line of codeLines) {
              const currentLimit = isFirstCard
                ? firstCardAvailableHeight
                : baseAvailableHeight;
              const testCode =
                currentCard +
                (currentCard ? "\n" : "") +
                `\`\`\`${token.lang || ""}\n${chunk + (chunk ? "\n" : "") + line}\n\`\`\``;
              if (measureMarkdown(testCode) > currentLimit && chunk) {
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
            if (chunk)
              currentCard +=
                (currentCard ? "\n" : "") +
                `\`\`\`${token.lang || ""}\n${chunk}\n\`\`\``;
          } else if (token.type === "list") {
            for (let j = 0; j < token.items.length; j++) {
              const item = token.items[j];
              const currentLimit = isFirstCard
                ? firstCardAvailableHeight
                : baseAvailableHeight;
              const testList =
                currentCard +
                (currentCard.endsWith("\n") ? "" : "\n") +
                item.raw;
              if (
                measureMarkdown(testList) > currentLimit &&
                currentCard.trim()
              ) {
                cards.push(currentCard.trim());
                currentCard = item.raw;
                isFirstCard = false;
              } else {
                currentCard +=
                  (currentCard.endsWith("\n") ? "" : "\n") + item.raw;
              }
            }
          } else if (token.type === "paragraph" || token.type === "text") {
            const pushCurrentCard = () => {
              if (currentCard.trim().length > 0) {
                cards.push(currentCard.trim());
                currentCard = "";
                isFirstCard = false;
              }
            };
            const tryAppend = (segment: string) => {
              const currentLimit = isFirstCard
                ? firstCardAvailableHeight
                : baseAvailableHeight;
              if (measureMarkdown(currentCard + segment) <= currentLimit) {
                currentCard += segment;
                return true;
              }
              return false;
            };
            const appendWithGranularity = (segment: string) => {
              if (tryAppend(segment)) return;
              pushCurrentCard();
              if (tryAppend(segment)) return;
              const clauses = splitByClause(segment);
              if (clauses.length > 1) {
                for (const clause of clauses) appendWithGranularity(clause);
                return;
              }
              const chars = splitByChar(segment);
              for (const char of chars) {
                if (!tryAppend(char)) {
                  pushCurrentCard();
                  if (!tryAppend(char)) {
                    currentCard += char;
                  }
                }
              }
            };

            const sentences = splitBySentence(token.raw);
            for (const sentence of sentences) {
              appendWithGranularity(sentence);
            }
          } else {
            if (currentCard.trim()) cards.push(currentCard.trim());
            currentCard = token.raw;
            isFirstCard = false;
          }
        }
      }

      if (currentCard.trim()) cards.push(currentCard.trim());

      document.body.removeChild(measureContainer);
      splitContents.value = cards.length ? cards : [""];
    },
    { immediate: true },
  );
}
