import { background, accent, gradientAngle, activeGradientNode, bgImageUrl, bgImageName, bgImageSizeText, isBgDragging, bgFileInputRef } from "./state";
import { formatBytes } from "./utils";

export function swapColors() {
  const temp = background.value;
  background.value = accent.value;
  accent.value = temp;
}

export function rotateGradient() {
  gradientAngle.value = (gradientAngle.value + 45) % 360;
}

export function updateActiveGradientColor(color: string) {
  if (activeGradientNode.value === "background") {
    background.value = color;
  } else {
    accent.value = color;
  }
}

export function openBgPicker() {
  bgFileInputRef.value?.click();
}

export function setBgFile(file: File) {
  if (!file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    bgImageUrl.value = e.target?.result as string;
    bgImageName.value = file.name;
    bgImageSizeText.value = formatBytes(file.size);
  };
  reader.readAsDataURL(file);
}

export function onPickBgImage(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  setBgFile(file);
  input.value = "";
}

export function clearBgImage() {
  bgImageUrl.value = null;
  bgImageName.value = null;
  bgImageSizeText.value = null;
}

export function onBgDragEnter() {
  isBgDragging.value = true;
}

export function onBgDragLeave(e: DragEvent) {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) {
    isBgDragging.value = false;
    return;
  }
  const next = e.relatedTarget as Node | null;
  if (!next || !el.contains(next)) isBgDragging.value = false;
}

export function onBgDrop(e: DragEvent) {
  isBgDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  setBgFile(file);
}
