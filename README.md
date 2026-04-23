# InSup

InSup 是 Richology 的内容排版工作台。

它面向知识写作、公众号发布、社交媒体内容切片与后续课件图生产，延续 Markdown 优先、本地优先、快速导出的工作流。

## 当前 1.0 基线

- Markdown 编辑与实时预览
- 公众号排版模式
- 社交媒体卡片模式
- Markdown 文件导入
- HTML 粘贴转 Markdown
- 图片粘贴 / 拖拽 / 本地存储
- 多主题 / 多字体切换
- HTML / Markdown / PNG / ZIP 导出

## 1.0 规划补充

- PPT 横版课件图输出
- 更贴近 Richology 视觉系统的 UI 重构
- 更完整的模板与内容结构能力
- 邮箱注册与账号体系
- 文档与模板云端沉淀

## 账号接入

- 先配置 `.env` 里的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 再把 [supabase/schema.sql](/Users/panlong/insup/supabase/schema.sql) 里的 SQL 执行到 Supabase
- 现在已经有 [邮箱注册页](/Users/panlong/insup/app/(auth)/sign-up/page.tsx) 和 [邮箱登录页](/Users/panlong/insup/app/(auth)/sign-in/page.tsx)

## 本地运行

```bash
git clone https://github.com/Richology/insup.git
cd insup
npm install
npm run dev
```

## 域名

- [insight.richology.cn](https://insight.richology.cn)

## 仓库

- [Richology/insup](https://github.com/Richology/insup)
