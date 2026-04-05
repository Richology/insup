"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { SlideItem, SlidePreviewMethods } from "@/types";
import type { PosterTheme } from "@/lib/poster-themes";
import { POSTER_FONTS } from "@/lib/fonts";
import { PPT_CONTENT_HEIGHT, PPT_SLIDE } from "@/config/constants";
import { calculateSlides } from "@/lib/paging/engine";
import { buildCanvasContentCSS } from "./canvas-content-css";

export const PPT_SLIDE_CONTENT_ID = "slide-content";

export function getPPTContentCSS(themeCSS: string, fontValue?: string): string {
  return buildCanvasContentCSS({
    themeCSS,
    contentId: PPT_SLIDE_CONTENT_ID,
    fontValue,
    baseFontSize: 17.5,
    lineHeight: 1.55,
    paragraphLineHeight: 1.45,
    blockSpacingEm: 0.55,
    contentHeight: PPT_CONTENT_HEIGHT,
    imageMaxRatio: 0.48,
    codeMaxRatio: 0.42,
    additionalCss: `
      #${PPT_SLIDE_CONTENT_ID} {
        letter-spacing: -0.01em;
      }
      #${PPT_SLIDE_CONTENT_ID} #insup-content h1 {
        font-size: 2.15em !important;
        line-height: 1.08 !important;
        margin-bottom: 0.45em !important;
      }
      #${PPT_SLIDE_CONTENT_ID} #insup-content h2 {
        font-size: 1.35em !important;
        line-height: 1.2 !important;
      }
      #${PPT_SLIDE_CONTENT_ID} #insup-content h3 {
        font-size: 1.05em !important;
      }
      #${PPT_SLIDE_CONTENT_ID} ul,
      #${PPT_SLIDE_CONTENT_ID} ol {
        margin: 0.5em 0 !important;
      }
      #${PPT_SLIDE_CONTENT_ID} li {
        margin: 0.25em 0 !important;
      }
      #${PPT_SLIDE_CONTENT_ID} table {
        font-size: 0.92em !important;
      }
      #${PPT_SLIDE_CONTENT_ID} blockquote {
        border-radius: 16px;
      }
    `,
  });
}

interface PPTSlidePreviewProps {
  html: string;
  theme: PosterTheme;
  font?: string;
}

export const PPTSlidePreview = forwardRef<
  SlidePreviewMethods,
  PPTSlidePreviewProps
>(({ html, theme, font = "system" }, ref) => {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html) return;

    const currentFontValue =
      POSTER_FONTS.find((item) => item.id === font)?.value ||
      POSTER_FONTS[0].value;

    let mounted = true;

    const run = async () => {
      const result = await calculateSlides(
        html,
        getPPTContentCSS(theme.css, currentFontValue),
        {
          contentWidth: PPT_SLIDE.WIDTH - PPT_SLIDE.PADDING_X * 2,
          contentHeight: PPT_CONTENT_HEIGHT,
          contentSelectorId: PPT_SLIDE_CONTENT_ID,
        },
      );

      if (mounted) {
        setSlides(result);
        setCurrent(0);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [font, html, theme.css]);

  const displaySlides =
    slides.length > 0
      ? slides
      : [{ html, sectionId: 0, pageInGroup: 0, totalInGroup: 1 }];

  const slideCount = displaySlides.length;

  const go = (dir: 1 | -1) => {
    setCurrent((prev) => Math.max(0, Math.min(slideCount - 1, prev + dir)));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) setDragOffset(e.clientX - startX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 70) go(-1);
    else if (dragOffset < -70) go(1);
    setDragOffset(0);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) setDragOffset(e.touches[0].clientX - startX);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 70) go(-1);
    else if (dragOffset < -70) go(1);
    setDragOffset(0);
  };

  const translateX = (() => {
    const base = -current * PPT_SLIDE.WIDTH;
    if (current === 0 && dragOffset > 0) return base + dragOffset * 0.25;
    if (current === slideCount - 1 && dragOffset < 0)
      return base + dragOffset * 0.25;
    return base + dragOffset;
  })();

  useImperativeHandle(ref, () => ({
    getSlidesCount: () => slideCount,
    getSlides: () => displaySlides,
    goToSlide: (index: number) =>
      setCurrent(Math.max(0, Math.min(slideCount - 1, index))),
    getCurrentSlide: () => current,
    goPrev: () => setCurrent((prev) => Math.max(0, prev - 1)),
    goNext: () => setCurrent((prev) => Math.min(slideCount - 1, prev + 1)),
  }));

  return (
    <div
      ref={containerRef}
      className="select-none"
      style={{
        width: `${PPT_SLIDE.WIDTH}px`,
        height: `${PPT_SLIDE.HEIGHT}px`,
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        background: theme.background,
        boxShadow: "0 30px 100px -60px rgba(0,0,0,0.6)",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <style>{getPPTContentCSS(theme.css, POSTER_FONTS.find((item) => item.id === font)?.value || POSTER_FONTS[0].value)}</style>

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
        <span>InSup Slides</span>
        <span>
          {current + 1} / {slideCount}
        </span>
      </div>

      <div style={{ overflow: "hidden", height: "100%" }}>
        <div
          style={{
            display: "flex",
            width: `${displaySlides.length * PPT_SLIDE.WIDTH}px`,
            height: "100%",
            transform: `translateX(${translateX}px)`,
            transition: isDragging
              ? "none"
              : "transform 0.45s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        >
          {displaySlides.map((slide, index) => (
            <div
              key={`${slide.sectionId}-${slide.pageInGroup}-${index}`}
              className="ppt-slide-page export-page"
              style={{
                width: `${PPT_SLIDE.WIDTH}px`,
                height: `${PPT_SLIDE.HEIGHT}px`,
                padding: `${PPT_SLIDE.PADDING_Y}px ${PPT_SLIDE.PADDING_X}px`,
                flexShrink: 0,
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div
                id={PPT_SLIDE_CONTENT_ID}
                style={{
                  width: "100%",
                  height: `${PPT_CONTENT_HEIGHT}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  id="insup-content"
                  dangerouslySetInnerHTML={{ __html: slide.html }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-2 backdrop-blur"
      >
        {Array.from({ length: slideCount }).map((_, index) => (
          <div
            key={index}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === current ? 18 : 6,
              height: 6,
              background:
                index === current ? "rgba(24,24,27,0.8)" : "rgba(24,24,27,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
});

PPTSlidePreview.displayName = "PPTSlidePreview";
