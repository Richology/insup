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
    id: 'book',
    name: '纸质书',
    description: '暖纸纹理、旧书阅读感',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:Georgia,"Source Serif 4","Noto Serif SC","Source Han Serif SC","STSong","SimSun",serif;color:#4f4337;background:#f5efe3;padding:36px 30px;',
    css: BASE_CSS + `
      #insup-content {
        color: #4f4337;
        font-family: Georgia, "Source Serif 4", "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", serif;
        line-height: 1.95;
        background: #f5efe3;
        background-image:
          radial-gradient(rgba(134, 108, 79, 0.08) 0.6px, transparent 0.8px),
          radial-gradient(rgba(255,255,255,0.35) 0.4px, transparent 0.7px),
          linear-gradient(180deg, rgba(255,255,255,0.45), rgba(226, 210, 185, 0.28)),
          linear-gradient(90deg, rgba(140, 102, 68, 0.04), transparent 18%, transparent 82%, rgba(140, 102, 68, 0.04));
        background-size: 10px 10px, 14px 14px, 100% 100%, 100% 100%;
        box-shadow:
          inset 0 0 0 1px rgba(120, 96, 67, 0.08),
          inset 0 18px 40px rgba(255,255,255,0.18);
      }

      #insup-content h1 {
        color: #3f3125;
        font-size: 29px;
        font-weight: 700;
        text-align: center;
        line-height: 1.3;
        letter-spacing: 0.08em;
        margin: 1.35em 0 1em;
      }
      #insup-content h1::before,
      #insup-content h1::after {
        content: "";
        display: block;
        width: 72px;
        height: 1px;
        background: rgba(140, 102, 68, 0.42);
        margin: 0 auto 14px;
      }
      #insup-content h1::after {
        margin: 14px auto 0;
      }

      #insup-content h2 {
        color: #47382b;
        font-size: 20px;
        font-weight: 700;
        margin: 2.2em 0 1em;
        padding: 0.35em 0 0.35em 0.9em;
        border-left: 3px solid #9b7856;
        background: linear-gradient(90deg, rgba(155, 120, 86, 0.12), transparent 75%);
      }

      #insup-content h3 {
        color: #6b5137;
        font-size: 16px;
        font-weight: 700;
        margin: 1.8em 0 0.8em;
        letter-spacing: 0.04em;
      }
      #insup-content h3::before {
        content: "§ ";
        color: #9b7856;
      }

      #insup-content p {
        font-size: 15.5px;
        color: #54483b;
        line-height: 2;
        text-align: justify;
        text-indent: 2em;
        margin: 0.55em 0;
      }
      #insup-content p:first-of-type {
        text-indent: 0;
      }

      #insup-content blockquote {
        margin: 2em 0;
        padding: 16px 20px;
        background: rgba(147, 116, 82, 0.08);
        border-left: 3px solid #9b7856;
        color: #5b4937;
        border-radius: 0 12px 12px 0;
      }
      #insup-content blockquote p {
        margin: 0.4em 0;
        text-indent: 0;
        color: #5b4937;
      }

      #insup-content strong {
        color: #3f3125;
        font-weight: 700;
        background: linear-gradient(transparent 62%, rgba(184, 151, 113, 0.24) 62%);
      }
      #insup-content em {
        color: #7e5f40;
      }
      #insup-content a {
        color: #7a5635;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      #insup-content hr {
        border: none;
        margin: 2.8em 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139, 104, 68, 0.55), transparent);
      }

      #insup-content ul,
      #insup-content ol {
        margin: 1.15em 0;
      }
      #insup-content li {
        color: #54483b;
        margin: 0.5em 0;
      }
      #insup-content li::marker {
        color: #9b7856;
      }

      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border: 1px solid rgba(139, 104, 68, 0.14);
        background: rgba(255,255,255,0.2);
      }
      #insup-content th {
        background: rgba(155, 120, 86, 0.12);
        color: #4b392b;
        border-bottom: 1px solid rgba(139, 104, 68, 0.16);
      }
      #insup-content td {
        color: #54483b;
        border-top: 1px solid rgba(139, 104, 68, 0.1);
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(255,255,255,0.16);
      }

      #insup-content code {
        background: rgba(139, 104, 68, 0.09);
        color: #6b4f34;
      }
      #insup-content pre {
        background: rgba(88, 67, 46, 0.92);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
      }
      #insup-content pre code {
        color: #f4ead9;
      }

      #insup-content img {
        border-radius: 10px;
        border: 1px solid rgba(139, 104, 68, 0.14);
        box-shadow: 0 10px 24px rgba(93, 73, 52, 0.12);
      }

      #insup-content kbd {
        background: rgba(139, 104, 68, 0.1);
        border-color: rgba(139, 104, 68, 0.22);
        color: #5a4330;
      }
    `,
    preview: 'linear-gradient(135deg, #f7f1e6 0%, #efe4d2 100%)',
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
    id: 'minecraft',
    name: 'Minecraft',
    description: '像素霓虹、未来矿洞、AI 科幻感',
    containerStyle: 'max-width:677px;margin:0 auto;background:#05070c;color:#d9e7ff;padding:34px 24px;font-family:"JetBrains Mono","Maple Mono","SFMono-Regular","PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        background:
          radial-gradient(circle at 14% 18%, rgba(0, 255, 157, 0.16), transparent 22%),
          radial-gradient(circle at 86% 10%, rgba(126, 249, 255, 0.14), transparent 24%),
          linear-gradient(rgba(126, 249, 255, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126, 249, 255, 0.07) 1px, transparent 1px),
          linear-gradient(180deg, #0b1220 0%, #05070c 56%, #020409 100%);
        background-size: auto, auto, 18px 18px, 18px 18px, 100% 100%;
        color: #d9e7ff;
        padding: 2em 1.45em;
        line-height: 1.88;
        letter-spacing: 0.01em;
        box-shadow:
          inset 0 0 0 1px rgba(126, 249, 255, 0.14),
          inset 0 0 42px rgba(0, 255, 157, 0.04);
      }

      #insup-content h1,
      #insup-content h2,
      #insup-content h3,
      #insup-content code,
      #insup-content pre code,
      #insup-content th,
      #insup-content kbd {
        font-family: "JetBrains Mono", "Maple Mono", "SFMono-Regular", "Microsoft YaHei", monospace;
      }

      #insup-content h1 {
        margin: 1.4em 0 1em;
        padding: 18px 20px;
        font-size: 27px;
        font-weight: 800;
        line-height: 1.35;
        color: #f3fbff;
        background: linear-gradient(135deg, rgba(14, 28, 44, 0.96), rgba(8, 17, 28, 0.96));
        border: 2px solid rgba(126, 249, 255, 0.78);
        border-radius: 0;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        box-shadow:
          6px 6px 0 rgba(0, 255, 157, 0.25),
          0 0 28px rgba(126, 249, 255, 0.12);
      }

      #insup-content h2 {
        margin: 2.2em 0 1em;
        padding: 14px 16px;
        font-size: 19px;
        font-weight: 800;
        color: #08131f;
        background: linear-gradient(90deg, #7ef9ff 0%, #66ffd1 100%);
        border: 2px solid #7ef9ff;
        border-radius: 0;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        box-shadow: 5px 5px 0 rgba(18, 47, 71, 0.8);
      }

      #insup-content h3 {
        margin: 1.7em 0 0.8em;
        padding-left: 12px;
        font-size: 16px;
        font-weight: 800;
        color: #8bff67;
        border-left: 4px solid #8bff67;
        letter-spacing: 0.06em;
      }

      #insup-content p,
      #insup-content li,
      #insup-content td,
      #insup-content blockquote p {
        font-family: "JetBrains Mono", "Maple Mono", "SFMono-Regular", "Microsoft YaHei", monospace;
        color: #cad6ef;
      }

      #insup-content p {
        margin: 1em 0;
        line-height: 1.92;
      }

      #insup-content strong {
        color: #08131f;
        font-weight: 800;
        background: linear-gradient(90deg, #8bff67, #7ef9ff);
        padding: 0.12em 0.38em;
        border-radius: 0;
        box-shadow: 3px 3px 0 rgba(18, 47, 71, 0.78);
      }

      #insup-content em {
        font-style: normal;
        color: #8bff67;
        box-shadow: inset 0 -0.35em 0 rgba(139, 255, 103, 0.18);
      }

      #insup-content a {
        color: #7ef9ff;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }

      #insup-content blockquote {
        margin: 2em 0;
        padding: 18px 20px;
        background: linear-gradient(135deg, rgba(12, 24, 36, 0.92), rgba(5, 12, 21, 0.92));
        border: 2px solid rgba(126, 249, 255, 0.42);
        border-left: 6px solid #8bff67;
        border-radius: 0;
        box-shadow:
          8px 8px 0 rgba(11, 32, 52, 0.9),
          inset 0 0 0 1px rgba(139, 255, 103, 0.08);
      }
      #insup-content blockquote p {
        margin: 0.45em 0;
      }

      #insup-content ul,
      #insup-content ol {
        margin: 1.2em 0;
        padding-left: 1.7em;
      }
      #insup-content li {
        margin: 0.55em 0;
        line-height: 1.82;
      }
      #insup-content ul li {
        list-style-type: square;
      }
      #insup-content li::marker {
        color: #7ef9ff;
      }

      #insup-content hr {
        border: none;
        margin: 3em 0;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          rgba(126, 249, 255, 0) 0 12px,
          rgba(126, 249, 255, 0.92) 12px 24px,
          rgba(139, 255, 103, 0.92) 24px 36px
        );
        box-shadow: 0 0 16px rgba(126, 249, 255, 0.16);
      }

      #insup-content code {
        padding: 0.2em 0.5em;
        color: #7ef9ff;
        background: rgba(16, 29, 45, 0.92);
        border: 1px solid rgba(126, 249, 255, 0.34);
        border-radius: 0;
      }

      #insup-content pre {
        background: linear-gradient(180deg, rgba(4, 10, 18, 0.98), rgba(2, 6, 12, 0.98));
        border: 2px solid rgba(126, 249, 255, 0.26);
        border-radius: 0;
        box-shadow:
          10px 10px 0 rgba(11, 32, 52, 0.9),
          0 0 24px rgba(126, 249, 255, 0.08);
      }
      #insup-content pre code {
        padding: 1.3em;
        color: #d8ffe7;
        background: transparent;
        border: none;
      }

      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        border: 2px solid rgba(126, 249, 255, 0.26);
        border-radius: 0;
        overflow: hidden;
        box-shadow: 6px 6px 0 rgba(11, 32, 52, 0.9);
      }
      #insup-content th {
        background: linear-gradient(90deg, #7ef9ff 0%, #8bff67 100%);
        color: #07111a;
        border: none;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      #insup-content td {
        background: rgba(8, 15, 24, 0.92);
        border-top: 1px solid rgba(126, 249, 255, 0.14);
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(11, 20, 31, 0.96);
      }

      #insup-content img {
        border-radius: 0;
        border: 2px solid rgba(126, 249, 255, 0.4);
        box-shadow:
          10px 10px 0 rgba(11, 32, 52, 0.9),
          0 0 24px rgba(126, 249, 255, 0.08);
      }

      #insup-content kbd {
        color: #08131f;
        background: #8bff67;
        border-color: #8bff67;
        border-bottom-color: #7ef9ff;
        border-radius: 0;
        box-shadow: 2px 2px 0 rgba(18, 47, 71, 0.78);
      }
    `,
    preview: 'linear-gradient(135deg, #0b1220 0%, #05070c 45%, #10253b 100%)',
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
    id: 'blueprint',
    name: '蓝图',
    description: '研究笔记、课程结构、知识框架感',
    containerStyle: 'max-width:677px;margin:0 auto;background:#f4f8fc;color:#17324d;padding:36px 28px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        color: #17324d;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.9;
        letter-spacing: 0.01em;
        padding: 2em 1.45em;
        background:
          linear-gradient(rgba(47, 107, 255, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(47, 107, 255, 0.07) 1px, transparent 1px),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(246,250,255,0.96));
        background-size: 28px 28px, 28px 28px, 100% 100%;
        box-shadow:
          inset 0 0 0 1px rgba(200, 216, 234, 0.95),
          inset 0 24px 48px rgba(255, 255, 255, 0.75),
          0 18px 50px rgba(47, 107, 255, 0.06);
      }

      #insup-content h1 {
        color: #12314d;
        font-size: 30px;
        font-weight: 780;
        line-height: 1.2;
        letter-spacing: 0.04em;
        margin: 1.2em 0 1em;
      }
      #insup-content h1::after {
        content: "";
        display: block;
        width: 92px;
        height: 4px;
        margin-top: 0.5em;
        border-radius: 999px;
        background: linear-gradient(90deg, #2f6bff, #6ed0ff);
        box-shadow: 0 0 18px rgba(47, 107, 255, 0.2);
      }

      #insup-content h2 {
        color: #17324d;
        font-size: 20px;
        font-weight: 730;
        line-height: 1.35;
        margin: 2.2em 0 1em;
        padding: 0.55em 0.9em 0.55em 1.1em;
        border-left: 4px solid #2f6bff;
        background: linear-gradient(90deg, rgba(47, 107, 255, 0.14), rgba(110, 208, 255, 0.06) 68%, transparent 100%);
        box-shadow: inset 0 0 0 1px rgba(200, 216, 234, 0.75);
      }

      #insup-content h3 {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #2a4c69;
        font-size: 15px;
        font-weight: 700;
        margin: 1.8em 0 0.75em;
        padding: 0.3em 0.75em;
        border-radius: 999px;
        background: rgba(47, 107, 255, 0.08);
        border: 1px solid rgba(47, 107, 255, 0.14);
      }
      #insup-content h3::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: linear-gradient(135deg, #2f6bff, #6ed0ff);
        box-shadow: 0 0 0 4px rgba(47, 107, 255, 0.1);
      }

      #insup-content p {
        color: #26435e;
        font-size: 15.5px;
        line-height: 1.95;
        margin: 0.95em 0;
      }

      #insup-content strong {
        color: #12314d;
        font-weight: 760;
        box-shadow: inset 0 -0.42em 0 rgba(110, 208, 255, 0.32);
      }
      #insup-content em {
        font-style: normal;
        color: #2f6bff;
      }
      #insup-content a {
        color: #2f6bff;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }

      #insup-content blockquote {
        position: relative;
        margin: 2em 0;
        padding: 18px 20px;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.92), rgba(240,246,255,0.88)),
          linear-gradient(rgba(47, 107, 255, 0.05) 1px, transparent 1px);
        border: 1px dashed rgba(47, 107, 255, 0.45);
        border-left: 4px solid #2f6bff;
        border-radius: 14px;
        box-shadow: 0 14px 30px rgba(47, 107, 255, 0.08);
      }
      #insup-content blockquote::before {
        content: "NOTE";
        display: inline-block;
        margin-bottom: 10px;
        padding: 0.28em 0.62em;
        border-radius: 999px;
        background: rgba(47, 107, 255, 0.1);
        color: #2f6bff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.14em;
      }
      #insup-content blockquote p {
        margin: 0.45em 0;
        color: #27425c;
      }

      #insup-content ul,
      #insup-content ol {
        margin: 1.15em 0;
      }
      #insup-content li {
        color: #26435e;
        margin: 0.55em 0;
      }
      #insup-content li::marker {
        color: #2f6bff;
      }

      #insup-content hr {
        border: none;
        margin: 2.8em 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(47, 107, 255, 0.82), rgba(110, 208, 255, 0.6), transparent);
      }

      #insup-content code {
        color: #2458e6;
        background: rgba(47, 107, 255, 0.08);
        border: 1px solid rgba(47, 107, 255, 0.16);
        border-radius: 6px;
      }
      #insup-content pre {
        position: relative;
        background: linear-gradient(180deg, #13243d 0%, #0f1e33 100%);
        border: 1px solid rgba(110, 208, 255, 0.22);
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 16px 40px rgba(15, 30, 51, 0.18);
      }
      #insup-content pre::before {
        content: "SNIPPET";
        display: block;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(110, 208, 255, 0.16);
        color: #6ed0ff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.14em;
      }
      #insup-content pre code {
        padding: 0;
        color: #b8f5ff;
        background: transparent;
        border: none;
      }

      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border: 1px solid #c8d8ea;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 14px 28px rgba(47, 107, 255, 0.06);
      }
      #insup-content th {
        background: linear-gradient(180deg, #edf4ff, #dde9fb);
        color: #16344d;
        border-bottom: 1px solid #c8d8ea;
        font-size: 12px;
        font-weight: 760;
        letter-spacing: 0.08em;
      }
      #insup-content td {
        color: #26435e;
        border-top: 1px solid rgba(200, 216, 234, 0.82);
      }
      #insup-content td + td,
      #insup-content th + th {
        border-left: 1px solid rgba(200, 216, 234, 0.82);
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(244, 248, 252, 0.92);
      }

      #insup-content img {
        border-radius: 16px;
        border: 1px solid rgba(200, 216, 234, 0.95);
        box-shadow: 0 18px 36px rgba(47, 107, 255, 0.08);
      }

      #insup-content kbd {
        background: rgba(47, 107, 255, 0.08);
        border-color: rgba(47, 107, 255, 0.18);
        color: #2458e6;
      }
    `,
    preview: 'linear-gradient(135deg, #f4f8fc 0%, #eef5ff 50%, #dde9fb 100%)',
  },
  {
    id: 'brutalist',
    name: '野兽派',
    description: '高对比、强观点、海报式信息冲击',
    containerStyle: 'max-width:677px;margin:0 auto;background:#f6f1e8;color:#111111;padding:34px 26px;font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        background:
          linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0)),
          linear-gradient(135deg, #f6f1e8 0%, #f3ebdd 100%);
        color: #111111;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.82;
        padding: 2em 1.35em;
        box-shadow: inset 0 0 0 3px #111111;
      }

      #insup-content h1 {
        color: #111111;
        font-size: 34px;
        font-weight: 900;
        line-height: 1.06;
        letter-spacing: -0.06em;
        margin: 1em 0 0.85em;
        text-wrap: balance;
      }
      #insup-content h1::after {
        content: "";
        display: block;
        width: 100px;
        height: 8px;
        margin-top: 0.45em;
        background: #ffd400;
      }

      #insup-content h2 {
        display: inline-block;
        margin: 2.2em 0 1em;
        padding: 0.45em 0.75em;
        color: #111111;
        background: #ffd400;
        border: 3px solid #111111;
        box-shadow: 6px 6px 0 #111111;
        font-size: 20px;
        font-weight: 860;
        line-height: 1.2;
        letter-spacing: -0.04em;
      }

      #insup-content h3 {
        display: inline-block;
        margin: 1.8em 0 0.8em;
        padding: 0.28em 0.6em;
        color: #ffffff;
        background: #111111;
        border: 2px solid #111111;
        font-size: 14px;
        font-weight: 820;
        letter-spacing: 0.08em;
      }

      #insup-content p {
        color: #1c1c1c;
        font-size: 16px;
        line-height: 1.85;
        margin: 1em 0;
      }

      #insup-content strong {
        color: #111111;
        font-weight: 860;
        background: #ffd400;
        padding: 0.05em 0.28em;
      }
      #insup-content em {
        color: #111111;
        font-style: normal;
        box-shadow: inset 0 -0.45em 0 rgba(255, 212, 0, 0.35);
      }
      #insup-content a {
        color: #111111;
        text-decoration: none;
        border-bottom: 3px solid #ffd400;
      }

      #insup-content blockquote {
        position: relative;
        margin: 2em 0;
        padding: 18px 20px;
        background: #fffdf7;
        border: 4px solid #111111;
        box-shadow: 10px 10px 0 rgba(17, 17, 17, 0.14);
      }
      #insup-content blockquote::before {
        content: "QUOTE";
        display: inline-block;
        margin-bottom: 12px;
        padding: 0.28em 0.58em;
        background: #ffd400;
        color: #111111;
        font-size: 11px;
        font-weight: 860;
        letter-spacing: 0.12em;
      }
      #insup-content blockquote p {
        margin: 0.45em 0;
        color: #1c1c1c;
      }

      #insup-content ul,
      #insup-content ol {
        padding-left: 1.45em;
      }
      #insup-content li {
        color: #1c1c1c;
        margin: 0.55em 0;
      }
      #insup-content li::marker {
        color: #111111;
      }

      #insup-content hr {
        border: none;
        margin: 2.8em 0;
        height: 6px;
        background: repeating-linear-gradient(
          90deg,
          #111111 0 18px,
          #ffd400 18px 36px
        );
      }

      #insup-content code {
        background: #ffd400;
        color: #111111;
        border: 2px solid #111111;
        border-radius: 0;
        font-weight: 760;
      }
      #insup-content pre {
        background: #111111;
        border: 3px solid #111111;
        border-radius: 0;
        padding: 18px 20px;
        box-shadow: 10px 10px 0 rgba(17, 17, 17, 0.2);
      }
      #insup-content pre::before {
        content: "SYSTEM OUTPUT";
        display: block;
        margin: -19px -19px 16px;
        padding: 10px 14px;
        background: #ffd400;
        color: #111111;
        font-size: 11px;
        font-weight: 860;
        letter-spacing: 0.14em;
      }
      #insup-content pre code {
        padding: 0;
        color: #f9f6f0;
        background: transparent;
        border: none;
      }

      #insup-content table {
        border-collapse: collapse;
        border: 3px solid #111111;
        background: #ffffff;
      }
      #insup-content th {
        background: #111111;
        color: #ffffff;
        border: 3px solid #111111;
        font-size: 12px;
        font-weight: 860;
        letter-spacing: 0.1em;
      }
      #insup-content td {
        color: #1c1c1c;
        border: 3px solid #111111;
        background: #fffdf7;
      }
      #insup-content tr:nth-child(even) td {
        background: #fff4bc;
      }

      #insup-content img {
        border-radius: 0;
        border: 3px solid #111111;
        box-shadow: 10px 10px 0 rgba(17, 17, 17, 0.15);
      }

      #insup-content kbd {
        background: #111111;
        border-color: #111111;
        color: #ffd400;
        border-radius: 0;
      }
    `,
    preview: 'linear-gradient(135deg, #f6f1e8 0%, #fff4bc 100%)',
  },
  {
    id: 'aurora-glass',
    name: '极光玻璃',
    description: '极光渐变、AI 感、轻盈毛玻璃层次',
    containerStyle: 'max-width:677px;margin:0 auto;background:#f7fbff;color:#16233b;padding:36px 28px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #insup-content {
        color: #16233b;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.9;
        padding: 2em 1.45em;
        background:
          radial-gradient(circle at 0% 0%, rgba(82, 229, 231, 0.2), transparent 28%),
          radial-gradient(circle at 100% 12%, rgba(123, 97, 255, 0.17), transparent 24%),
          radial-gradient(circle at 84% 100%, rgba(255, 122, 217, 0.12), transparent 22%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,249,255,0.92));
        border: 1px solid rgba(122, 144, 255, 0.18);
        border-radius: 24px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.78),
          0 24px 60px rgba(91, 107, 136, 0.14);
        backdrop-filter: blur(22px);
      }

      #insup-content h1 {
        color: #16233b;
        font-size: 30px;
        font-weight: 780;
        line-height: 1.16;
        letter-spacing: -0.03em;
        margin: 1.1em 0 0.95em;
      }
      #insup-content h1::after {
        content: "";
        display: block;
        width: 110px;
        height: 4px;
        margin-top: 0.55em;
        border-radius: 999px;
        background: linear-gradient(135deg, #52e5e7 0%, #7b61ff 55%, #ff7ad9 100%);
        box-shadow: 0 0 20px rgba(123, 97, 255, 0.2);
      }

      #insup-content h2 {
        display: inline-flex;
        align-items: center;
        margin: 2em 0 1em;
        padding: 0.48em 0.88em;
        color: #1a2842;
        background: rgba(255, 255, 255, 0.62);
        border: 1px solid rgba(122, 144, 255, 0.2);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.72),
          0 10px 30px rgba(123, 97, 255, 0.09);
        backdrop-filter: blur(18px);
        font-size: 19px;
        font-weight: 720;
      }

      #insup-content h3 {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: #415372;
        font-size: 15px;
        font-weight: 700;
        margin: 1.75em 0 0.8em;
      }
      #insup-content h3::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: linear-gradient(135deg, #52e5e7 0%, #7b61ff 55%, #ff7ad9 100%);
        box-shadow: 0 0 18px rgba(123, 97, 255, 0.24);
      }

      #insup-content p {
        color: #324763;
        font-size: 15.5px;
        line-height: 1.95;
        margin: 0.95em 0;
      }

      #insup-content strong {
        color: #16233b;
        font-weight: 760;
        box-shadow: inset 0 -0.42em 0 rgba(123, 97, 255, 0.14);
      }
      #insup-content em {
        font-style: normal;
        color: #6556d8;
      }
      #insup-content a {
        color: #4b56e6;
        text-decoration: underline;
        text-decoration-color: rgba(123, 97, 255, 0.35);
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }

      #insup-content blockquote {
        position: relative;
        margin: 2em 0;
        padding: 18px 20px;
        background: rgba(255, 255, 255, 0.56);
        border: 1px solid rgba(122, 144, 255, 0.22);
        border-radius: 18px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.82),
          0 18px 42px rgba(122, 144, 255, 0.12);
        backdrop-filter: blur(18px);
      }
      #insup-content blockquote::before {
        content: "AURORA NOTE";
        display: inline-block;
        margin-bottom: 10px;
        padding: 0.3em 0.65em;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.66);
        border: 1px solid rgba(122, 144, 255, 0.18);
        color: #6a5ce0;
        font-size: 11px;
        font-weight: 780;
        letter-spacing: 0.12em;
      }
      #insup-content blockquote p {
        margin: 0.45em 0;
        color: #324763;
      }

      #insup-content ul,
      #insup-content ol {
        margin: 1.15em 0;
      }
      #insup-content li {
        color: #324763;
        margin: 0.55em 0;
      }
      #insup-content li::marker {
        color: #7b61ff;
      }

      #insup-content hr {
        border: none;
        margin: 2.8em 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(82, 229, 231, 0.82), rgba(123, 97, 255, 0.82), rgba(255, 122, 217, 0.72), transparent);
      }

      #insup-content code {
        color: #4f58d8;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(122, 144, 255, 0.16);
        border-radius: 8px;
      }
      #insup-content pre {
        position: relative;
        background: #0e172a;
        border: 1px solid rgba(82, 229, 231, 0.16);
        border-radius: 18px;
        padding: 18px 20px;
        box-shadow: 0 18px 44px rgba(14, 23, 42, 0.2);
      }
      #insup-content pre::before {
        content: "";
        display: block;
        height: 3px;
        margin: -19px -19px 16px;
        border-radius: 18px 18px 0 0;
        background: linear-gradient(135deg, #52e5e7 0%, #7b61ff 55%, #ff7ad9 100%);
      }
      #insup-content pre code {
        padding: 0;
        color: #e7f4ff;
        background: transparent;
        border: none;
      }

      #insup-content table {
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border: 1px solid rgba(122, 144, 255, 0.18);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.58);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.76),
          0 16px 36px rgba(122, 144, 255, 0.1);
        backdrop-filter: blur(16px);
      }
      #insup-content th {
        background: linear-gradient(135deg, rgba(82, 229, 231, 0.18), rgba(123, 97, 255, 0.14), rgba(255, 122, 217, 0.12));
        color: #22304a;
        border-bottom: 1px solid rgba(122, 144, 255, 0.16);
        font-size: 12px;
        font-weight: 760;
      }
      #insup-content td {
        color: #324763;
        border-top: 1px solid rgba(122, 144, 255, 0.12);
      }
      #insup-content tr:nth-child(even) td {
        background: rgba(255, 255, 255, 0.16);
      }

      #insup-content img {
        border-radius: 18px;
        border: 1px solid rgba(122, 144, 255, 0.18);
        box-shadow: 0 18px 40px rgba(122, 144, 255, 0.12);
      }

      #insup-content kbd {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(122, 144, 255, 0.18);
        color: #4f58d8;
      }
    `,
    preview: 'linear-gradient(135deg, #f7fbff 0%, #eaf5ff 45%, #fceaff 100%)',
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
