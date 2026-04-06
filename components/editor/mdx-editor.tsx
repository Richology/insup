"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { cn } from "@/lib/utils";
import type { EditorMethods, SelectionInfo } from "@/types";

export type { EditorMethods, SelectionInfo } from "@/types";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onPaste?: (e: ClipboardEvent) => void;
  onSelectionChange?: (info: SelectionInfo) => void;
  onPushHistory?: () => void;
  className?: string;
  isXHSTheme?: boolean;
}

// 自定义亮色主题
const insupEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    backgroundColor: "transparent",
  },
  ".cm-content": {
    padding: "24px 32px 80px",
    caretColor: "#6366f1",
    lineHeight: "1.75",
  },
  ".cm-line": {
    padding: "0",
  },
  ".cm-focused": {
    outline: "none",
  },
  ".cm-editor.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "#d1d5db",
    paddingRight: "8px",
    minWidth: "40px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "#9ca3af",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(99,102,241,0.04)",
    borderRadius: "4px",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "#e0e7ff !important",
  },
  // Markdown 语法高亮
  ".cm-heading": { fontWeight: "700", color: "#1e1b4b" },
  ".cm-heading1": { fontSize: "1.3em", color: "#312e81" },
  ".cm-heading2": { fontSize: "1.15em", color: "#3730a3" },
  ".cm-strong": { fontWeight: "700", color: "#1f2937" },
  ".cm-emphasis": { fontStyle: "italic", color: "#374151" },
  ".cm-link": { color: "#6366f1", textDecoration: "underline" },
  ".cm-url": { color: "#818cf8" },
  ".cm-quote": { color: "#6b7280", borderLeft: "3px solid #e5e7eb", paddingLeft: "8px" },
  ".cm-monospace": { fontFamily: 'Consolas, "Courier New", monospace', backgroundColor: "rgba(99,102,241,0.08)", borderRadius: "3px", padding: "0 3px", color: "#e06c75" },
});

const EditorWrapper = forwardRef<EditorMethods, EditorProps>(
  ({ markdown: initialMarkdown, onChange, onPaste, onSelectionChange, onPushHistory, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const onPushHistoryRef = useRef(onPushHistory);
    const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedContentRef = useRef<string>(initialMarkdown);
    const suppressExternalSyncRef = useRef(false);

    onChangeRef.current = onChange;
    onPushHistoryRef.current = onPushHistory;

    const clampPos = (pos: number, length: number) =>
      Math.max(0, Math.min(pos, length));

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      getMarkdown: () => viewRef.current?.state.doc.toString() ?? "",
      setMarkdown: (md: string) => {
        const view = viewRef.current;
        if (!view) return;
        const current = view.state.doc.toString();
        if (current === md) return;
        const nextLength = md.length;
        const { anchor, head } = view.state.selection.main;
        view.dispatch({
          changes: { from: 0, to: current.length, insert: md },
          selection: {
            anchor: clampPos(anchor, nextLength),
            head: clampPos(head, nextLength),
          },
        });
      },
      insertMarkdown: (text: string) => {
        const view = viewRef.current;
        if (!view) return;
        const docLength = view.state.doc.length;
        const { from: rawFrom, to: rawTo } = view.state.selection.main;
        const from = clampPos(rawFrom, docLength);
        const to = clampPos(rawTo, docLength);
        const nextLength = docLength - (to - from) + text.length;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: clampPos(from + text.length, nextLength) },
        });
        view.focus();
      },
      insertAtLineStart: (prefix: string) => {
        const view = viewRef.current;
        if (!view) return;
        const docLength = view.state.doc.length;
        const { from: rawFrom } = view.state.selection.main;
        const from = clampPos(rawFrom, docLength);
        const line = view.state.doc.lineAt(from);
        const nextLength = docLength + prefix.length;
        view.dispatch({
          changes: { from: line.from, to: line.from, insert: prefix },
          selection: {
            anchor: clampPos(from + prefix.length, nextLength),
          },
        });
        view.focus();
      },
      wrapSelection: (before: string, after = before) => {
        const view = viewRef.current;
        if (!view) return;
        const docLength = view.state.doc.length;
        const { from: rawFrom, to: rawTo } = view.state.selection.main;
        const from = clampPos(rawFrom, docLength);
        const to = clampPos(rawTo, docLength);
        const selected = view.state.doc.sliceString(from, to);
        const insert = before + selected + after;
        const nextLength = docLength - (to - from) + insert.length;
        view.dispatch({
          changes: { from, to, insert },
          selection: {
            anchor: clampPos(from + before.length, nextLength),
            head: clampPos(from + before.length + selected.length, nextLength),
          },
        });
        view.focus();
      },
      getSelectionCoords: () => {
        const view = viewRef.current;
        if (!view || !containerRef.current) return null;
        const sel = view.state.selection.main;
        if (sel.empty) return null;
        
        try {
          const startCoords = view.coordsAtPos(sel.from);
          const endCoords = view.coordsAtPos(sel.to);
          if (!startCoords) return null;
          
          const parentRect = containerRef.current.getBoundingClientRect();
          const right = endCoords?.right ?? startCoords.right;
          const left = Math.min(startCoords.left, endCoords?.left ?? startCoords.left);
          const top = Math.min(startCoords.top, endCoords?.top ?? startCoords.top);
          const bottom = Math.max(startCoords.bottom, endCoords?.bottom ?? startCoords.bottom);
          const width = Math.max(0, right - left);

          return {
            top: top - parentRect.top,
            left: left - parentRect.left,
            width,
            height: (bottom - top) || 20
          };
        } catch {
          return null;
        }
      }
    }));

    // 初始化 CodeMirror
    useEffect(() => {
      if (!containerRef.current) return;

      const state = EditorState.create({
        doc: initialMarkdown,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          insupEditorTheme,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              const isExternalSync = suppressExternalSyncRef.current;
              suppressExternalSyncRef.current = false;

              if (!isExternalSync) {
                onChangeRef.current(newContent);
              } else {
                lastSavedContentRef.current = newContent;
              }

              // 防抖历史记录：用户停止输入 800ms 后记录
              if (!isExternalSync && onPushHistoryRef.current) {
                if (historyTimeoutRef.current) {
                  clearTimeout(historyTimeoutRef.current);
                }
                historyTimeoutRef.current = setTimeout(() => {
                  if (newContent !== lastSavedContentRef.current) {
                    onPushHistoryRef.current?.();
                    lastSavedContentRef.current = newContent;
                  }
                }, 800);
              }
            }
            if (update.selectionSet || update.docChanged) {
              const sel = update.state.selection.main;
              onSelectionChange?.({
                from: sel.from,
                to: sel.to,
                fromLine: update.state.doc.lineAt(sel.from).number,
                toLine: update.state.doc.lineAt(sel.to).number,
                text: update.state.doc.sliceString(sel.from, sel.to),
                empty: sel.empty
              });
            }
          }),
          EditorView.domEventHandlers({
            paste(event) {
              if (onPaste) {
                onPaste(event);
              }
            }
          })
        ],
      });

      const view = new EditorView({ state, parent: containerRef.current });
      viewRef.current = view;

      return () => {
        // 组件卸载时，如果有待保存的历史记录，立即保存
        if (historyTimeoutRef.current) {
          clearTimeout(historyTimeoutRef.current);
          if (viewRef.current && onPushHistoryRef.current) {
            const currentContent = viewRef.current.state.doc.toString();
            if (currentContent !== lastSavedContentRef.current) {
              onPushHistoryRef.current();
            }
          }
        }
        view.destroy();
        viewRef.current = null;
      };
      // 只初始化一次
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;

      const currentDoc = view.state.doc.toString();
      if (currentDoc === initialMarkdown) return;

      const docLength = view.state.doc.length;
      const nextLength = initialMarkdown.length;
      const { anchor, head } = view.state.selection.main;

      suppressExternalSyncRef.current = true;
      view.dispatch({
        changes: { from: 0, to: docLength, insert: initialMarkdown },
        selection: {
          anchor: clampPos(anchor, nextLength),
          head: clampPos(head, nextLength),
        },
      });
    }, [initialMarkdown]);

    return (
      <div
        ref={containerRef}
        className={cn("mdx-editor-container h-full w-full overflow-auto no-scrollbar", className)}
      />
    );
  }
);

EditorWrapper.displayName = "MarkdownEditor";

export default EditorWrapper;
