"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import TurndownService from "turndown";
import { markdownToHtml } from "@/lib/markdown";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { useStore } from "@/store/use-store";
import { getTheme } from "@/lib/themes";
import { getPosterTheme } from "@/lib/poster-themes";
import { POSTER_FONTS } from "@/lib/fonts";
import {
  POSTER_CARD,
  POSTER_CONTENT_HEIGHT,
  PPT_CONTENT_HEIGHT,
  PPT_SLIDE,
} from "@/config/constants";
import { storeImageLocally } from "@/lib/image_service";
import { exportToImage } from "@/lib/export-image";
import { injectReadInfo, getCleanText } from "@/lib/utils-content";
import JSZip from "jszip";

import type { EditorMethods } from "@/components/editor/mdx-editor";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/editor/top-nav";
import { ContextMenu } from "@/components/editor/context-menu";
import type { SlidePreviewMethods } from "@/types";
import { AnimatePresence } from "framer-motion";
import { getXHSContentCSS } from "@/components/editor/xhs-slide-preview";
import {
  getPPTContentCSS,
  PPT_SLIDE_CONTENT_ID,
} from "@/components/editor/ppt-slide-preview";
import { EditorSection } from "@/components/editor/editor-section";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { PreviewSection } from "@/components/editor/preview-section";
import { ExportPreviewDialog } from "@/components/editor/export-preview-dialog";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import {
  SlashFormatMenu,
  type SlashFormatCommandId,
} from "@/components/editor/slash-format-menu";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  fetchWorkspaceAccountSnapshot,
  fetchWorkspaceContentItem,
  type WorkspaceAuthStatus,
  type WorkspaceHistoryItem,
  type WorkspaceProfile,
} from "@/lib/cloud/account";
import { buildContentSummary, deriveContentTitle } from "@/lib/cloud/content";
import type { SelectionInfo, SlashTriggerInfo } from "@/types";

function isLayoutMode(value: unknown): value is "split" | "edit" | "preview" {
  return value === "split" || value === "edit" || value === "preview";
}

function isPreviewMode(
  value: unknown,
): value is "pc" | "app" | "poster" | "slide" {
  return (
    value === "pc" ||
    value === "app" ||
    value === "poster" ||
    value === "slide"
  );
}

function isStyleTheme(value: unknown): value is "wechat" | "poster" | "slide" {
  return value === "wechat" || value === "poster" || value === "slide";
}

function formatRecentDraftTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function InSupEditor() {
  const router = useRouter();
  const {
    markdown,
    setMarkdown,
    html,
    setHtml,
    previewMode,
    setPreviewMode,
    imgRadius,
    setImgRadius,
    styleTheme,
    setStyleTheme,
    wechatTheme,
    setWechatTheme,
    posterTheme,
    setPosterTheme,
    posterFont,
    setPosterFont,
    layoutMode,
    setLayoutMode,
    posterShowHeader,
    posterShowFooter,
    showWordCount,
    setShowWordCount,
    activeCloudDocumentId,
    activeCloudUserId,
    setActiveCloudDocument,
    clearActiveCloudDocument,
    undo,
    redo,
    pushHistory,
  } = useStore();

  const activeTheme = getTheme(wechatTheme);
  const activePosterTheme = getPosterTheme(posterTheme);
  const currentFontValue =
    POSTER_FONTS.find((f) => f.id === posterFont)?.value ||
    POSTER_FONTS[0].value;
  const activeWechatThemeCss = `${activeTheme.css}
    #insup-content {
      font-family: ${currentFontValue} !important;
    }
  `;
  const activeWechatContainerStyle = activeTheme.containerStyle.match(
    /font-family:[^;]+;/,
  )
    ? activeTheme.containerStyle.replace(
        /font-family:[^;]+;/,
        `font-family:${currentFontValue};`,
      )
    : `${activeTheme.containerStyle}font-family:${currentFontValue};`;
  const isVisualMode = styleTheme === "poster" || styleTheme === "slide";
  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posterSlideRef = useRef<SlidePreviewMethods>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isExportingPoster, setIsExportingPoster] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [authStatus, setAuthStatus] = useState<WorkspaceAuthStatus>("loading");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accountProfile, setAccountProfile] = useState<WorkspaceProfile | null>(
    null,
  );
  const [historyItems, setHistoryItems] = useState<WorkspaceHistoryItem[]>([]);
  const [isRefreshingAccount, setIsRefreshingAccount] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [recentDraftPromptId, setRecentDraftPromptId] = useState<string | null>(
    null,
  );
  const [dismissedRecentDraftId, setDismissedRecentDraftId] = useState<
    string | null
  >(null);
  const [exportProgress, setExportProgress] = useState<
    { current: number; total: number } | undefined
  >(undefined);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<
    {
      html: string;
      index: number;
      totalInGroup: number;
      pageInGroup: number;
      contentHeight?: number;
    }[]
  >([]);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [selectionCoords, setSelectionCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [slashTrigger, setSlashTrigger] = useState<SlashTriggerInfo | null>(null);
  const [forcePreviewPageIndex, setForcePreviewPageIndex] = useState<number | undefined>(undefined);
  const [forcePreviewPageNonce, setForcePreviewPageNonce] = useState(0);

  const handlePaste = async (e: React.ClipboardEvent | ClipboardEvent) => {
    const clipboardData =
      (e as React.ClipboardEvent).clipboardData ||
      (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData("text/html");
    const items = Array.from(clipboardData.items);

    const imageItem = items.find((item) => item.type.includes("image"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) handleImageFile(file);
      return;
    }

    if (htmlData && !clipboardData.types.includes("Files")) {
      e.preventDefault();
      const turndown = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        hr: "---",
      });
      turndown.keep(["kbd", "sup", "sub", "mark"]);
      const markdownContent = turndown.turndown(htmlData);
      if (editorRef.current) {
        editorRef.current.insertMarkdown(markdownContent);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        pushHistory();
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleWrapText = (before: string, after?: string) => {
    editorRef.current?.wrapSelection(before, after ?? before);
  };

  const handleInsertText = (text: string) => {
    editorRef.current?.insertMarkdown(text);
  };

  const handleInsertPageBreak = () => {
    handleInsertText("\n\n<!--pagebreak-->\n\n");
  };

  const handleInsertSpacer = () => {
    if (styleTheme === "slide") {
      handleInsertText(
        '\n<div data-insup-spacer="slide" style="height: 24px;"></div>\n',
      );
      return;
    }

    if (styleTheme === "poster") {
      handleInsertText(
        '\n<div data-insup-spacer="poster" style="height: 16px;"></div>\n',
      );
      return;
    }

    handleInsertText("<br />\n");
  };

  const handleInsertAtLineStart = (prefix: string) => {
    editorRef.current?.insertAtLineStart(prefix);
  };

  const closeSlashMenu = useCallback(() => {
    setSlashTrigger(null);
  }, []);

  const replaceSlashTrigger = useCallback(
    (text: string, cursorOffset = text.length) => {
      if (!slashTrigger) return;
      editorRef.current?.replaceRange(
        slashTrigger.from,
        slashTrigger.to,
        text,
        cursorOffset,
      );
      setSlashTrigger(null);
    },
    [slashTrigger],
  );

  const handleInsertTable = (rows: number, cols: number) => {
    const header = "| " + Array(cols).fill("标题").join(" | ") + " |";
    const divider = "| " + Array(cols).fill("---").join(" | ") + " |";
    const row = "| " + Array(cols).fill("内容").join(" | ") + " |";
    const table =
      "\n" + [header, divider, ...Array(rows).fill(row)].join("\n") + "\n";
    editorRef.current?.insertMarkdown(table);
    setActivePopup(null);
  };

  const applyPangu = () => {
    pushHistory();
    const text = editorRef.current?.getMarkdown() || markdown;
    const processed = text
      .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2")
      .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2");
    setMarkdown(processed);
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const localUrl = await storeImageLocally(file);
      if (editorRef.current) {
        editorRef.current.insertMarkdown(`![${file.name}](${localUrl})`);
      }
    } catch (err) {
      console.error("❌ 图片处理失败:", err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const contentToRender = showWordCount
        ? injectReadInfo(markdown)
        : markdown;
      const res = await markdownToHtml(contentToRender);
      setHtml(res);
    }, 150);
    return () => clearTimeout(timer);
  }, [markdown, styleTheme, showWordCount, setHtml]);

  const handleToggleWordCount = useCallback(
    (show: boolean) => {
      setShowWordCount(show);
      if (show) {
        setForcePreviewPageIndex(0);
        setForcePreviewPageNonce((prev) => prev + 1);
      }
    },
    [setShowWordCount],
  );

  const loadAccountSnapshot = useCallback(
    async (user: User, options?: { silent?: boolean }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setAuthStatus("disabled");
        return;
      }

      if (!options?.silent) {
        setIsRefreshingAccount(true);
      }

      try {
        const snapshot = await fetchWorkspaceAccountSnapshot(supabase, user);
        setAccountProfile(snapshot.profile);
        setHistoryItems(snapshot.history);
        setAccountError(null);
      } catch (error) {
        console.error("Load account snapshot failed:", error);
        setAccountError("账户信息加载失败，请稍后重试。");
      } finally {
        if (!options?.silent) {
          setIsRefreshingAccount(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthStatus("disabled");
      return;
    }

    let isMounted = true;

    const syncUserState = async (nextUser?: User | null) => {
      const resolvedUser =
        nextUser !== undefined
          ? nextUser
          : (await supabase.auth.getUser()).data.user ?? null;

      if (!isMounted) return;

      if (!resolvedUser) {
        setCurrentUser(null);
        setAuthStatus("signed-out");
        setAccountProfile(null);
        setHistoryItems([]);
        return;
      }

      if (
        activeCloudDocumentId &&
        activeCloudUserId &&
        activeCloudUserId !== resolvedUser.id
      ) {
        clearActiveCloudDocument();
      }

      setCurrentUser(resolvedUser);
      setAuthStatus("signed-in");
      await loadAccountSnapshot(resolvedUser);
    };

    void syncUserState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      void syncUserState(session?.user ?? null);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [
    activeCloudDocumentId,
    activeCloudUserId,
    clearActiveCloudDocument,
    loadAccountSnapshot,
  ]);

  useEffect(() => {
    const hasLinkedCloudDraft =
      authStatus === "signed-in" &&
      !!currentUser &&
      !!activeCloudDocumentId &&
      activeCloudUserId === currentUser.id;

    if (authStatus !== "signed-in" || !historyItems.length || hasLinkedCloudDraft) {
      setRecentDraftPromptId(null);
      return;
    }

    const latestDraft = historyItems[0];

    if (dismissedRecentDraftId === latestDraft.id) {
      setRecentDraftPromptId(null);
      return;
    }

    setRecentDraftPromptId(latestDraft.id);
  }, [
    activeCloudDocumentId,
    activeCloudUserId,
    authStatus,
    currentUser,
    dismissedRecentDraftId,
    historyItems,
  ]);

  const handleCopy = useCallback(async () => {
    try {
      if (isVisualMode) {
        let textToCopy = showWordCount ? injectReadInfo(markdown) : markdown;
        textToCopy = getCleanText(textToCopy);
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 2000);
        return;
      }

      if (!previewRef.current) return;
      const insupContentEl = previewRef.current.querySelector(
        "#insup-content",
      ) as HTMLElement | null;
      const target = insupContentEl ?? previewRef.current;
      const contentHtml = getInlinedHtml(target, { wechatOptimized: true });
      const finalHtml = getWeChatHtml(contentHtml, activeWechatContainerStyle);
      const textToCopy = showWordCount ? injectReadInfo(markdown) : markdown;
      const data = [
        new ClipboardItem({
          "text/html": new Blob([finalHtml], { type: "text/html" }),
          "text/plain": new Blob([textToCopy], { type: "text/plain" }),
        }),
      ];
      await navigator.clipboard.write(data);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("error");
    }
  }, [activeWechatContainerStyle, isVisualMode, markdown, showWordCount]);

  const handleRefreshAccount = useCallback(() => {
    if (!currentUser) return;
    void loadAccountSnapshot(currentUser);
  }, [currentUser, loadAccountSnapshot]);

  const handleOpenHistoryItem = useCallback(
    async (id: string) => {
      const supabase = getSupabaseBrowserClient();

      if (!supabase || !currentUser) {
        return;
      }

      try {
        const item = await fetchWorkspaceContentItem(supabase, currentUser, id);
        const nextStyleTheme =
          item.tags.find((tag) => isStyleTheme(tag)) ??
          (item.themeId === "slide" ? "slide" : "wechat");
        const nextPreviewMode = isPreviewMode(item.metadata.previewMode)
          ? item.metadata.previewMode
          : nextStyleTheme === "slide"
            ? "slide"
            : nextStyleTheme === "poster"
              ? "poster"
              : "app";

        pushHistory();
        setMarkdown(item.bodyMarkdown);
        setStyleTheme(nextStyleTheme);
        setPreviewMode(nextPreviewMode);

        if (isLayoutMode(item.layoutMode)) {
          setLayoutMode(item.layoutMode);
        }

        if (nextStyleTheme === "wechat" && item.themeId) {
          setWechatTheme(item.themeId);
        }

        if (nextStyleTheme === "poster" && item.themeId) {
          setPosterTheme(item.themeId);
        }

        if (typeof item.metadata.posterFont === "string") {
          setPosterFont(item.metadata.posterFont);
        }

        if (typeof item.metadata.showWordCount === "boolean") {
          handleToggleWordCount(item.metadata.showWordCount);
        }

        if (typeof item.metadata.imgRadius === "number") {
          setImgRadius(item.metadata.imgRadius);
        }

        setActiveCloudDocument(item.id, currentUser.id);
        setSaveStatus("idle");
        setRecentDraftPromptId(null);
        setDismissedRecentDraftId(item.id);
        setAccountError(null);
        setAccountNotice(`已载入《${item.title}》`);
      } catch (error) {
        console.error("Open history item failed:", error);
        setAccountError("读取历史草稿失败，请稍后重试。");
      }
    },
    [
      currentUser,
      pushHistory,
      setActiveCloudDocument,
      setImgRadius,
      setLayoutMode,
      setMarkdown,
      setPosterFont,
      setPosterTheme,
      setPreviewMode,
      setStyleTheme,
      setWechatTheme,
      handleToggleWordCount,
    ],
  );

  const handleChangePassword = useCallback(async (password: string) => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAccountError("账户服务尚未配置，暂时无法修改密码。");
      return false;
    }

    setIsChangingPassword(true);
    setAccountError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setAccountError(error.message);
        return false;
      }

      setAccountNotice("密码已更新，下次登录请使用新密码。");
      return true;
    } catch (error) {
      console.error("Update password failed:", error);
      setAccountError("密码更新失败，请稍后再试。");
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthStatus("disabled");
      return;
    }

    setIsSigningOut(true);
    setAccountError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAccountError(error.message);
        return;
      }

      clearActiveCloudDocument();
      setCurrentUser(null);
      setAccountProfile(null);
      setHistoryItems([]);
      setAuthStatus("signed-out");
      setAccountNotice("已退出账号，当前回到本地模式。");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }, [clearActiveCloudDocument, router]);

  const handleSaveDraft = useCallback(async () => {
    setSaveStatus("saving");
    setAccountError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setSaveStatus("error");
        setAccountError("账户服务尚未配置，暂时无法保存到云端。");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData.user;
      if (userError || !user) {
        setSaveStatus("error");
        setAccountNotice("登录后就能把当前内容保存到云端。");
        router.push("/auth");
        return;
      }

      const title = deriveContentTitle(markdown);
      const summary = buildContentSummary(markdown);
      const payload = {
        user_id: user.id,
        kind: "document",
        title,
        body_markdown: markdown,
        summary,
        theme_id:
          styleTheme === "wechat"
            ? wechatTheme
            : styleTheme === "poster"
              ? posterTheme
              : "slide",
        layout_mode: layoutMode,
        tags: [styleTheme],
        metadata: {
          previewMode,
          posterFont,
          showWordCount,
          imgRadius,
          source: "workspace",
        },
      };

      const shouldUpdateCurrentDraft =
        !!activeCloudDocumentId && activeCloudUserId === user.id;

      const request = shouldUpdateCurrentDraft
        ? supabase
            .from("content_items")
            .update(payload)
            .eq("id", activeCloudDocumentId)
            .eq("user_id", user.id)
            .select("id, title")
            .single()
        : supabase
            .from("content_items")
            .insert(payload)
            .select("id, title")
            .single();

      const { data, error } = await request;

      if (error) {
        setSaveStatus("error");
        console.error("Save draft failed:", error);
        setAccountError("云端保存失败，请稍后再试。");
        return;
      }

      if (data) {
        setActiveCloudDocument(data.id, user.id);
      }

      setSaveStatus("success");
      setAccountNotice(
        shouldUpdateCurrentDraft
          ? `已更新云端草稿《${title}》`
          : `已创建云端草稿《${title}》`,
      );
      await loadAccountSnapshot(user, { silent: true });
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Save draft failed:", error);
      setSaveStatus("error");
      setAccountError("云端保存失败，请稍后再试。");
    }
  }, [
    activeCloudDocumentId,
    activeCloudUserId,
    imgRadius,
    layoutMode,
    loadAccountSnapshot,
    markdown,
    posterFont,
    posterTheme,
    previewMode,
    router,
    setActiveCloudDocument,
    showWordCount,
    styleTheme,
    wechatTheme,
  ]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const activeElement =
        typeof document !== "undefined"
          ? (document.activeElement as HTMLElement | null)
          : null;
      const isEditorFocused = !!activeElement?.closest(".mdx-editor-container");
      const isSlidePreviewVisible =
        styleTheme === "slide" && layoutMode !== "edit" && !showExportPreview;

      if (isSlidePreviewVisible && !isEditorFocused) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          posterSlideRef.current?.goPrev();
          return;
        }

        if (e.key === "ArrowRight") {
          e.preventDefault();
          posterSlideRef.current?.goNext();
          return;
        }
      }

      if (!cmdOrCtrl) return;

      // Ctrl/Cmd + S - 复制到剪贴板
      if (e.key === "s") {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Ctrl/Cmd + / - 切换预览模式
      if (e.key === "/") {
        e.preventDefault();
        if (layoutMode === "edit") {
          setLayoutMode("preview");
        } else if (layoutMode === "preview") {
          setLayoutMode("split");
        } else {
          setLayoutMode("edit");
        }
        return;
      }

      // Ctrl/Cmd + Shift + P - 切换 PC/移动端预览
      if (e.shiftKey && e.key === "P") {
        e.preventDefault();
        if (styleTheme === "slide") {
          setPreviewMode(previewMode === "pc" ? "slide" : "pc");
        } else if (styleTheme === "poster") {
          setPreviewMode(previewMode === "pc" ? "poster" : "pc");
        } else {
          setPreviewMode(previewMode === "pc" ? "app" : "pc");
        }
        return;
      }

      // Ctrl/Cmd + Z - 撤销
      if (e.key === "z" && !e.shiftKey) {
        if (isEditorFocused) return;
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y - 重做
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        if (isEditorFocused) return;
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl/Cmd + B - 加粗
      if (e.key === "b") {
        e.preventDefault();
        if (styleTheme === "poster") {
          handleWrapText("「", "」");
        } else {
          handleWrapText("**");
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleCopy,
    layoutMode,
    previewMode,
    redo,
    setLayoutMode,
    setMarkdown,
    setPreviewMode,
    showExportPreview,
    styleTheme,
    undo,
  ]);

  const handleSelectionChange = (info: SelectionInfo) => {
    setSelection(info);
    if (!info.empty) {
      setSlashTrigger(null);
    }
    if (!info.empty) {
      setTimeout(() => {
        const coords = editorRef.current?.getSelectionCoords();
        if (coords) setSelectionCoords(coords);
      }, 0);
    } else {
      setSelectionCoords(null);
    }
  };

  const handleSlashCommand = useCallback(
    (commandId: SlashFormatCommandId) => {
      switch (commandId) {
        case "heading-1":
          replaceSlashTrigger("# ");
          return;
        case "heading-2":
          replaceSlashTrigger("## ");
          return;
        case "heading-3":
          replaceSlashTrigger("### ");
          return;
        case "heading-4":
          replaceSlashTrigger("#### ");
          return;
        case "heading-5":
          replaceSlashTrigger("##### ");
          return;
        case "heading-6":
          replaceSlashTrigger("###### ");
          return;
        case "strike":
          replaceSlashTrigger("~~~~", 2);
          return;
        case "bold":
          replaceSlashTrigger("****", 2);
          return;
        case "italic":
          replaceSlashTrigger("**", 1);
          return;
        case "underline":
          replaceSlashTrigger("<u></u>", 3);
          return;
        case "inline-code":
          replaceSlashTrigger("``", 1);
          return;
        case "formula":
          replaceSlashTrigger("$$", 1);
          return;
        case "bullet-list":
          replaceSlashTrigger("- ");
          return;
        case "ordered-list":
          replaceSlashTrigger("1. ");
          return;
        case "quote":
          replaceSlashTrigger("> ");
          return;
        case "code-block":
          replaceSlashTrigger("\n```js\n\n```\n", 8);
          return;
        case "divider":
          replaceSlashTrigger("\n\n---\n\n", 7);
          return;
        case "link":
          replaceSlashTrigger("[](url)", 1);
          return;
        case "table":
          replaceSlashTrigger(
            "| 标题 | 标题 |\n| --- | --- |\n| 内容 | 内容 |\n",
            2,
          );
          return;
        case "image":
          replaceSlashTrigger("![](url)", 2);
          return;
        default:
          return;
      }
    },
    [replaceSlashTrigger],
  );



  const handleExportPoster = async () => {
    if (!posterSlideRef.current) return;

    // 直接从幻灯片组件获取带分页信息的列表
    const allSlides = posterSlideRef.current.getSlides();
    const slidesForPreview = allSlides.map((s, i) => ({
      html: s.html,
      index: i,
      totalInGroup: s.totalInGroup,
      pageInGroup: s.pageInGroup,
      contentHeight: s.contentHeight,
    }));

    setPreviewSlides(slidesForPreview);
    setShowExportPreview(true);
  };

  const handleConfirmExport = async () => {
    if (!posterSlideRef.current) return;
    setIsExportingPoster(true);
    setExportProgress({ current: 0, total: 0 });
    try {
      const totalSlides = posterSlideRef.current.getSlidesCount();
      setExportProgress({ current: 0, total: totalSlides });
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);

      const slidePages = Array.from(
        document.querySelectorAll(".export-page"),
      ) as HTMLElement[];

      if (slidePages.length < totalSlides) {
        throw new Error(
          `导出失败：页面节点不足（${slidePages.length}/${totalSlides}）`,
        );
      }

      const exportBaseName =
        styleTheme === "slide" ? "insup-slide" : "insup-card";
      const exportScale = styleTheme === "slide" ? 2 : 3;
      const validResults: { filename: string; dataUrl: string; base64Data: string }[] = [];
      for (let i = 0; i < totalSlides; i++) {
        const slidePage = slidePages[i];
        const dataUrl = (await exportToImage(slidePage as HTMLElement, {
          filename: `${exportBaseName}-${timestamp}-${i + 1}-of-${totalSlides}`,
          format: "png",
          scale: exportScale,
          backgroundColor: activePosterTheme.background,
          returnDataUrl: true,
        })) as string;

        if (dataUrl) {
          const filename = `${exportBaseName}-${timestamp}-${i + 1}-of-${totalSlides}.png`;
          validResults.push({ filename, dataUrl, base64Data: dataUrl.split(",")[1] });
        }
        setExportProgress({ current: i + 1, total: totalSlides });
      }

      const zip = new JSZip();
      validResults.forEach((result) => {
        zip.file(result.filename, result.base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${exportBaseName}-export-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExportingPoster(false);
      setExportProgress(undefined);
    }
  };

  const isLinkedCloudDraft =
    authStatus === "signed-in" &&
    !!currentUser &&
    !!activeCloudDocumentId &&
    activeCloudUserId === currentUser.id;
  const recentDraftPrompt =
    recentDraftPromptId != null
      ? historyItems.find((item) => item.id === recentDraftPromptId) ?? null
      : null;
  const saveDraftLabel =
    authStatus !== "signed-in"
      ? "登录后保存"
      : isLinkedCloudDraft
        ? "更新云端草稿"
        : "保存云端";

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-[#f7f7f5] selection:bg-zinc-900 selection:text-white"
      onDragOver={(e) => e.preventDefault()}
    >
      <TopNav
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        styleTheme={styleTheme}
        setStyleTheme={setStyleTheme}
        wechatTheme={wechatTheme}
        setWechatTheme={setWechatTheme}
        posterTheme={posterTheme}
        setPosterTheme={setPosterTheme}
        posterFont={posterFont}
        setPosterFont={setPosterFont}
        onCopy={handleCopy}
        copyStatus={copyStatus}
        previewRef={previewRef}
        markdown={markdown}
        onExportPoster={handleExportPoster}
        isExportingPoster={isExportingPoster}
        exportProgress={exportProgress}
        showWordCount={showWordCount}
        setShowWordCount={handleToggleWordCount}
        onSaveDraft={handleSaveDraft}
        saveDraftLabel={saveDraftLabel}
        saveStatus={saveStatus}
        authStatus={authStatus}
        accountProfile={accountProfile}
        historyItems={historyItems}
        activeDocumentId={isLinkedCloudDraft ? activeCloudDocumentId : null}
        isRefreshingAccount={isRefreshingAccount}
        isChangingPassword={isChangingPassword}
        isSigningOut={isSigningOut}
        accountNotice={accountNotice}
        accountError={accountError}
        onRefreshAccount={handleRefreshAccount}
        onOpenHistoryItem={handleOpenHistoryItem}
        onChangePassword={handleChangePassword}
        onSignOut={handleSignOut}
      />

      {recentDraftPrompt ? (
        <div className="px-6 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-zinc-200 bg-white/88 px-5 py-4 shadow-[0_16px_40px_-30px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                Recent cloud draft
              </p>
              <p className="mt-2 text-sm font-bold text-zinc-950">
                检测到最近云端草稿《{recentDraftPrompt.title}》
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                最近更新于 {formatRecentDraftTime(recentDraftPrompt.updatedAt)}。
                你可以恢复这篇草稿，或者继续保留当前本地内容。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void handleOpenHistoryItem(recentDraftPrompt.id);
                }}
                className="h-10 rounded-2xl border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 hover:border-zinc-300 hover:bg-white"
              >
                恢复最近草稿
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDismissedRecentDraftId(recentDraftPrompt.id);
                  setRecentDraftPromptId(null);
                }}
                className="h-10 rounded-2xl px-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100"
              >
                继续当前内容
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="relative flex flex-1 gap-6 overflow-hidden px-6 pb-6 pt-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <EditorSection
            key="editor"
            layoutMode={layoutMode}
            markdown={markdown}
            setMarkdown={setMarkdown}
            editorRef={editorRef}
            onPaste={handlePaste}
            onFileUpload={handleFileUpload}
            onImageFile={handleImageFile}
            isUploading={isUploading}
            styleTheme={styleTheme}
            onPushHistory={pushHistory}
            floatingToolbar={
              <>
                <FloatingToolbar
                  isVisible={!!selection && !selection.empty}
                  coords={selectionCoords}
                  onWrapText={handleWrapText}
                  onBold={() => {
                    if (styleTheme === "poster") handleWrapText("「", "」");
                    else handleWrapText("**");
                  }}
                />
                <SlashFormatMenu
                  trigger={slashTrigger}
                  onClose={closeSlashMenu}
                  onSelect={handleSlashCommand}
                />
              </>
            }
            toolbar={
              layoutMode !== "preview" && (
                <MarkdownToolbar
                  onWrapText={handleWrapText}
                  onInsertText={handleInsertText}
                  onInsertAtLineStart={handleInsertAtLineStart}
                  onApplyPangu={applyPangu}
                  onInsertTable={handleInsertTable}
                  onHeading={(level: 1 | 2) => {
                    if (styleTheme === "poster") {
                      if (level === 1)
                        handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
                      else handleInsertText("\n📍 ");
                    } else if (styleTheme === "slide") {
                      handleInsertAtLineStart(level === 1 ? "# " : "## ");
                    } else {
                      handleInsertAtLineStart(level === 1 ? "# " : "## ");
                    }
                  }}
                  onBold={() => {
                    if (styleTheme === "poster") handleWrapText("「", "」");
                    else handleWrapText("**");
                  }}
                  onSeparator={() => {
                    if (styleTheme === "poster")
                      handleInsertText("\n" + "━".repeat(15) + "\n");
                    else handleInsertText("\n\n---\n\n");
                  }}
                  onInsertPageBreak={handleInsertPageBreak}
                  onInsertSpacer={handleInsertSpacer}
                  onQuote={() => {
                    if (styleTheme === "poster") handleInsertText("\n✅ ");
                    else handleInsertAtLineStart("> ");
                  }}
                  onInsertImage={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageFile(file);
                    };
                    input.click();
                  }}
                  onImportMarkdown={() => {
                    const input = document.getElementById(
                      "md-import-input",
                    ) as HTMLInputElement;
                    input?.click();
                  }}
                  activePopup={activePopup}
                  setActivePopup={setActivePopup}
                />
              )
            }
            onSelectionChange={handleSelectionChange}
            onSlashTrigger={setSlashTrigger}
            onInsertPageBreak={handleInsertPageBreak}
          />

          <PreviewSection
            key="preview"
            layoutMode={layoutMode}
            previewMode={previewMode}
            styleTheme={styleTheme}
            html={html}
            activeThemeCss={activeWechatThemeCss}
            activeTheme={activeTheme}
            activePosterTheme={activePosterTheme}
            posterFont={posterFont}
            posterShowHeader={posterShowHeader}
            posterShowFooter={posterShowFooter}
            imgRadius={imgRadius}
            isUploading={isUploading}
            previewRef={previewRef}
            posterSlideRef={posterSlideRef}
            activeEditorLine={selection?.fromLine}
            activeEditorOffset={selection?.from}
            forcePageIndex={forcePreviewPageIndex}
            forcePageNonce={forcePreviewPageNonce}
          />
        </AnimatePresence>
      </main>

      <AnimatePresence>
        <ContextMenu
          key="context-menu"
          onUndo={undo}
          onRedo={redo}
          onCopy={handleCopy}
          onCut={() => document.execCommand("cut")}
          onPaste={() => {}}
          onInsertLink={() => {}}
          onInsertImage={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleImageFile(file);
            };
            input.click();
          }}
          onInsertHeading={() => {
            if (styleTheme === "poster") {
              handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
            } else {
              handleInsertAtLineStart("# ");
            }
          }}
          onInsertSeparator={() => {
            if (styleTheme === "poster") {
              handleInsertText("\n" + "━".repeat(15) + "\n");
            } else {
              handleInsertText("\n\n---\n\n");
            }
          }}
          onInsertPageBreak={handleInsertPageBreak}
          separatorLabel={styleTheme === "poster" ? "插入装饰分隔线" : "插入分隔线"}
          pageBreakLabel="插入强制分页符（<!--pagebreak-->）"
          targetSelector=".mdx-editor-container"
        />
      </AnimatePresence>

      <ExportPreviewDialog
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
        onConfirm={handleConfirmExport}
        slides={previewSlides}
        themeBackground={activePosterTheme.background}
        themeCSS={
          styleTheme === "slide"
            ? getPPTContentCSS(
                activePosterTheme.css,
                currentFontValue,
              )
            : getXHSContentCSS(
                activePosterTheme.css,
                currentFontValue,
              )
        }
        canvas={
          styleTheme === "slide"
            ? {
                width: PPT_SLIDE.WIDTH,
                height: PPT_SLIDE.HEIGHT,
                statusHeight: PPT_SLIDE.STATUS_HEIGHT,
                footerHeight: PPT_SLIDE.FOOTER_HEIGHT,
                contentHeight: PPT_CONTENT_HEIGHT,
                paddingX: PPT_SLIDE.PADDING_X,
                paddingY: PPT_SLIDE.PADDING_Y,
                contentSelector: PPT_SLIDE_CONTENT_ID,
                thumbnailScale: 0.24,
                lightboxScale: 0.78,
              }
            : {
                width: POSTER_CARD.WIDTH,
                height: POSTER_CARD.HEIGHT,
                statusHeight: POSTER_CARD.STATUS_HEIGHT,
                footerHeight: POSTER_CARD.FOOTER_HEIGHT,
                contentHeight: POSTER_CONTENT_HEIGHT,
                paddingX: POSTER_CARD.PADDING_X,
                paddingY: POSTER_CARD.PADDING_Y,
                contentSelector: "xhs-content",
                thumbnailScale: 0.5,
                lightboxScale: 1,
              }
        }
      />
    </div>
  );
}
