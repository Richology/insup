"use client";

import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasPreviewConfig {
  width: number;
  height: number;
  statusHeight: number;
  footerHeight: number;
  contentHeight: number;
  paddingX: number;
  paddingY: number;
  contentSelector: string;
  thumbnailScale: number;
  lightboxScale: number;
}

interface ExportPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  slides: {
    html: string;
    index: number;
    totalInGroup: number;
    pageInGroup: number;
  }[];
  themeBackground: string;
  themeCSS: string;
  canvas: CanvasPreviewConfig;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ExportPreviewDialog({
  isOpen,
  onClose,
  onConfirm,
  slides,
  themeBackground,
  themeCSS,
  canvas,
}: ExportPreviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number | null>(
    null,
  );
  const [viewportSize, setViewportSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!isOpen) setActiveSlideIndex(null);
  }, [isOpen]);

  React.useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  React.useEffect(() => {
    if (activeSlideIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSlideIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) =>
          prev === null ? prev : Math.max(0, prev - 1),
        );
      }
      if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) =>
          prev === null ? prev : Math.min(slides.length - 1, prev + 1),
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlideIndex, slides.length]);

  if (!isOpen) return null;

  const selectorPattern = new RegExp(
    `#${escapeRegExp(canvas.contentSelector)}`,
    "g",
  );
  const scopedCSS = themeCSS.replace(selectorPattern, ".preview-content");
  const activeSlide =
    activeSlideIndex !== null ? slides[activeSlideIndex] : undefined;
  const fittedLightboxScale =
    activeSlide && viewportSize.width > 0 && viewportSize.height > 0
    ? Math.min(
        canvas.lightboxScale,
        Math.max(0.1, (viewportSize.width - 148) / canvas.width),
        Math.max(0.1, (viewportSize.height - 132) / canvas.height),
      )
    : canvas.lightboxScale;

  const renderSlideCard = (
    slide: ExportPreviewDialogProps["slides"][number],
    scale: number,
  ) => {
    const width = Math.round(canvas.width * scale);
    const height = Math.round(canvas.height * scale);

    return (
      <div
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div
          style={{
            width: `${canvas.width}px`,
            height: `${canvas.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: themeBackground,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {canvas.statusHeight > 0 && (
            <div style={{ height: canvas.statusHeight, flexShrink: 0 }} />
          )}
          <div
            style={{
              width: "100%",
              height: `calc(100% - ${canvas.statusHeight}px - ${canvas.footerHeight}px)`,
              padding: `${canvas.paddingY}px ${canvas.paddingX}px`,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              className="preview-content w-full"
              style={{ height: `${canvas.contentHeight}px`, overflow: "hidden" }}
            >
              <div
                id="insup-content"
                dangerouslySetInnerHTML={{ __html: slide.html }}
              />
            </div>
          </div>
          {canvas.footerHeight > 0 && (
            <div style={{ height: canvas.footerHeight, flexShrink: 0 }} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <style>{scopedCSS}</style>

      <div className="relative flex h-[85vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">导出预览</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              共 {slides.length} 页，确认无误后点击导出
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-zinc-100"
            disabled={isSubmitting}
          >
            <X className="size-5 text-zinc-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide, idx) => (
              <div
                key={slide.index}
                className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-200 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                onClick={() => setActiveSlideIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSlideIndex(idx);
                  }
                }}
              >
                <div className="absolute left-3 top-3 z-10 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                  第 {slide.index + 1} 页
                </div>
                {slide.totalInGroup > 1 && (
                  <div className="absolute right-3 top-3 z-10 rounded border border-zinc-200 bg-white/80 px-2 py-1 text-[10px] font-bold text-zinc-700 backdrop-blur-sm">
                    分组 {slide.pageInGroup + 1}/{slide.totalInGroup}
                  </div>
                )}
                <div className="flex justify-center bg-zinc-50 px-4 pb-4 pt-10">
                  {renderSlideCard(slide, canvas.thumbnailScale)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 px-6 text-sm font-bold"
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onConfirm();
                onClose();
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="h-10 bg-zinc-900 px-6 text-sm font-bold text-white hover:bg-zinc-800"
          >
            {isSubmitting ? "导出中..." : `确认导出 ${slides.length} 页`}
          </Button>
        </div>
      </div>

      {activeSlide && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-6"
          onClick={() => setActiveSlideIndex(null)}
        >
          <div
            className="relative max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-2xl bg-white/95 p-3 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveSlideIndex(null)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-zinc-900 p-1.5 text-white hover:bg-zinc-700"
              aria-label="关闭放大预览"
            >
              <X className="size-4" />
            </button>
            <div className="mb-2 text-center text-xs font-bold text-zinc-600">
              第 {activeSlide.index + 1} 页（←/→ 切页，Esc 关闭）
            </div>
            {renderSlideCard(activeSlide, fittedLightboxScale)}
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev === null ? prev : Math.max(0, prev - 1),
                )
              }
              disabled={activeSlideIndex === 0}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-zinc-800 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-30 md:left-3"
              aria-label="上一页"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev === null ? prev : Math.min(slides.length - 1, prev + 1),
                )
              }
              disabled={activeSlideIndex === slides.length - 1}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-zinc-800 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-30 md:right-3"
              aria-label="下一页"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
