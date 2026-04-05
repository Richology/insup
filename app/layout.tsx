import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: {
    default: "InSup — Richology 内容排版工作台",
    template: "%s | InSup",
  },
  description:
    "InSup 是 Richology 的 Markdown 内容工作台，面向公众号排版、社交媒体卡片和知识内容生产。",
  keywords: [
    "InSup",
    "Richology",
    "Markdown 排版",
    "公众号排版工具",
    "社交媒体卡片",
    "内容工作台",
    "知识创作",
  ],
  authors: [{ name: "Richology" }],
  metadataBase: new URL("https://insight.richology.cn"),
  alternates: {
    canonical: "https://insight.richology.cn",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://insight.richology.cn",
    title: "InSup — Richology 内容排版工作台",
    description:
      "为知识创作者准备的 Markdown 内容工作台，聚焦公众号、社交卡片与内容资产表达。",
    siteName: "InSup",
    images: [
      {
        url: "/insup-mark.svg",
        width: 512,
        height: 512,
        alt: "InSup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InSup — Richology 内容排版工作台",
    description: "面向公众号、社交卡片与知识内容表达的 Markdown 工作台。",
    images: ["/insup-mark.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
