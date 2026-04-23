"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bold,
  Code2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Sigma,
  Strikethrough,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlashTriggerInfo } from "@/types";

export type SlashFormatCommandId =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "strike"
  | "bold"
  | "italic"
  | "underline"
  | "inline-code"
  | "formula"
  | "bullet-list"
  | "ordered-list"
  | "quote"
  | "code-block"
  | "divider"
  | "link"
  | "table"
  | "image";

interface CommandItem {
  id: SlashFormatCommandId;
  label: string;
  description: string;
  aliases: string[];
  preview: React.ReactNode;
  tooltip?: string;
}

interface SlashFormatMenuProps {
  trigger: SlashTriggerInfo | null;
  onClose: () => void;
  onSelect: (commandId: SlashFormatCommandId) => void;
}

interface VisibleItem extends CommandItem {
  groupTitle: string;
  flatIndex: number;
}

const previewBoxClass =
  "flex h-10 items-center justify-center text-zinc-500";
const paragraphIconFrameClass =
  "flex h-6 w-6 items-center justify-center";

const COMMAND_GROUPS: { title: string; items: CommandItem[] }[] = [
  {
    title: "标题",
    items: [
      {
        id: "heading-1",
        label: "H1",
        description: "一级标题",
        aliases: ["h1", "heading", "title", "标题1"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H1</span></div>,
      },
      {
        id: "heading-2",
        label: "H2",
        description: "二级标题",
        aliases: ["h2", "heading", "subtitle", "标题2"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H2</span></div>,
      },
      {
        id: "heading-3",
        label: "H3",
        description: "三级标题",
        aliases: ["h3", "heading", "标题3"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H3</span></div>,
      },
      {
        id: "heading-4",
        label: "H4",
        description: "四级标题",
        aliases: ["h4", "heading", "标题4"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H4</span></div>,
      },
      {
        id: "heading-5",
        label: "H5",
        description: "五级标题",
        aliases: ["h5", "heading", "标题5"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H5</span></div>,
      },
      {
        id: "heading-6",
        label: "H6",
        description: "六级标题",
        aliases: ["h6", "heading", "标题6"],
        preview: <div className={cn(previewBoxClass, "text-[18px] font-semibold tracking-tight")}><span>H6</span></div>,
      },
    ],
  },
  {
    title: "行内样式",
    items: [
      {
        id: "strike",
        label: "删除线",
        description: "插入 ~~文本~~",
        aliases: ["delete", "strike", "strikethrough", "删除"],
        preview: <div className={cn(previewBoxClass, "text-[18px]")}><Strikethrough className="size-5.5 stroke-[2.2]" /></div>,
      },
      {
        id: "bold",
        label: "加粗",
        description: "插入 **文本**",
        aliases: ["bold", "strong", "粗体"],
        preview: <div className={cn(previewBoxClass, "text-[20px] font-bold")}><Bold className="size-5.5 stroke-[2.2]" /></div>,
      },
      {
        id: "italic",
        label: "斜体",
        description: "插入 *文本*",
        aliases: ["italic", "em", "斜"],
        preview: <div className={cn(previewBoxClass, "text-[18px] italic")}><Italic className="size-5.5 stroke-[2.2]" /></div>,
      },
      {
        id: "underline",
        label: "下划线",
        description: "插入 <u>文本</u>",
        aliases: ["underline", "u", "下划"],
        preview: <div className={cn(previewBoxClass, "text-[18px] underline underline-offset-4")}><Underline className="size-5.5 stroke-[2.2]" /></div>,
      },
      {
        id: "inline-code",
        label: "行内代码",
        description: "插入 `code`",
        aliases: ["code", "inline", "代码"],
        preview: <div className={cn(previewBoxClass, "font-mono text-[18px]")}><Code2 className="size-5.5 stroke-[2.2]" /></div>,
      },
      {
        id: "formula",
        label: "公式",
        description: "插入 $公式$",
        aliases: ["math", "latex", "equation", "公式"],
        preview: <div className={cn(previewBoxClass, "text-[18px]")}><Sigma className="size-5.5 stroke-[2.2]" /></div>,
      },
  ],
  },
  {
    title: "段落",
    items: [
      {
        id: "bullet-list",
        label: "无序列表",
        description: "插入 - 列表项",
        aliases: ["list", "bullet", "ul", "无序"],
        tooltip: "无序列表",
        preview: (
          <div className={previewBoxClass}>
            <div className={cn(paragraphIconFrameClass, "flex-col gap-1 text-zinc-500")}>
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex w-full items-center gap-1">
                  <span className="size-1.5 rounded-full bg-current" />
                  <span className="h-px flex-1 bg-current/70" />
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "ordered-list",
        label: "有序列表",
        description: "插入 1. 列表项",
        aliases: ["ordered", "numbered", "ol", "有序"],
        tooltip: "有序列表",
        preview: (
          <div className={previewBoxClass}>
            <div className={cn(paragraphIconFrameClass, "flex-col gap-1 text-zinc-500")}>
              {["1", "2", "3"].map((item) => (
                <div key={item} className="flex w-full items-center gap-1">
                  <span className="w-2 text-center text-[8px] font-semibold leading-none">{item}</span>
                  <span className="h-px flex-1 bg-current/70" />
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "quote",
        label: "引用",
        description: "插入 > 引用文本",
        aliases: ["quote", "blockquote", "引用块"],
        tooltip: "引用",
        preview: (
          <div className={previewBoxClass}>
            <div className={cn(paragraphIconFrameClass, "items-center gap-1")}>
              <div className="h-full w-1 rounded-full bg-zinc-300" />
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-1.5 rounded-full bg-zinc-300" />
                <div className="h-1.5 w-4/5 rounded-full bg-zinc-200" />
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "code-block",
        label: "代码块",
        description: "插入 fenced code block",
        aliases: ["codeblock", "snippet", "代码块"],
        tooltip: "代码块",
        preview: (
          <div className={previewBoxClass}>
            <div className={paragraphIconFrameClass}>
              <Code2 className="size-5.5 stroke-[2.2]" />
            </div>
          </div>
        ),
      },
      {
        id: "divider",
        label: "分隔线",
        description: "插入 ---",
        aliases: ["divider", "hr", "separator", "分割线"],
        tooltip: "分隔线",
        preview: (
          <div className={previewBoxClass}>
            <div className={cn(paragraphIconFrameClass, "flex-col gap-1")}>
              <div className="h-px w-full bg-zinc-400" />
              <div className="h-px w-full bg-zinc-400" />
              <div className="h-px w-full bg-zinc-400" />
            </div>
          </div>
        ),
      },
      {
        id: "link",
        label: "链接",
        description: "插入 [文本](url)",
        aliases: ["link", "url", "超链接"],
        tooltip: "链接",
        preview: <div className={cn(previewBoxClass, "text-[18px]")}><div className={paragraphIconFrameClass}><LinkIcon className="size-5.5 stroke-[2.2]" /></div></div>,
      },
      {
        id: "table",
        label: "表格",
        description: "插入 2 列表格",
        aliases: ["table", "grid", "表"],
        tooltip: "表格",
        preview: (
          <div className={previewBoxClass}>
            <div className={cn(paragraphIconFrameClass, "grid grid-cols-3 gap-1")}>
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="size-1.5 rounded-[2px] border border-zinc-300 bg-zinc-50" />
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "image",
        label: "图片",
        description: "插入 ![alt](url)",
        aliases: ["image", "img", "picture", "图像"],
        tooltip: "图片",
        preview: <div className={cn(previewBoxClass, "text-[18px]")}><div className={paragraphIconFrameClass}><ImageIcon className="size-5.5 stroke-[2.2]" /></div></div>,
      },
    ],
  },
];

export function SlashFormatMenu({
  trigger,
  onClose,
  onSelect,
}: SlashFormatMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const normalizedQuery = trigger?.query.trim().toLowerCase() ?? "";
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const visibleGroups = React.useMemo(() => {
    const groups: { title: string; items: VisibleItem[] }[] = [];
    let flatIndex = 0;

    COMMAND_GROUPS.forEach((group) => {
      const items = group.items
        .filter((item) => {
          if (!normalizedQuery) return true;
          const haystack = [item.label, item.description, ...item.aliases]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        })
        .map((item) => ({
          ...item,
          groupTitle: group.title,
          flatIndex: flatIndex++,
        }));

      if (items.length > 0) {
        groups.push({ title: group.title, items });
      }
    });

    return groups;
  }, [normalizedQuery]);

  const visibleItems = React.useMemo(
    () => visibleGroups.flatMap((group) => group.items),
    [visibleGroups],
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    setSelectedIndex(0);
    setHoveredIndex(null);
  }, [normalizedQuery, trigger?.from, trigger?.to]);

  React.useEffect(() => {
    if (!visibleItems.length) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((current) => Math.min(current, visibleItems.length - 1));
  }, [visibleItems]);

  React.useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedIndex]);

  React.useEffect(() => {
    if (!trigger) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (!visibleItems.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % visibleItems.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => (current - 1 + visibleItems.length) % visibleItems.length);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        onSelect(visibleItems[selectedIndex].id);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onSelect, selectedIndex, trigger, visibleItems]);

  if (!trigger?.coords) return null;

  const panelWidth = 438;
  const centerX = trigger.coords.left + Math.max(trigger.coords.width, 16) / 2;
  const left = Math.max(12, centerX - panelWidth / 2);
  const top = trigger.coords.top + trigger.coords.height + 12;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        style={{ top, left, width: "min(438px, calc(100% - 24px))" }}
        className="absolute z-[140] overflow-hidden rounded-[18px] border border-zinc-200/90 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
      >
        <div className="max-h-[400px] overflow-y-auto px-4 py-4">
          {visibleGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center">
              <div className="text-sm font-medium text-zinc-700">没有匹配项</div>
              <div className="mt-2 text-xs text-zinc-400">继续输入其他关键词，或按 `Esc` 关闭</div>
            </div>
          ) : (
            visibleGroups.map((group, index) => (
              <section
                key={group.title}
                className={cn(index < visibleGroups.length - 1 && "mb-4")}
              >
                <div className="mb-1.5 text-[13px] font-medium text-zinc-400">
                  {group.title}
                </div>
                <div className="mb-2.5 h-px bg-zinc-300/90" />
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
                  {group.items.map((item) => {
                    const isSelected = item.flatIndex === selectedIndex;
                    const showTooltip =
                      hoveredIndex === item.flatIndex ||
                      (hoveredIndex === null && isSelected && item.tooltip);

                    return (
                      <button
                        key={item.id}
                        ref={(node) => {
                          itemRefs.current[item.flatIndex] = node;
                        }}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => {
                          setSelectedIndex(item.flatIndex);
                          setHoveredIndex(item.flatIndex);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                          "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-left transition",
                          isSelected
                            ? "bg-sky-100/70 text-zinc-900"
                            : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-700",
                        )}
                      >
                        {showTooltip ? (
                          <div className="pointer-events-none absolute -top-11 left-1/2 z-10 -translate-x-1/2">
                            <div className="relative whitespace-nowrap rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
                              {item.tooltip ?? item.label}
                              <div className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-zinc-800" />
                            </div>
                          </div>
                        ) : null}
                        {item.preview}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
