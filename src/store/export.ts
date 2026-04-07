import { toPng } from "html-to-image";
import { cardRefs, isDownloading, errorMessage, title } from "./state";
import { safeFilename } from "./utils";
export async function downloadPng() {
  errorMessage.value = null;
  const rawNodes = cardRefs.value as unknown;
  const nodes = Array.isArray(rawNodes)
    ? rawNodes.filter(Boolean)
    : rawNodes
      ? [rawNodes as HTMLElement]
      : [];
  if (nodes.length === 0) {
    errorMessage.value = "导出失败：未找到可导出的卡片。";
    return;
  }

  isDownloading.value = true;
  try {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      const suffix = nodes.length > 1 ? `_${i + 1}` : "";
      link.download = `${safeFilename(title.value)}${suffix}.png`;
      link.href = dataUrl;
      link.click();
      if (nodes.length > 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  } catch (e) {
    errorMessage.value = "导出失败：请尝试换一个模板或缩短文字。";
  } finally {
    isDownloading.value = false;
  }
}
