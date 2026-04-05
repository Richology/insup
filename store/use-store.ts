import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPosterTheme } from '@/lib/poster-themes';

interface AppState {
  markdown: string;
  html: string;
  imgRadius: number;
  previewMode: 'pc' | 'app' | 'poster' | 'slide';
  styleTheme: 'wechat' | 'poster' | 'slide';
  wechatTheme: string;
  posterTheme: string;
  posterFont: string;
  layoutMode: 'split' | 'edit' | 'preview';
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  showWordCount: boolean;
  past: { markdown: string }[];
  future: { markdown: string }[];

  setMarkdown: (markdown: string | ((prev: string) => string)) => void;
  setHtml: (html: string) => void;
  setImgRadius: (radius: number) => void;
  setPreviewMode: (mode: 'pc' | 'app' | 'poster' | 'slide') => void;
  setStyleTheme: (theme: 'wechat' | 'poster' | 'slide') => void;
  setWechatTheme: (id: string) => void;
  setPosterTheme: (id: string) => void;
  setPosterFont: (id: string) => void;
  setLayoutMode: (mode: 'split' | 'edit' | 'preview') => void;
  setPosterShowHeader: (show: boolean) => void;
  setPosterShowFooter: (show: boolean) => void;
  setShowWordCount: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const INITIAL_MARKDOWN = `# InSup：把洞察整理成可发布内容

InSup 是 Richology 的内容排版工作台，适合把研究笔记、课程草稿和长文初稿整理成适合发布的内容。

## 你可以先这样开始

- 在左侧输入 Markdown
- 在右侧查看实时预览
- 切换公众号或贴图模式
- 导出 HTML、Markdown 或图片

## 建议的内容结构

### 1. 先写结论
先用两三句话写清楚你的核心观点，再展开过程和细节。

### 2. 用小标题拆分内容
让每一段承担清晰的信息任务，便于后续做卡片切片或课件拆页。

### 3. 保持页面节奏
- 关键句可以加粗
- 引用块可以承载观点
- 列表适合总结框架

> 好的表达，不只是把内容写出来，而是让结构帮助读者理解内容。

## 一个简单表格

| 模式 | 适用场景 | 输出 |
| --- | --- | --- |
| 公众号 | 长文发布 | HTML / 复制粘贴 |
| 贴图 | 社交传播 | PNG / ZIP |
| 课件图 | 教学演示 | 横版图片 |

---

现在开始修改这份示例内容，生成你自己的第一篇 InSup 作品。
`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      markdown: INITIAL_MARKDOWN,
      html: "",
      imgRadius: 12,
      previewMode: 'app',
      styleTheme: 'wechat',
      wechatTheme: 'default',
      posterTheme: 'default',
      posterFont: 'system',
      layoutMode: 'split',
      posterShowHeader: true,
      posterShowFooter: true,
      showWordCount: false,
      past: [],
      future: [],

      setMarkdown: (markdown) => set((state) => ({
        markdown: typeof markdown === 'function' ? markdown(state.markdown) : markdown,
      })),
      setHtml: (html) => set({ html }),
      setImgRadius: (imgRadius) => set({ imgRadius }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      setStyleTheme: (styleTheme) => set({ styleTheme }),
      setPosterShowHeader: (posterShowHeader) => set({ posterShowHeader }),
      setPosterShowFooter: (posterShowFooter) => set({ posterShowFooter }),
      setShowWordCount: (showWordCount) => set({ showWordCount }),
      setWechatTheme: (wechatTheme) => set({ wechatTheme }),
      setPosterTheme: (posterTheme) => set({ posterTheme }),
      setPosterFont: (posterFont) => set({ posterFont }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),

      pushHistory: () => set((state) => ({
        past: [...state.past, { markdown: state.markdown }].slice(-50),
        future: []
      })),

      undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const last = state.past[state.past.length - 1];
        return {
          markdown: last.markdown,
          past: state.past.slice(0, -1),
          future: [{ markdown: state.markdown }, ...state.future],
        };
      }),

      redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
          markdown: next.markdown,
          past: [...state.past, { markdown: state.markdown }],
          future: state.future.slice(1),
        };
      }),
    }),
    {
      name: 'insup-storage',
      partialize: (state) => ({
        markdown: state.markdown,
        imgRadius: state.imgRadius,
        styleTheme: state.styleTheme,
        wechatTheme: state.wechatTheme,
        posterTheme: state.posterTheme,
        posterFont: state.posterFont,
        layoutMode: state.layoutMode,
        posterShowHeader: state.posterShowHeader,
        posterShowFooter: state.posterShowFooter,
        showWordCount: state.showWordCount,
      }),
    }
  )
);

// 向后兼容的导出
export const getXHSTheme = (id: string) => {
  console.warn('getXHSTheme is deprecated, use getPosterTheme instead');
  return getPosterTheme(id);
};
