/**
 * InSup 公众号主题系统
 * 根选择器统一用 #insup-content，CSS 只写标签选择器，主题间只改颜色/字体差异
 */

export interface WechatTheme {
  id: string;
  name: string;
  description: string;
  /** 预览区注入的 <style> 内容，根选择器为 #insup-content */
  css: string;
  /** 复制时包裹容器的 inline style */
  containerStyle: string;
  /** 预览色块的颜色/渐变 */
  preview: string;
}

// 所有主题共用的基础结构样式（标签选择器，挂在 #insup-content 下）
const BASE_CSS = `
  #insup-content, #insup-content * { box-sizing: border-box; }
  #insup-content { 
    font-size: 15px; 
    line-height: 1.8; 
    word-break: break-word; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }
  #insup-content h1 { font-size: 24px; font-weight: 700; margin: 1.8em 0 1em; line-height: 1.3; }
  #insup-content h2 { font-size: 20px; font-weight: 700; margin: 1.8em 0 0.8em; line-height: 1.3; }
  #insup-content h3 { font-size: 18px; font-weight: 700; margin: 1.6em 0 0.6em; line-height: 1.3; }
  #insup-content h4, #insup-content h5, #insup-content h6 { font-size: 16px; font-weight: 700; margin: 1.4em 0 0.5em; }
  #insup-content p { margin: 1em 0; line-height: 1.75; }
  #insup-content ul, #insup-content ol { padding-left: 1.8em; margin: 1em 0; }
  #insup-content li { margin: 0.5em 0; line-height: 1.75; }
  #insup-content blockquote { margin: 1.5em 0; padding: 12px 20px; font-style: normal; border-radius: 0 8px 8px 0; }
  #insup-content blockquote p { margin: 0.5em 0; }
  #insup-content blockquote p:first-child { margin-top: 0; }
  #insup-content blockquote p:last-child { margin-bottom: 0; }
  #insup-content strong { font-weight: 700; }
  #insup-content em { font-style: italic; }
  #insup-content a { text-decoration: none; }
  #insup-content hr { border: none; margin: 2.5em 0; }
  #insup-content img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 12px; }
  #insup-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 14.5px; }
  #insup-content th { font-weight: 700; padding: 10px 14px; text-align: left; }
  #insup-content td { padding: 10px 14px; }
  #insup-content code { font-size: 85%; padding: 0.2em 0.4em; border-radius: 4px; font-family: Consolas, "Courier New", monospace; }
  #insup-content pre { margin: 1.5em 0; border-radius: 10px; overflow: hidden; }
  #insup-content pre code { display: block; padding: 1.2em; font-size: 13px; line-height: 1.6; }
  #insup-content kbd { display: inline-block; padding: 2px 6px; font-size: 12px; font-family: Consolas, "Courier New", monospace; line-height: 1.4; color: #444; background: #f6f8fa; border: 1px solid #d0d7de; border-bottom-width: 2px; border-radius: 4px; }
  #insup-content input[type="checkbox"] { margin-right: 6px; accent-color: #6366f1; pointer-events: none; }
`;

export const WECHAT_THEMES: WechatTheme[] = [
  {
    id: 'default',
    name: '默认',
    description: '经典简约排版',
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
      }
      #insup-content h1 { color: #111; font-size: 28px; font-weight: 700; margin: 1.2em 0 0.8em; }
      #insup-content h2 { color: #111; font-size: 22px; font-weight: 600; margin: 2em 0 1em; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.3em; }
      #insup-content h3 { color: #222; font-size: 19px; font-weight: 600; margin: 1.8em 0 0.8em; }
      #insup-content p { font-size: 16px; margin: 1em 0; line-height: 1.8; color: #374151; }
      #insup-content blockquote { background: #f9fafb; border-left: 4px solid #e5e7eb; color: #4b5563; padding: 1.2em 1.5em; }
      #insup-content ul, #insup-content ol { margin: 1.2em 0; }
      #insup-content li { margin: 0.6em 0; }
      #insup-content a { color: #2563eb; text-decoration: underline; text-underline-offset: 4px; }
      #insup-content hr { border-top: 1px solid #f3f4f6; margin: 3em 0; }
    `,
    preview: '#ffffff',
  },
  {
    id: 'magazine',
    name: '杂志',
    description: '时尚杂志排版',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Optima", "Inter", "PingFang SC", sans-serif;color:#1a1a1a;background:#fff;',
    css: BASE_CSS + `
      #insup-content { 
        color: #1a1a1a; 
        font-family: "Optima", -apple-system, "Source Serif 4", "Noto Serif SC", serif; 
        background: #fff; 
        line-height: 1.85; 
      }

      /* H1：封面大标题，极简杂志风 */
      #insup-content h1 {
        font-size: 32px; font-weight: 300; text-align: center;
        letter-spacing: 0.3em; color: #000;
        padding: 0.8em 0;
        border-top: 5px solid #000;
        border-bottom: 2px solid #000;
        margin: 1.5em 0 1.2em;
        line-height: 1.3;
        text-transform: uppercase;
      }

      /* H2：编辑标签风格 */
      #insup-content h2 {
        display: inline-block;
        background: #000; color: #fff;
        font-size: 12px; font-weight: 700;
        letter-spacing: 0.25em;
        padding: 6px 18px;
        margin: 2.2em 0 1.2em;
        line-height: 1;
        text-transform: uppercase;
      }

      /* H3：斜杠序列号感 */
      #insup-content h3 {
        font-size: 18px; font-weight: 700;
        color: #1a1a1a; margin: 1.8em 0 0.8em;
        padding-bottom: 6px;
        border-bottom: 3px solid #f0f0f0;
      }

      /* 引用：经典的 Pull-Quote 风格 */
      #insup-content blockquote {
        margin: 3em 0; padding: 1.5em 2.5em;
        border: none; background: #fdfdfd;
        text-align: center;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
      #insup-content blockquote p {
        font-size: 19px; font-family: Georgia, serif;
        font-style: italic; line-height: 1.6; color: #333;
        text-indent: 0; margin: 0;
      }
      #insup-content blockquote p::before { content: "“"; font-size: 1.6em; vertical-align: -0.4em; margin-right: 4px; color: #ccc; }
      #insup-content blockquote p::after { content: "”"; font-size: 1.6em; vertical-align: -0.4em; margin-left: 4px; color: #ccc; }

      /* 首段首字下沉 */
      #insup-content p:first-of-type::first-letter {
        float: left; font-size: 3.8em; line-height: 0.8;
        margin: 0.08em 0.1em 0 0;
        font-weight: 900; color: #000;
      }

      /* 分割线：极简长线 */
      #insup-content hr { border: none; border-top: 1px solid #1a1a1a; margin: 3.5em 10%; }

      /* 强调样式 */
      #insup-content strong { font-weight: 800; color: #000; background: linear-gradient(transparent 70%, #f0f0f0 70%); }
      #insup-content em { font-style: italic; color: #444; }
      #insup-content a { color: #000; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
      
      #insup-content li::marker { color: #000; font-weight: 700; }
      
      /* 表格：编辑部内表感 */
      #insup-content th { background: #000; border: none; color: #fff; font-size: 11px; letter-spacing: 0.1em; padding: 10px 14px; text-transform: uppercase; }
      #insup-content td { border: none; border-bottom: 1px solid #eee; padding: 10px 14px; }
      
      #insup-content code { background: #f6f6f6; color: #111; padding: 0.2em 0.4em; font-size: 85%; }
      #insup-content pre { background: #000; color: #fff; padding: 1.5em; border-radius: 4px; }
    `,
    preview: '#ffffff',
  },
  {
    id: 'crimson',
    name: '赤红',
    description: '东方赤红美学',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Noto Serif SC","Source Han Serif SC",serif;color:#1a1a1a;background:#fef8f6;padding:40px 30px;',
    css: BASE_CSS + `
      #insup-content {
        color: #1a1a1a;
        font-family: "Noto Serif SC", "Source Han Serif SC", "STSong", serif;
        line-height: 1.95;
        background: #fef8f6;
        /* 宣纸纹理 */
        background-image:
          radial-gradient(circle at 20% 30%, rgba(196, 30, 58, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(196, 30, 58, 0.02) 0%, transparent 50%);
      }

      /* H1: 竖排印章风格 */
      #insup-content h1 {
        font-size: 32px;
        font-weight: 900;
        color: #1a1a1a;
        text-align: center;
        letter-spacing: 0.5em;
        margin: 1.5em 0 1em;
        position: relative;
        padding: 20px 0;
      }
      /* 红色边框装饰 */
      #insup-content h1::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 100%;
        border: 2px solid #c41e3a;
        border-radius: 8px;
        opacity: 0.3;
      }
      /* 底部装饰线 */
      #insup-content h1::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: #c41e3a;
        border-radius: 1px;
      }

      /* H2: 红色装饰框 */
      #insup-content h2 {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 2.5em 0 1.2em;
        padding: 12px 20px;
        position: relative;
        background: linear-gradient(to right, rgba(196, 30, 58, 0.05), transparent);
        border-left: 4px solid #c41e3a;
      }

      /* H3 */
      #insup-content h3 {
        font-size: 17px;
        font-weight: 600;
        color: #333;
        margin: 1.8em 0 0.8em;
        padding-left: 16px;
        position: relative;
      }
      #insup-content h3::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background: #c41e3a;
        border-radius: 50%;
        opacity: 0.6;
      }

      /* 段落：两端对齐 */
      #insup-content p {
        font-size: 15px;
        color: #3a3a3a;
        margin: 1em 0;
        text-align: justify;
        text-indent: 2em;
        line-height: 2;
      }
      #insup-content p:first-of-type {
        text-indent: 0;
      }

      /* 引用：水墨风格 */
      #insup-content blockquote {
        margin: 2.5em 0;
        padding: 20px 30px;
        border: none;
        background: linear-gradient(135deg, rgba(196, 30, 58, 0.05) 0%, transparent 100%);
        color: #5a3a3a;
        position: relative;
      }
      #insup-content blockquote::before {
        content: '"';
        font-size: 48px;
        color: #c41e3a;
        opacity: 0.2;
        position: absolute;
        top: -10px;
        left: 10px;
        font-family: Georgia, serif;
      }
      #insup-content blockquote p {
        text-indent: 0;
        font-size: 15px;
        line-height: 1.9;
      }

      /* 链接 */
      #insup-content a {
        color: #c41e3a;
        text-decoration: none;
        border-bottom: 1px solid #c41e3a;
      }

      /* 强调 */
      #insup-content strong {
        color: #c41e3a;
        font-weight: 700;
      }

      /* 代码 */
      #insup-content code {
        background: rgba(196, 30, 58, 0.08);
        color: #c41e3a;
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 85%;
      }

      /* 分割线：红色装饰 */
      #insup-content hr {
        border: none;
        margin: 3em 0;
        height: 2px;
        background: linear-gradient(to right, transparent, #c41e3a, transparent);
        opacity: 0.3;
      }

      /* 列表 */
      #insup-content li::marker {
        color: #c41e3a;
      }

      /* 表格 */
      #insup-content th {
        background: #c41e3a;
        color: #fff;
        font-weight: 600;
        border: none;
        padding: 12px 16px;
      }
      #insup-content td {
        border: 1px solid rgba(196, 30, 58, 0.1);
        padding: 12px 16px;
        color: #3a3a3a;
        background: #fff;
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(196, 30, 58, 0.02);
      }
    `,
    preview: '#fef8f6',
  },
  {
    id: 'tech',
    name: '暗黑',
    description: '极客暗黑美学',
    containerStyle: 'max-width:677px;margin:0 auto;background:#0a0a0f;color:#e6e6e6;padding:32px 24px;font-family:-apple-system,"SF Pro Display",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        background: #0a0a0f;
        color: #e6e6e6;
        font-family: -apple-system, "SF Pro Display", "PingFang SC", sans-serif;
        padding: 2em 1.5em;
        line-height: 1.85;
        /* 科技感网格背景 */
        background-image:
          radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 100% 100%, 40px 40px, 40px 40px;
      }

      /* H1: 居中发光标题 */
      #insup-content h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 1.5em 0 1em;
        text-align: center;
        color: #e6e6e6;
        position: relative;
        letter-spacing: 0.02em;
        text-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
      }
      #insup-content h1::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: #6366f1;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
      }

      /* H2: 科技感卡片 */
      #insup-content h2 {
        font-size: 20px;
        font-weight: 600;
        color: #e6e6e6;
        margin: 2.2em 0 1em;
        padding: 14px 20px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-left: 4px solid #6366f1;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }

      /* H3: 紫色强调 */
      #insup-content h3 {
        font-size: 17px;
        font-weight: 600;
        color: #c4b5fd;
        margin: 1.8em 0 0.8em;
        padding-left: 16px;
        position: relative;
      }
      #insup-content h3::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: linear-gradient(to bottom, #6366f1, #a855f7);
        border-radius: 2px;
      }

      /* 段落 */
      #insup-content p {
        color: #a1a1aa;
        margin: 1em 0;
        font-size: 15px;
        line-height: 1.9;
      }

      /* 引用：发光卡片 */
      #insup-content blockquote {
        margin: 2em 0;
        padding: 20px 24px;
        background: rgba(99, 102, 241, 0.05);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-left: 4px solid #6366f1;
        color: #c4b5fd;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      }
      #insup-content blockquote::before {
        content: '"';
        position: absolute;
        top: -10px;
        left: 15px;
        font-size: 48px;
        color: #6366f1;
        opacity: 0.1;
        font-family: Georgia, serif;
      }
      #insup-content blockquote p {
        color: #c4b5fd;
        margin: 0;
        position: relative;
        z-index: 1;
      }

      /* 链接：渐变效果 */
      #insup-content a {
        color: #818cf8;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      #insup-content a:hover {
        border-bottom-color: #6366f1;
      }

      /* 强调 */
      #insup-content strong {
        color: #e6e6e6;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1));
        padding: 0.1em 0.3em;
        border-radius: 4px;
      }

      /* 代码：霓虹风格 */
      #insup-content code {
        background: rgba(99, 102, 241, 0.1);
        color: #a5b4fc;
        padding: 0.2em 0.6em;
        border-radius: 4px;
        font-size: 85%;
        border: 1px solid rgba(99, 102, 241, 0.2);
        font-family: "JetBrains Mono", "Fira Code", monospace;
      }

      /* 代码块 */
      #insup-content pre {
        background: #0d0d12;
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 12px;
        padding: 20px;
        overflow-x: auto;
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.1);
      }
      #insup-content pre code {
        background: transparent;
        border: none;
        padding: 0;
        color: #a5b4fc;
      }

      /* 分割线：渐变光效 */
      #insup-content hr {
        border: none;
        margin: 3em 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5), transparent);
      }

      /* 列表 */
      #insup-content li {
        margin: 0.5em 0;
        line-height: 1.8;
        color: #a1a1aa;
      }
      #insup-content li::marker {
        color: #6366f1;
      }
      #insup-content ul, #insup-content ol {
        padding-left: 1.5em;
      }

      /* 表格：发光边框 */
      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
      #insup-content th {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1));
        color: #e6e6e6;
        font-weight: 600;
        border: none;
        padding: 14px 18px;
        font-size: 13px;
        letter-spacing: 0.02em;
      }
      #insup-content td {
        border: none;
        border-top: 1px solid rgba(99, 102, 241, 0.1);
        padding: 14px 18px;
        color: #a1a1aa;
        background: transparent;
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(99, 102, 241, 0.02);
      }

      /* 图片：发光边框 */
      #insup-content img {
        border-radius: 12px;
        border: 1px solid rgba(99, 102, 241, 0.1);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.1);
      }
    `,
    preview: '#0a0a0f',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    description: '暖黑终端感、克制橙色强调',
    containerStyle: 'max-width:677px;margin:0 auto;background:#171412;color:#e8dfd4;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        background: #171412;
        color: #e8dfd4;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "PingFang SC", "Hiragino Sans GB", sans-serif;
        padding: 2em 1.5em;
        line-height: 1.9;
        letter-spacing: 0.01em;
        background-image:
          radial-gradient(circle at top right, rgba(219, 154, 94, 0.10), transparent 26%),
          linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
      }

      #insup-content h1 {
        color: #f7f1e7;
        font-size: 30px;
        font-weight: 760;
        line-height: 1.18;
        letter-spacing: -0.03em;
        margin: 1.15em 0 0.9em;
      }
      #insup-content h1::after {
        content: '';
        display: block;
        width: 72px;
        height: 1px;
        margin-top: 0.55em;
        background: linear-gradient(90deg, rgba(219, 154, 94, 0.9), rgba(219, 154, 94, 0));
      }

      #insup-content h2 {
        color: #f1e8dd;
        font-size: 19px;
        font-weight: 650;
        margin: 2em 0 1em;
        padding: 14px 16px;
        background: #1d1917;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-left: 3px solid #db9a5e;
        border-radius: 14px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
      }

      #insup-content h3 {
        color: #e5b07d;
        font-size: 15px;
        font-weight: 650;
        line-height: 1.6;
        margin: 1.9em 0 0.7em;
        letter-spacing: 0.02em;
        font-family: "SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace;
        text-transform: uppercase;
      }
      #insup-content h3::before {
        content: '> ';
        color: rgba(229, 176, 125, 0.72);
      }

      #insup-content p {
        color: #d1c5b7;
        font-size: 15.5px;
        line-height: 1.95;
        margin: 1em 0;
      }

      #insup-content blockquote {
        margin: 2em 0;
        padding: 18px 20px;
        background: #1d1917;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-left: 3px solid #db9a5e;
        border-radius: 14px;
        color: #ebe1d5;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
      }
      #insup-content blockquote::before {
        content: 'NOTE';
        display: block;
        margin-bottom: 10px;
        color: #b8aa98;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        font-family: "SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace;
      }
      #insup-content blockquote p {
        margin: 0;
        color: #ebe1d5;
      }

      #insup-content strong {
        color: #fff7ee;
        font-weight: 700;
        box-shadow: inset 0 -0.45em 0 rgba(219, 154, 94, 0.16);
      }
      #insup-content em {
        color: #e9c49f;
        font-style: normal;
      }
      #insup-content a {
        color: #efc08a;
        text-decoration: none;
        border-bottom: 1px solid rgba(239, 192, 138, 0.40);
      }

      #insup-content hr {
        border: none;
        margin: 2.6em 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(219, 154, 94, 0.42), transparent);
      }

      #insup-content ul, #insup-content ol {
        padding-left: 1.6em;
      }
      #insup-content li {
        color: #d1c5b7;
        margin: 0.55em 0;
      }
      #insup-content li::marker {
        color: #db9a5e;
      }

      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: #1b1816;
      }
      #insup-content th {
        background: #221d1a;
        color: #f1e7db;
        border-bottom: 1px solid rgba(219, 154, 94, 0.18);
        font-weight: 650;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      #insup-content td {
        color: #d1c5b7;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(255, 255, 255, 0.015);
      }

      #insup-content code {
        background: #221d1a;
        color: #f3c693;
        border: 1px solid rgba(219, 154, 94, 0.12);
        padding: 0.2em 0.5em;
        border-radius: 6px;
        font-family: "SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace;
      }
      #insup-content pre {
        background: #11100f;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.03);
      }
      #insup-content pre::before {
        content: 'claude_code';
        display: block;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        color: #ac9d8c;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-family: "SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace;
      }
      #insup-content pre code {
        background: transparent;
        border: none;
        padding: 0;
        color: #eadfce;
      }

      #insup-content img {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
      }

      #insup-content kbd {
        background: #221d1a;
        border-color: rgba(219, 154, 94, 0.22);
        color: #efc08a;
      }
    `,
    preview: '#171412',
  },
  {
    id: 'sketch',
    name: '手绘',
    description: '手绘涂鸦风格',
    containerStyle: 'max-width:677px;margin:0 auto;background:#fffef5;color:#333;padding:40px 30px;font-family: cursive, sans-serif;',
    css: BASE_CSS + `
      #insup-content { 
        background-color: #fffef5; 
        background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
        background-size: 24px 24px;
        color: #1a1a1a; 
        font-family:  "Avenir Next", "Hiragino Kaku Gothic Interface", "PingFang SC", cursive, sans-serif;
        line-height: 1.85; 
        padding: 2em 1em;
      }

      /* H1：紧凑的手绘涂鸦背景 */
      #insup-content h1 {
        font-size: 30px; color: #000; text-align: center;
        margin: 1.25em 0 1em; position: relative;
        padding: 10px 0;
        z-index: 1;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%) rotate(-1deg);
      }
      #insup-content h1::before {
        content: ""; position: absolute; top: 15%; left: -5%; right: -5%; bottom: 15%;
        background: #fff;
        border: 2px solid #111;
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        z-index: -1;
        box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
      }
      #insup-content h1::after { 
        content: ""; position: absolute; bottom: 0; left: 10%; right: 10%; height: 4px; 
        background: #ff4757; opacity: 0.6; border-radius: 50%; 
      }

      /* H2：带涂鸦阴影的便签 */
      #insup-content h2 {
        font-size: 22px; color: #111; position: relative;
        display: inline-block; padding: 8px 20px;
        margin: 2.5em 0 1.2em;
        border: 2px solid #333;
        background: #ffeb3b;
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        box-shadow: 6px 6px 0 #000;
        transform: rotate(2deg);
      }

      /* H3：彩色蜡笔波浪线下划线 */
      #insup-content h3 {
        font-size: 19px; color: #000; margin: 1.8em 0 0.8em;
        display: inline-block;
        border-bottom: 4px dotted #ff4081;
        transform: rotate(-1deg);
      }

      /* 引用：四角贴了透明胶带的纸片 */
      #insup-content blockquote {
        margin: 3.5em 0; padding: 2em;
        background: #fff; border: 1px solid #ddd;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.05);
        position: relative;
        transform: rotate(-0.5deg);
      }
      /* 四角胶带 */
      #insup-content blockquote::before, #insup-content blockquote::after {
        content: ""; position: absolute; width: 50px; height: 20px;
        background: rgba(255, 255, 255, 0.5); border: 1px solid rgba(0,0,0,0.05);
        backdrop-filter: blur(1px); z-index: 2;
      }
      #insup-content blockquote::before { top: -10px; left: -15px; transform: rotate(-35deg); }
      #insup-content blockquote::after { bottom: -10px; right: -15px; transform: rotate(-35deg); }

      /* 强调样式：极其厚重的涂鸦高亮 */
      #insup-content strong { 
        font-weight: 900; color: #000; 
        background: #fff176;
        padding: 0 4px;
        border-radius: 20% 80% 30% 70% / 70% 30% 80% 20%;
        box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
      }
      #insup-content em { font-style: italic; color: #2196f3; font-weight: 800; border-bottom: 2px solid #2196f3; }
      #insup-content a { color: #f44336; border-bottom: 3px double #f44336; text-decoration: none; }

      /* 分割线：大手绘波浪线 */
      #insup-content hr { border: none; margin: 4em 0; background: none; height: 10px; position: relative; }
      #insup-content hr::after { 
        content: "〰〰〰〰〰〰〰〰〰"; font-size: 30px; color: #000;
        position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
        letter-spacing: -2px; width: 100%; text-align: center; opacity: 0.2;
      }

      /* 图片：像贴在墙上的照片 */
      #insup-content img { 
        padding: 12px; border: 1px solid #fff; background: #fff;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-radius: 2px;
        transform: rotate(1deg);
        margin: 2.5em auto;
      }
      
      #insup-content li { list-style: none; position: relative; padding-left: 25px; }
      #insup-content li::before { content: "✔"; position: absolute; left: 0; color: #4caf50; font-weight: 900; font-size: 1.2em; }
      
      #insup-content code { background: #e1f5fe; color: #0277bd; border: 1px dashed #0277bd; border-radius: 10px; }
      #insup-content pre { background: #1a1a1a; border: 3px solid #333; border-radius: 15px 50px 15px 50px; }
    `,
    preview: '#ffeb3b',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
