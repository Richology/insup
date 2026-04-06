"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Loader2, X } from "lucide-react";
import type { EditorMethods, SelectionInfo } from "./mdx-editor";
import { getReadInfo } from "@/lib/utils-content";

const MDXEditor = dynamic(() => import("./mdx-editor"), { ssr: false });

interface EditorSectionProps {
  layoutMode: string;
  markdown: string;
  setMarkdown: (md: string) => void;
  editorRef: React.RefObject<EditorMethods | null>;
  onPaste: (e: React.ClipboardEvent | ClipboardEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFile: (file: File) => void;
  isUploading: boolean;
  styleTheme: string;
  toolbar?: React.ReactNode;
  floatingToolbar?: React.ReactNode;
  onSelectionChange?: (info: SelectionInfo) => void;
  onInsertPageBreak?: () => void;
  onPushHistory?: () => void;
}

export const EditorSection = ({
  layoutMode,
  markdown,
  setMarkdown,
  editorRef,
  onPaste,
  onFileUpload,
  onImageFile,
  isUploading,
  styleTheme,
  toolbar,
  floatingToolbar,
  onSelectionChange,
  onInsertPageBreak,
  onPushHistory,
}: EditorSectionProps) => {
  const { wordCount, readTime } = getReadInfo(markdown);
  const [showPageBreakTip, setShowPageBreakTip] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("insup-hide-pagebreak-tip") !== "1";
  });

  const handleCloseTip = () => {
    setShowPageBreakTip(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("insup-hide-pagebreak-tip", "1");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex flex-col bg-white rounded-none border border-zinc-900/10 shadow-2xl shadow-zinc-200/50 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-visible relative",
        layoutMode === "split"
          ? "flex-1"
          : layoutMode === "edit"
            ? "w-full max-w-5xl mx-auto"
            : "w-0 opacity-0 pointer-events-none p-0"
      )}
    >
      {toolbar}

      <div
        className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar px-10 py-10"
        onDrop={(e) => {
          e.preventDefault();
          Array.from(e.dataTransfer.files).forEach(onImageFile);
        }}
        onPaste={onPaste}
      >
        {styleTheme !== "wechat" && showPageBreakTip && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            <div className="flex items-center justify-between gap-3">
              <p className="leading-6">
                输入 <code className="rounded bg-white px-1.5 py-0.5 text-zinc-900">&lt;!--pagebreak--&gt;</code> 可强制分页。
              </p>
              <button
                type="button"
                onClick={() => onInsertPageBreak?.()}
                className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
              >
                插入分页符
              </button>
              <button
                type="button"
                onClick={handleCloseTip}
                className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                aria-label="关闭提示"
                title="关闭并不再显示"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        <input
          id="md-import-input"
          type="file"
          accept=".md,.markdown"
          className="hidden"
          onChange={onFileUpload}
        />
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={setMarkdown}
          onPaste={onPaste}
          onSelectionChange={onSelectionChange}
          onPushHistory={onPushHistory}
        />
        {floatingToolbar}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900/5 bg-zinc-50 px-8 py-3 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            文档统计
          </span>
          {isUploading && (
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-zinc-900 shadow-sm ring-1 ring-zinc-200 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              <span>Processing Media</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200/80">
            {wordCount} 字
          </div>
          <div className="rounded-full bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200/80">
            约 {readTime} 分钟阅读
          </div>
        </div>
      </div>
    </motion.section>
  );
};
