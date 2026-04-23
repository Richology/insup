/**
 * 编辑器相关类型定义
 */

import { RefObject } from "react";

/** 编辑器实例方法接口 */
export interface EditorMethods {
  getMarkdown: () => string;
  setMarkdown: (md: string) => void;
  insertMarkdown: (text: string) => void;
  insertAtLineStart: (prefix: string) => void;
  wrapSelection: (before: string, after?: string) => void;
  replaceRange: (from: number, to: number, text: string, cursorOffset?: number) => void;
  getSelectionCoords: () => SelectionCoords | null;
}

/** 选区坐标信息 */
export interface SelectionCoords {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** 选区信息 */
export interface SelectionInfo {
  from: number;
  to: number;
  fromLine: number;
  toLine: number;
  text: string;
  empty: boolean;
}

/** 反斜杠菜单触发信息 */
export interface SlashTriggerInfo {
  from: number;
  to: number;
  query: string;
  coords: SelectionCoords | null;
}

/** 编辑器引用类型 */
export type EditorRef = RefObject<EditorMethods | null>;
