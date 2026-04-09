"use client";

interface CanvasContentCssOptions {
  themeCSS: string;
  contentId: string;
  fontValue?: string;
  baseFontSize: number;
  lineHeight: number;
  paragraphLineHeight: number;
  blockSpacingEm: number;
  contentHeight: number;
  imageMaxRatio: number;
  codeMaxRatio: number;
  additionalCss?: string;
}

export function buildCanvasContentCSS({
  themeCSS,
  contentId,
  fontValue,
  baseFontSize,
  lineHeight,
  paragraphLineHeight,
  blockSpacingEm,
  contentHeight,
  imageMaxRatio,
  codeMaxRatio,
  additionalCss = "",
}: CanvasContentCssOptions): string {
  const contentSelector = `#${contentId}`;
  const adjustedCSS = themeCSS.replace(/#insup-content/g, contentSelector);
  const fontFamilyRule = fontValue ? `font-family: ${fontValue} !important;` : "";

  return `
    ${adjustedCSS}
    ${contentSelector} {
      ${fontFamilyRule}
      font-size: ${baseFontSize}px;
      line-height: ${lineHeight};
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      outline: none !important;
      backdrop-filter: none !important;
      padding: 0 !important;
      margin: 0 !important;
      min-height: auto !important;
      height: auto !important;
      display: block !important;
      overflow: visible !important;
      color: inherit;
    }
    ${contentSelector} #insup-content {
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      outline: none !important;
      backdrop-filter: none !important;
    }
    ${contentSelector} #insup-content > * {
      margin-top: 0 !important;
      margin-bottom: ${blockSpacingEm}em !important;
    }
    ${contentSelector} #insup-content > *:last-child {
      margin-bottom: 0 !important;
    }
    ${contentSelector} #insup-content h1,
    ${contentSelector} #insup-content h2,
    ${contentSelector} #insup-content h3 {
      margin-top: 0.3em !important;
      margin-bottom: 0.35em !important;
      line-height: 1.2 !important;
      text-align: inherit !important;
    }
    ${contentSelector} #insup-content p::first-letter {
      float: none !important;
      font-size: inherit !important;
      line-height: inherit !important;
      margin: 0 !important;
      font-weight: inherit !important;
      color: inherit !important;
    }
    ${contentSelector} #insup-content p {
      margin: 0.35em 0 !important;
      line-height: ${paragraphLineHeight} !important;
      text-indent: 0 !important;
    }
    ${contentSelector} img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0.7em 0;
      border-radius: 12px;
      max-height: ${Math.floor(contentHeight * imageMaxRatio)}px;
      object-fit: contain;
    }
    ${contentSelector} pre {
      overflow-x: auto;
      padding: 12px;
      border-radius: 10px;
      margin: 0.8em 0;
      font-size: 13px;
      max-height: ${Math.floor(contentHeight * codeMaxRatio)}px;
    }
    ${contentSelector} blockquote {
      margin: 0.8em 0;
      padding: 12px 16px;
      border-left: 3px solid currentColor;
      opacity: 0.85;
    }
    ${contentSelector} h1,
    ${contentSelector} h2,
    ${contentSelector} h3,
    ${contentSelector} blockquote,
    ${contentSelector} pre,
    ${contentSelector} img,
    ${contentSelector} ul,
    ${contentSelector} ol,
    ${contentSelector} table {
      break-inside: avoid;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    ${contentSelector} p,
    ${contentSelector} li {
      break-inside: auto;
    }
    ${additionalCss}
  `;
}
