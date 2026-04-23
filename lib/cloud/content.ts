import { getCleanText } from "@/lib/utils-content";

export function deriveContentTitle(markdown: string) {
  const headingMatch = markdown.match(/^#\s+(.+)$/m);
  if (headingMatch?.[1]) {
    return getCleanText(headingMatch[1]).slice(0, 80) || "未命名文档";
  }

  const firstLine = getCleanText(markdown)
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine?.slice(0, 80) || "未命名文档";
}

export function buildContentSummary(markdown: string, maxLength = 120) {
  const text = getCleanText(markdown).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
