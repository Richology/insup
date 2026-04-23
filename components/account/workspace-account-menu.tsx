"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Clock3,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  WorkspaceAuthStatus,
  WorkspaceHistoryItem,
  WorkspaceProfile,
} from "@/lib/cloud/account";

interface WorkspaceAccountMenuProps {
  authStatus: WorkspaceAuthStatus;
  profile: WorkspaceProfile | null;
  historyItems: WorkspaceHistoryItem[];
  activeDocumentId: string | null;
  isRefreshing: boolean;
  isChangingPassword: boolean;
  isSigningOut: boolean;
  notice: string | null;
  error: string | null;
  onRefresh: () => void;
  onOpenHistoryItem: (id: string) => void;
  onChangePassword: (password: string) => boolean | Promise<boolean>;
  onSignOut: () => void | Promise<void>;
}

function formatHistoryTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function WorkspaceAccountMenu({
  authStatus,
  profile,
  historyItems,
  activeDocumentId,
  isRefreshing,
  isChangingPassword,
  isSigningOut,
  notice,
  error,
  onRefresh,
  onOpenHistoryItem,
  onChangePassword,
  onSignOut,
}: WorkspaceAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const triggerLabel = useMemo(() => {
    if (authStatus === "signed-in" && profile?.email) {
      return profile.displayName || profile.email.split("@")[0] || "账户";
    }

    if (authStatus === "loading") {
      return "同步中";
    }

    if (authStatus === "disabled") {
      return "未配置";
    }

    return "账户";
  }, [authStatus, profile]);

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordError(null);

    if (password.length < 8) {
      setPasswordError("密码至少需要 8 位。");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("两次输入的密码不一致。");
      return;
    }

    const didUpdate = await onChangePassword(password);

    if (didUpdate) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 gap-2 rounded-xl border border-zinc-200/60 bg-white/70 px-3 text-[12px] font-bold text-zinc-700 shadow-sm transition-all hover:bg-white hover:border-zinc-300",
          isOpen ? "border-zinc-400 ring-2 ring-zinc-100" : "",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <UserRound className="size-3.5" />
        <span className="max-w-28 truncate">{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "size-3 text-zinc-400 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_24px_70px_-30px_rgba(0,0,0,0.28)]"
          >
            <div className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                Workspace account
              </p>
              {authStatus === "signed-in" && profile ? (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
                    <Mail className="size-3.5 text-zinc-400" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <p className="text-xs leading-5 text-zinc-500">
                    已登录。这里可以查看云端草稿、修改密码和退出账号。
                  </p>
                </div>
              ) : authStatus === "disabled" ? (
                <p className="mt-3 text-sm leading-6 text-amber-700">
                  还没有配置 Supabase，账户能力暂时不可用。
                </p>
              ) : authStatus === "loading" ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="size-3.5 animate-spin" />
                  正在同步账号状态...
                </p>
              ) : null}
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
              {notice ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                  {notice}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              ) : null}

              {authStatus === "signed-in" && profile ? (
                <>
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black tracking-tight text-zinc-950">
                          账号信息
                        </h3>
                        <p className="text-xs leading-5 text-zinc-500">
                          当前邮箱先展示为只读，后续再接邮箱修改流程。
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                        Email
                      </p>
                      <p className="mt-2 text-sm font-semibold text-zinc-900">
                        {profile.email}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div>
                      <h3 className="text-sm font-black tracking-tight text-zinc-950">
                        修改密码
                      </h3>
                      <p className="text-xs leading-5 text-zinc-500">
                        更新后，下次登录请使用新密码。
                      </p>
                    </div>

                    <form className="space-y-3" onSubmit={handlePasswordSubmit}>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="新密码，至少 8 位"
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/70"
                      />
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="再次输入新密码"
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/70"
                      />

                      {passwordError ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                          {passwordError}
                        </div>
                      ) : null}

                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="h-10 rounded-2xl bg-zinc-900 px-4 text-sm font-bold text-white hover:bg-zinc-800"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            更新中
                          </>
                        ) : (
                          <>
                            <KeyRound className="size-4" />
                            更新密码
                          </>
                        )}
                      </Button>
                    </form>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-black tracking-tight text-zinc-950">
                          历史草稿
                        </h3>
                        <p className="text-xs leading-5 text-zinc-500">
                          打开任意一条，即可继续在当前工作台编辑。
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isRefreshing}
                        onClick={onRefresh}
                        className="h-8 rounded-xl px-2.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100"
                      >
                        {isRefreshing ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="size-3.5" />
                        )}
                        刷新
                      </Button>
                    </div>

                    {historyItems.length ? (
                      <div className="space-y-2">
                        {historyItems.map((item) => {
                          const isActive = item.id === activeDocumentId;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                onOpenHistoryItem(item.id);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "w-full rounded-2xl border px-4 py-3 text-left transition-all",
                                isActive
                                  ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white",
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold">
                                    {item.title}
                                  </p>
                                  <p
                                    className={cn(
                                      "mt-1 line-clamp-2 text-xs leading-5",
                                      isActive
                                        ? "text-white/75"
                                        : "text-zinc-500",
                                    )}
                                  >
                                    {item.summary || "这条草稿还没有摘要。"}
                                  </p>
                                </div>
                                <div
                                  className={cn(
                                    "inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold",
                                    isActive
                                      ? "text-white/75"
                                      : "text-zinc-400",
                                  )}
                                >
                                  <Clock3 className="size-3" />
                                  {formatHistoryTime(item.updatedAt)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-6 text-zinc-500">
                        还没有云端草稿。先在工作台里点击“保存云端”，这里就会出现历史记录。
                      </div>
                    )}
                  </section>

                  <section className="border-t border-zinc-100 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isSigningOut}
                      onClick={() => {
                        void onSignOut();
                        setIsOpen(false);
                      }}
                      className="h-10 rounded-2xl px-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100"
                    >
                      {isSigningOut ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          退出中
                        </>
                      ) : (
                        <>
                          <LogOut className="size-4" />
                          Logout
                        </>
                      )}
                    </Button>
                  </section>
                </>
              ) : authStatus === "signed-out" ? (
                <section className="space-y-3">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                      Local mode
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      现在仍然可以继续本地创作；登录之后，草稿历史和账号设置会自动可用。
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-2xl border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 hover:border-zinc-300 hover:bg-white"
                    >
                      <Link href="/auth">登录</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-10 rounded-2xl bg-zinc-900 px-4 text-sm font-bold text-white hover:bg-zinc-800"
                    >
                      <Link href="/auth?mode=sign-up">邮箱注册</Link>
                    </Button>
                  </div>
                </section>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
