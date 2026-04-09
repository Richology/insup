/**
 * 导出相关类型定义
 */

/** 图片导出选项 */
export interface ImageExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  cropHeight?: number;
  returnDataUrl?: boolean;
}

/** Markdown 源位置信息 */
export interface SourceLocation {
  startLine?: number;
  endLine?: number;
  startOffset?: number;
  endOffset?: number;
}

/** 贴图幻灯片项 */
export interface SlideItem extends SourceLocation {
  html: string;
  sectionId: number;
  pageInGroup: number;
  totalInGroup: number;
  contentHeight?: number;
}

/** 贴图幻灯片预览方法 */
export interface SlidePreviewMethods {
  getSlidesCount: () => number;
  getSlides: () => SlideItem[];
  goToSlide: (index: number) => void;
  getCurrentSlide: () => number;
  goPrev: () => void;
  goNext: () => void;
}

/** 导出进度信息 */
export interface ExportProgress {
  current: number;
  total: number;
}

/** 复制状态 */
export type CopyStatus = 'idle' | 'success' | 'error';
