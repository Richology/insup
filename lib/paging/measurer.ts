/**
 * 分页高度测量工具
 */

import type { PagingConfig } from './types';

/** 测量探针容器（全局复用） */
let probeElement: HTMLDivElement | null = null;
let probeContent: HTMLDivElement | null = null;
let styleElement: HTMLStyleElement | null = null;
let currentConfig: PagingConfig | null = null;

/**
 * 初始化测量探针
 */
export function initProbe(themeCSS: string, config: PagingConfig): void {
  currentConfig = config;

  if (!probeElement) {
    styleElement = document.createElement('style');
    probeElement = document.createElement('div');
    probeContent = document.createElement('div');

    document.head.appendChild(styleElement);
    document.body.appendChild(probeElement);
    probeElement.appendChild(probeContent);
  }

  probeElement.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: ${config.contentWidth}px;
    visibility: hidden; pointer-events: none;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0;
  `;

  if (!probeElement || !probeContent || !styleElement) {
    throw new Error('Failed to initialize paging probe.');
  }

  probeContent.id = config.contentSelectorId;

  if (styleElement) {
    styleElement.textContent = themeCSS;
  }
}

/**
 * 清理测量探针
 */
export function cleanupProbe(): void {
  if (probeElement?.parentNode) {
    document.body.removeChild(probeElement);
  }
  if (styleElement?.parentNode) {
    document.head.removeChild(styleElement);
  }
  probeElement = null;
  probeContent = null;
  styleElement = null;
  currentConfig = null;
}

/**
 * 测量节点列表的高度
 */
export async function measureHeight(
  nodes: Node[],
  waitForImage = false
): Promise<number> {
  if (!probeContent || !currentConfig) {
    throw new Error('Probe not initialized. Call initProbe first.');
  }

  probeContent.innerHTML = '';

  const rootId = currentConfig.rootSelectorId ?? 'insup-content';

  const themeWrap = document.createElement('div');
  themeWrap.id = rootId;
  nodes.forEach((node) => themeWrap.appendChild(node.cloneNode(true)));

  const contentWrap = document.createElement('div');
  contentWrap.id = currentConfig.contentSelectorId;
  contentWrap.appendChild(themeWrap);

  const outerWrap = document.createElement('div');
  outerWrap.style.cssText =
    'display: block; width: 100%; border: 1px solid transparent; padding: 0;';
  outerWrap.appendChild(contentWrap);

  probeContent.appendChild(outerWrap);

  if (waitForImage) {
    await waitForImages(probeContent);
  }

  const h = outerWrap.getBoundingClientRect().height;
  return h - 2;
}

/**
 * 等待元素中的图片加载
 */
function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 2000);
        }),
    ),
  ).then(() => undefined);
}
