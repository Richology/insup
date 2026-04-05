/**
 * 贴图分页类型定义
 */

export interface PagingConfig {
  contentWidth: number;
  contentHeight: number;
  contentSelectorId: string;
  rootSelectorId?: string;
}

/** 分页块项 */
export interface PagingBlockItem {
  html: string;
  sectionId: number;
  pageInGroup: number;
  totalInGroup: number;
}

/** DOM 节点 */
export type DOMNode = Node;

/** 元素节点 */
export type DOMElement = Element;
