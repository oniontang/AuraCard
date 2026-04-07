export type TemplateId = "A" | "B" | "C" | "D" | "E" | "G" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "Q" | "R";

export type TemplateConfig = {
  id: TemplateId;
  name: string;
  defaultBackground: string;
  defaultText: string;
  defaultAccent: string;
  defaultRadius: number;
  defaultPadding: number;
  alignment: "left" | "center";
  border: boolean;
  shadow: boolean;
  backgroundMode: "solid" | "gradient" | "notepad" | "stickyBlue" | "wishPaper" | "mistLilac" | "stackBlue" | "darkGrid" | "neonDark" | "ticketNote" | "lilacHang" | "mintMood" | "warmPink" | "glassmorphism";
};

export type AspectId = "3:4" | "1:1" | "5:7" | "9:16";
export type AspectPreset = {
  id: AspectId;
  label: string;
  w: number;
  h: number;
};

export type BgTab = "solid" | "gradient" | "image";

export type ChatRole = "user" | "assistant";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type AiProviderId = "openrouter" | "openai" | "deepseek" | "qwen" | "custom";
export type AiModelKind = "text" | "vision" | "image";
export type AiModelOption = { value: string; label: string; kind: AiModelKind };
export type AiProviderOption = {
  id: AiProviderId;
  name: string;
  description: string;
  baseUrl: string;
  apiKeyPlaceholder: string;
  models: AiModelOption[];
};
