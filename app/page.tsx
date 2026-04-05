"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  Share2,
  Monitor,
  Download,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    desc: "视觉表达服务于研究、写作、课程与系统化知识输出。",
    icon: Sparkles,
  },
];

const outputs = [
  {
    title: "公众号文章",
    desc: "面向长文发布，强调可读性与复制粘贴后的样式保持。",
  },
  {
    title: "社交媒体卡片",
    desc: "适用于知识切片、观点摘要和社交传播的视觉输出。",
  },
  {
    title: "PPT 课件页",
    desc: "适用于课程演示、讲义配图和知识表达的横版内容输出。",
  },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/insup-lockup.svg"
        alt="InSup"
        width={154}
        height={36}
        className="h-8 w-auto object-contain"
        priority
      />
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
                把洞察写成 <br />
                可发布的内容。
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-xl text-lg leading-8 text-zinc-500"
              >
                InSup 是面向 Richology 内容体系的 Markdown 工作台，聚焦公众号排版、社交媒体卡片与 PPT 课件图输出。
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/workspace">
                  <Button className="h-12 rounded-full bg-zinc-900 px-8 text-sm font-bold text-white hover:bg-zinc-800">
                    立即开始
                  </Button>
                </Link>
              </motion.div>

              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                {[
                  "公众号文章",
                  "社交媒体卡片",
                  "本地优先工作流",
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
                <span className="block">通过 InSup 完成学习闭环</span>
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
              {outputs.map((item, index) => (
                <div key={item.title} className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 h-44 rounded-[24px] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 p-5 text-white">
                    <div className="flex h-full flex-col justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">0{index + 1}</span>
                      <div className="space-y-2">
                        <div className="h-3 w-2/3 rounded-full bg-white" />
                        <div className="h-3 w-full rounded-full bg-white/40" />
                        <div className="h-3 w-4/5 rounded-full bg-white/25" />
                      </div>
                    </div>
                  </div>
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
              Markdown 内容排版工作台 ·{" "}
              <a
                href="https://richology.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-950"
              >
                by Richology
              </a>
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">insight.richology.cn</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
