"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Share2,
  Monitor,
  Download,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InSupLockup } from "@/components/brand/insup-lockup";

const features = [
  {
    title: "公众号排版",
    desc: "以 Markdown 为输入，快速生成适合公众号粘贴的内容结构与预览效果。",
    icon: FileText,
  },
  {
    title: "社交卡片",
    desc: "将长内容拆成多页卡片，适合社交媒体传播与知识切片表达。",
    icon: Share2,
  },
  {
    title: "课件图输出",
    desc: "将内容整理为横版课件图，适合课程讲义、知识演示与课堂投屏场景。",
    icon: Monitor,
  },
  {
    title: "本地优先",
    desc: "内容默认保存在浏览器本地，无需注册即可开始工作。",
    icon: ShieldCheck,
  },
  {
    title: "多格式导出",
    desc: "支持导出 HTML、Markdown 与多页图片压缩包。",
    icon: Download,
  },
  {
    title: "为洞察而设计",
    desc: "多种视觉风格主题满足个性化的内容展现需求。",
    icon: Sparkles,
  },
];

const outputs = [
  {
    kind: "wechat" as const,
    title: "优质长文",
    desc: "面向长文发布，强调可读性与复制粘贴后的样式保持。",
  },
  {
    kind: "poster" as const,
    title: "笔记卡片",
    desc: "适用于知识切片、观点摘要和社交传播的视觉输出。",
  },
  {
    kind: "slide" as const,
    title: "PPT 课件页",
    desc: "适用于课程演示、讲义配图和知识表达的横版内容输出。",
  },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <InSupLockup priority />
    </Link>
  );
}

function AbstractPreview() {
  return (
    <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-[0_30px_120px_-50px_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-4">
        <div className="size-3 rounded-full bg-red-400" />
        <div className="size-3 rounded-full bg-amber-400" />
        <div className="size-3 rounded-full bg-emerald-400" />
        <div className="ml-3 h-8 flex-1 rounded-full bg-zinc-100 px-4 text-xs leading-8 text-zinc-400">
          insight.richology.cn / workspace
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-3 w-24 rounded-full bg-zinc-200" />
            <div className="h-8 w-8 rounded-xl bg-zinc-900" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-zinc-900" />
            <div className="h-3 w-full rounded-full bg-zinc-200" />
            <div className="h-3 w-11/12 rounded-full bg-zinc-200" />
            <div className="h-3 w-4/5 rounded-full bg-zinc-200" />
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white p-4">
              <div className="h-24 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-3 h-3 w-20 rounded-full bg-zinc-200" />
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded-full bg-zinc-900" />
              <div className="h-3 w-full rounded-full bg-zinc-200" />
              <div className="h-3 w-5/6 rounded-full bg-zinc-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-900 p-4 text-white">
              <div className="mb-10 h-3 w-12 rounded-full bg-white/30" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white" />
                <div className="h-3 w-2/3 rounded-full bg-white/50" />
              </div>
            </div>
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-100 p-4">
              <div className="mb-10 h-3 w-12 rounded-full bg-zinc-300" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-zinc-700" />
                <div className="h-3 w-2/3 rounded-full bg-zinc-300" />
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-zinc-300" />
              <div className="h-6 w-16 rounded-full bg-white" />
            </div>
            <div className="h-24 rounded-[20px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputPreview({
  kind,
}: {
  kind: "wechat" | "poster" | "slide";
}) {
  if (kind === "poster") {
    return (
      <div className="relative mb-6 h-44 overflow-hidden rounded-[24px] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 px-4 py-4">
        <div className="flex h-full items-center justify-center gap-2.5">
          {[
            { tone: "bg-[#f4efe8]", accent: "bg-zinc-900", lines: "bg-zinc-300" },
            { tone: "bg-[#f8f6f1]", accent: "bg-zinc-900", lines: "bg-zinc-300" },
            { tone: "bg-[#f3eee6]", accent: "bg-zinc-900", lines: "bg-zinc-300" },
          ].map((phone, phoneIndex) => (
            <React.Fragment key={phoneIndex}>
              <div
                className={`flex h-[132px] w-[76px] shrink-0 flex-col rounded-[24px] border border-white/12 ${phone.tone} p-2.5 shadow-[0_22px_40px_-22px_rgba(0,0,0,0.85)] ${phoneIndex === 1 ? "scale-[1.02]" : "opacity-90"}`}
              >
                <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-zinc-900/70" />
                <div className="mb-2 h-11 rounded-[14px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700" />
                <div className="space-y-1.5">
                  <div className={`h-1.5 w-4/5 rounded-full ${phone.accent}`} />
                  <div className={`h-1.5 w-full rounded-full ${phone.lines}`} />
                  <div className={`h-1.5 w-3/4 rounded-full ${phone.lines}`} />
                </div>
                <div className="mt-auto flex items-center justify-center gap-1.5 pt-2">
                  <span className={`size-1.5 rounded-full ${phoneIndex === 0 ? "bg-zinc-900" : "bg-zinc-300"}`} />
                  <span className={`size-1.5 rounded-full ${phoneIndex === 1 ? "bg-zinc-900" : "bg-zinc-300"}`} />
                  <span className={`size-1.5 rounded-full ${phoneIndex === 2 ? "bg-zinc-900" : "bg-zinc-300"}`} />
                </div>
              </div>
              {phoneIndex < 2 ? (
                <div className="flex h-full items-center">
                  <ChevronRight className="size-5 text-white/45" />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "slide") {
    return (
      <div className="mb-6 h-44 overflow-hidden rounded-[24px] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 p-4">
        <div className="flex h-full items-center justify-center">
          <div className="aspect-[16/9] w-full max-w-[264px] overflow-hidden rounded-[20px] border border-white/12 bg-[#f7f4ef] p-3 shadow-[0_24px_55px_-22px_rgba(0,0,0,0.85)]">
            <div className="flex h-full flex-col">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-2 w-12 rounded-full bg-zinc-300" />
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-zinc-300" />
                  <span className="size-2 rounded-full bg-zinc-300" />
                  <span className="size-2 rounded-full bg-zinc-900" />
                </div>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_0.75fr] gap-2 rounded-[16px] bg-white/80 p-2.5">
                <div className="flex min-w-0 flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-2/3 rounded-full bg-zinc-900" />
                    <div className="h-2 w-full rounded-full bg-zinc-300" />
                    <div className="h-2 w-5/6 rounded-full bg-zinc-200" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-5 rounded-lg bg-zinc-100" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-5 rounded-lg bg-zinc-100" />
                      <div className="h-5 rounded-lg bg-zinc-50" />
                    </div>
                  </div>
                </div>
                <div className="min-h-0 rounded-[14px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 p-2 text-white">
                  <div className="mb-1.5 h-2 w-8 rounded-full bg-white/35" />
                  <div className="flex h-[44px] items-end gap-1">
                    <div className="w-1/4 rounded-t-md bg-white/35" style={{ height: "34%" }} />
                    <div className="w-1/4 rounded-t-md bg-white/55" style={{ height: "54%" }} />
                    <div className="w-1/4 rounded-t-md bg-white/80" style={{ height: "78%" }} />
                    <div className="w-1/4 rounded-t-md bg-white/45" style={{ height: "44%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 h-44 rounded-[24px] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 p-5 text-white">
      <div className="flex h-full flex-col justify-between">
        <div className="h-2.5 w-12 rounded-full bg-white/25" />
        <div className="space-y-2">
          <div className="h-3 w-2/3 rounded-full bg-white" />
          <div className="h-3 w-full rounded-full bg-white/40" />
          <div className="h-3 w-4/5 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <Brand />
          <Link href="/workspace">
            <Button className="rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-800">
              进入工作台
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="px-6 pb-14 pt-8 md:pb-20 md:pt-12">
          <div className="mx-auto grid max-w-screen-xl gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 md:text-7xl"
              >
                从想法到爆款内容 <br />
                一步完成
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-xl text-lg leading-8 text-zinc-500"
              >
                InSup 赋能自媒体从业者将灵感和洞察在全平台生根发芽
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/workspace">
                  <Button className="h-12 rounded-full bg-zinc-900 px-8 text-sm font-bold text-white hover:bg-zinc-800">
                    开始创作
                  </Button>
                </Link>
              </motion.div>

              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                {[
                  "优质长文",
                  "笔记卡片",
                  "教学课件",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-600 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <AbstractPreview />
            </motion.div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="mb-10 max-w-2xl space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-zinc-400">Capabilities</p>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                <span className="block">结构化思考、模型化输出</span>
                <span className="block">InSup 为创作加速，为品质升级</span>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-[28px] border border-zinc-200 bg-[#fafaf8] p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                    <div className="mb-5 inline-flex size-11 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mb-3 text-xl font-black tracking-tight text-zinc-950">{feature.title}</h3>
                    <p className="text-sm leading-7 text-zinc-500">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-zinc-400">Outputs</p>
                <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">一份内容，多种输出形态。</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-zinc-500">
                InSup 不只是编辑器，它更像一个内容转换台：同一份结构化内容，可以进入发布、传播和教学三种不同场景。
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {outputs.map((item) => (
                <div key={item.title} className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
                  <OutputPreview kind={item.kind} />
                  <h3 className="mb-3 text-xl font-black tracking-tight text-zinc-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Brand />
            <p className="text-sm text-zinc-500">
              自媒体内容排版工作台 ·{" "}
              <a
                href="https://richology.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-950"
              >
                了解开发者：安瑟 A11BERICH
              </a>
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">insight.richology.cn</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
