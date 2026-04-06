"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { IPhoneMockup } from "./mockups/iphone-mockup";
import { DesktopMockup } from "./mockups/desktop-mockup";
import { XHSSlidePreview as PosterSlidePreview } from "./xhs-slide-preview";
import { PPTSlidePreview } from "./ppt-slide-preview";
import { PreviewContent } from "./preview-content";
import type { PosterTheme } from "@/lib/poster-themes";
import type { WechatTheme } from "@/lib/themes";
import type { SlidePreviewMethods } from "@/types";

interface PreviewSectionProps {
  layoutMode: string;
  previewMode: string;
  styleTheme: string;
  html: string;
  activeThemeCss: string;
  activeTheme: WechatTheme;
  activePosterTheme: PosterTheme;
  posterFont: string;
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  imgRadius: number;
  isUploading: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  posterSlideRef: React.RefObject<SlidePreviewMethods | null>;
  activeEditorLine?: number;
  activeEditorOffset?: number;
  forcePageIndex?: number;
  forcePageNonce?: number;
}

export const PreviewSection = ({
  layoutMode,
  previewMode,
  styleTheme,
  html,
  activeThemeCss,
  activeTheme,
  activePosterTheme,
  posterFont,
  posterShowHeader,
  posterShowFooter,
  imgRadius,
  isUploading,
  previewRef,
  posterSlideRef,
  activeEditorLine,
  activeEditorOffset,
  forcePageIndex,
  forcePageNonce,
}: PreviewSectionProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scalableContentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  const [posterMobileSlideState, setPosterMobileSlideState] = useState({
    current: 0,
    slideCount: 1,
  });

  const handlePosterMobileSlideStateChange = useCallback(
    (state: { current: number; slideCount: number }) => {
      setPosterMobileSlideState((prev) =>
        prev.current === state.current && prev.slideCount === state.slideCount
          ? prev
          : state,
      );
    },
    [],
  );

  const getWechatBackground = (theme: WechatTheme): string => {
    const bgMatch = theme.containerStyle.match(
      /(?:background|background-color):\s*(#[a-fA-F0-9]{3,6}|[a-z]+)/,
    );
    return bgMatch ? bgMatch[1] : "#ffffff";
  };

  const isPosterMode = styleTheme === "poster";
  const isSlideMode = styleTheme === "slide";

  useEffect(() => {
    const updateScale = () => {
      const viewport = viewportRef.current;
      const content = scalableContentRef.current;
      if (!viewport || !content) return;

      const viewportWidth = Math.max(viewport.clientWidth - 24, 320);
      const viewportHeight = Math.max(viewport.clientHeight - 24, 320);
      const naturalWidth = content.offsetWidth;
      const naturalHeight = content.offsetHeight;

      if (!naturalWidth || !naturalHeight) return;

      const nextScale = Math.min(
        viewportWidth / naturalWidth,
        viewportHeight / naturalHeight,
        1,
      );

      setFitScale(nextScale);
      setScaledSize({
        width: naturalWidth * nextScale,
        height: naturalHeight * nextScale,
      });
    };

    const frame = requestAnimationFrame(updateScale);
    const viewportObserver =
      typeof ResizeObserver !== "undefined" && viewportRef.current
        ? new ResizeObserver(updateScale)
        : null;
    const contentObserver =
      typeof ResizeObserver !== "undefined" && scalableContentRef.current
        ? new ResizeObserver(updateScale)
        : null;

    if (viewportObserver && viewportRef.current) {
      viewportObserver.observe(viewportRef.current);
    }

    if (contentObserver && scalableContentRef.current) {
      contentObserver.observe(scalableContentRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      cancelAnimationFrame(frame);
      viewportObserver?.disconnect();
      contentObserver?.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [html, layoutMode, posterFont, posterShowFooter, posterShowHeader, previewMode, styleTheme]);

  if (layoutMode === "edit") return null;

  const renderPosterPreview = () =>
    previewMode === "pc" ? (
      <div
        style={{
          background: "#ececeb",
          borderRadius: 18,
          padding: "40px 60px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "14px 14px 0 0",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
              <div
                key={color}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: "#f5f5f5",
              borderRadius: 6,
              height: 22,
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <span style={{ fontSize: 11, color: "#999" }}>InSup · Cards</span>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "0 0 14px 14px",
            padding: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PosterSlidePreview
            ref={posterSlideRef}
            html={html}
            theme={activePosterTheme}
            font={posterFont}
            activeLine={activeEditorLine}
            activeOffset={activeEditorOffset}
            forcePageIndex={forcePageIndex}
            forcePageNonce={forcePageNonce}
            showHeader={posterShowHeader}
            showFooter={posterShowFooter}
            hideMockUI
          />
        </div>
      </div>
    ) : (
      <div className="relative">
        <IPhoneMockup
          mode="poster"
          screenStyle={{ background: activePosterTheme.background }}
          hideStatusBar={false}
          showDynamicIsland
        >
          <div className="relative min-h-full w-full">
            <div className="flex w-full justify-center pt-4">
              <PosterSlidePreview
                ref={posterSlideRef}
                html={html}
                theme={activePosterTheme}
                font={posterFont}
                activeLine={activeEditorLine}
                activeOffset={activeEditorOffset}
                forcePageIndex={forcePageIndex}
                forcePageNonce={forcePageNonce}
                showHeader={posterShowHeader}
                showFooter={posterShowFooter}
                hideMockUI
                showNavigationControls={false}
                onSlideStateChange={handlePosterMobileSlideStateChange}
              />
            </div>

            {posterMobileSlideState.slideCount > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[52px] z-20 flex justify-center">
                <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/92 px-3 py-2 shadow-[0_14px_36px_rgba(0,0,0,0.14)] backdrop-blur">
                  <button
                    type="button"
                    title="上一页"
                    aria-label="上一页"
                    disabled={posterMobileSlideState.current === 0}
                    onClick={() => posterSlideRef.current?.goPrev()}
                    className="flex size-8 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-900/8 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <div className="flex items-center gap-2 px-1">
                    <span className="min-w-[2.5rem] text-center text-[10px] font-semibold text-zinc-500">
                      {posterMobileSlideState.current + 1}/
                      {posterMobileSlideState.slideCount}
                    </span>
                    {Array.from({
                      length: posterMobileSlideState.slideCount,
                    }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        title={`第 ${index + 1} 页`}
                        aria-label={`切换到第 ${index + 1} 页`}
                        aria-pressed={index === posterMobileSlideState.current}
                        onClick={() => posterSlideRef.current?.goToSlide(index)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: index === posterMobileSlideState.current ? 18 : 6,
                          height: 6,
                          background:
                            index === posterMobileSlideState.current
                              ? "rgba(24,24,27,0.82)"
                              : "rgba(24,24,27,0.2)",
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    title="下一页"
                    aria-label="下一页"
                    disabled={
                      posterMobileSlideState.current ===
                      posterMobileSlideState.slideCount - 1
                    }
                    onClick={() => posterSlideRef.current?.goNext()}
                    className="flex size-8 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-900/8 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </IPhoneMockup>
      </div>
    );

  const renderSlidePreview = () =>
    previewMode === "pc" ? (
      <DesktopMockup>
        <div className="flex h-full items-center justify-center rounded-[28px] bg-[#f2f1ed] p-8">
          <PPTSlidePreview
            ref={posterSlideRef}
            html={html}
            theme={activePosterTheme}
            font={posterFont}
            activeLine={activeEditorLine}
            activeOffset={activeEditorOffset}
            forcePageIndex={forcePageIndex}
            forcePageNonce={forcePageNonce}
          />
        </div>
      </DesktopMockup>
    ) : (
      <div className="relative flex flex-col items-center gap-4">
        <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500 shadow-sm">
          Slide Canvas
        </div>
        <PPTSlidePreview
          ref={posterSlideRef}
          html={html}
          theme={activePosterTheme}
          font={posterFont}
          activeLine={activeEditorLine}
          activeOffset={activeEditorOffset}
          forcePageIndex={forcePageIndex}
          forcePageNonce={forcePageNonce}
        />
      </div>
    );

  return (
    <motion.section
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center overflow-y-auto rounded-3xl border border-white/40 bg-white/20 p-4 backdrop-blur-sm no-scrollbar",
        layoutMode === "preview" ? "w-full" : "",
      )}
    >
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-zinc-100 bg-white/90 px-4 py-2 text-[12px] font-semibold text-indigo-500 shadow-lg backdrop-blur-xl"
          >
            <Loader2 className="size-3.5 animate-spin" />
            图片处理中...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col pt-4">
        <div
          ref={viewportRef}
          className="flex flex-1 items-center justify-center overflow-hidden"
        >
          <div
            className="relative flex items-center justify-center transition-[width,height] duration-300 ease-out"
            style={{
              width: scaledSize.width ? `${scaledSize.width}px` : "auto",
              height: scaledSize.height ? `${scaledSize.height}px` : "auto",
            }}
          >
            <div
              ref={scalableContentRef}
              className="origin-center transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${fitScale}) translateZ(0)`,
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {isPosterMode
                ? renderPosterPreview()
                : isSlideMode
                  ? renderSlidePreview()
                  : previewMode === "pc"
                    ? (
                      <DesktopMockup>
                        <PreviewContent
                          containerRef={previewRef}
                          html={html}
                          styleTheme={styleTheme}
                          imgRadius={imgRadius}
                          activeThemeCss={activeThemeCss}
                        />
                      </DesktopMockup>
                    )
                    : (
                      <IPhoneMockup
                        mode={previewMode}
                        screenStyle={{ background: getWechatBackground(activeTheme) }}
                      >
                        <PreviewContent
                          containerRef={previewRef}
                          html={html}
                          styleTheme={styleTheme}
                          imgRadius={imgRadius}
                          activeThemeCss={activeThemeCss}
                        />
                      </IPhoneMockup>
                    )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
