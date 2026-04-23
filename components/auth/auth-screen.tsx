"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { InSupLockup } from "@/components/brand/insup-lockup";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

interface AuthScreenProps {
  mode: AuthMode;
  verified?: boolean;
}

const fieldClassName =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/70";

const modeOptions = [
  { id: "sign-in" as const, label: "登录", href: "/auth" },
  { id: "sign-up" as const, label: "邮箱注册", href: "/auth?mode=sign-up" },
];

function getSignInErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("email not confirmed") ||
    normalized.includes("email not verified")
  ) {
    return "这个账号还没有完成邮箱验证，请先去邮箱点击验证链接。";
  }

  return "账号不存在或密码不正确。如果你是第一次使用，请先注册。";
}

function getSignUpErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("user already registered")
  ) {
    return "这个邮箱已经注册过了，直接登录即可。";
  }

  return message;
}

function getEmailRedirectUrl() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/auth?verified=1`;
}

export function AuthScreen({ mode, verified = false }: AuthScreenProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const isSignIn = mode === "sign-in";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isHandlingVerifiedReturn, setIsHandlingVerifiedReturn] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const isStatusState = !!pendingVerificationEmail || verified;

  const title = isSignIn ? "欢迎回来" : "创建你的 InSup 账号";
  const subtitle = isSignIn
    ? "登录后即可同步草稿、查看历史记录，并继续在同一个账户下创作。"
    : "保持本地优先的同时，把你的云端草稿和账户信息收进一个干净的工作流。";
  const primaryLabel = isSignIn ? "登录并进入工作台" : "创建账号";
  useEffect(() => {
    setError(null);
    setNotice(null);
    setPassword("");
    setConfirmPassword("");
  }, [mode]);

  useEffect(() => {
    if (!verified) return;

    setError(null);
    setPendingVerificationEmail(null);
    setIsHandlingVerifiedReturn(true);
    setNotice("邮箱验证成功，正在进入工作台...");

    if (!supabase) {
      setIsHandlingVerifiedReturn(false);
      setNotice("邮箱验证成功，请直接登录进入工作台。");
      return;
    }

    let isMounted = true;
    let redirectTimer: number | undefined;

    const finishWithoutSession = () => {
      if (!isMounted) return;
      setIsHandlingVerifiedReturn(false);
      setNotice("邮箱验证成功，请直接登录进入工作台。");
    };

    const handleVerifiedSession = async (session: Session | null) => {
      if (!session?.user || !isMounted) return;

      redirectTimer = window.setTimeout(() => {
        router.replace("/workspace");
        router.refresh();
      }, 700);
    };

    void supabase.auth
      .getSession()
      .then(
        ({ data }: { data: { session: Session | null } }) => {
          void handleVerifiedSession(data.session);
        },
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        void handleVerifiedSession(session);
      },
    );

    const fallbackTimer = window.setTimeout(() => {
      finishWithoutSession();
    }, 2500);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.clearTimeout(fallbackTimer);
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [verified, supabase, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!supabase || !pendingVerificationEmail || resendCooldown > 0) {
      return;
    }

    setIsResendingVerification(true);
    setError(null);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: pendingVerificationEmail,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
        },
      });

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setNotice(`验证邮件已重新发送到 ${pendingVerificationEmail}，请查收邮箱。`);
      setResendCooldown(60);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleRestartRegistration = () => {
    setPendingVerificationEmail(null);
    setError(null);
    setNotice(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setResendCooldown(0);
    router.replace("/auth?mode=sign-up");
  };

  const statusEyebrow = verified ? "Account ready" : "Sign up complete";
  const statusTitle = verified ? "欢迎回来" : "注册成功";
  const statusDescription = verified
    ? "邮箱验证已经完成，账号可以正常使用了。"
    : pendingVerificationEmail
      ? `验证邮件已经发送到 ${pendingVerificationEmail}。完成邮箱验证后，账号能力就会自动生效。`
      : "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!supabase) {
      setError(
        "缺少 Supabase 环境变量，请先配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。",
      );
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("请输入邮箱和密码。");
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      setError("两次输入的密码不一致。");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignIn) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          if (
            signInError.message.toLowerCase().includes("email not confirmed") ||
            signInError.message.toLowerCase().includes("email not verified")
          ) {
            setPendingVerificationEmail(email.trim());
          }
          setError(getSignInErrorMessage(signInError.message));
          return;
        }

        router.replace("/workspace");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
        },
      });

      if (signUpError) {
        setError(getSignUpErrorMessage(signUpError.message));
        return;
      }

      if (data.session) {
        router.replace("/workspace");
        router.refresh();
        return;
      }

      setPendingVerificationEmail(email.trim());
      setResendCooldown(60);
      setNotice(
        `注册成功，验证链接已发送到 ${email.trim()}。请先去邮箱完成验证。`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5ef_0%,#f2efe7_48%,#f8f7f3_100%)] text-zinc-950">
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(24,24,27,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(255,255,255,0)_72%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <InSupLockup priority />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
            >
              返回首页
            </Link>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 rounded-full border-zinc-200 bg-white/85 px-4 text-sm font-bold text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-white"
            >
              <Link href="/workspace">继续本地创作</Link>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-10 md:py-14">
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[560px]"
          >
            <div className="rounded-[36px] border border-white/70 bg-white/88 p-5 shadow-[0_28px_90px_-50px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Account
                </span>
                <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
                  {modeOptions.map((option) => {
                    const isActive = option.id === mode;
                    return (
                      <Link
                        key={option.id}
                        href={option.href}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-bold transition-all",
                          isActive
                            ? "bg-white text-zinc-950 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-900",
                        )}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-zinc-400">
                  {isStatusState ? statusEyebrow : isSignIn ? "Sign in" : "Sign up"}
                </p>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 md:text-[2.6rem] md:leading-[1.02]">
                  {isStatusState ? statusTitle : title}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-zinc-500 md:text-[15px]">
                  {isStatusState ? statusDescription : subtitle}
                </p>
                {!isStatusState ? (
                  <div className="inline-flex max-w-xl items-start gap-3 rounded-[24px] border border-zinc-200 bg-zinc-50/80 px-4 py-4">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900">本地优先</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        不登录也能继续创作。账号只负责同步草稿、历史记录和后续账户能力。
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {isStatusState ? (
                <div className="mt-8 space-y-4">
                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {notice ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                      <div className="flex items-start gap-2">
                        {isHandlingVerifiedReturn ? (
                          <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />
                        ) : null}
                        <span>{notice}</span>
                      </div>
                    </div>
                  ) : null}

                  <Button
                    asChild={!isHandlingVerifiedReturn}
                    type="button"
                    disabled={isHandlingVerifiedReturn}
                    className="h-12 w-full rounded-2xl bg-zinc-900 px-5 text-sm font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isHandlingVerifiedReturn ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        正在进入 Workspace...
                      </span>
                    ) : (
                      <Link href="/workspace">
                        <span className="inline-flex items-center gap-2">
                          进入 Workspace
                          <ArrowRight className="size-4" />
                        </span>
                      </Link>
                    )}
                  </Button>

                  {pendingVerificationEmail ? (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isResendingVerification || resendCooldown > 0}
                        onClick={() => {
                          void handleResendVerification();
                        }}
                        className="h-10 rounded-2xl border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 hover:border-zinc-300 hover:bg-white"
                      >
                        {isResendingVerification
                          ? "发送中..."
                          : resendCooldown > 0
                            ? `${resendCooldown}s 后可重发`
                            : "重新发送验证邮件"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRestartRegistration}
                        className="h-10 rounded-2xl px-1 text-sm font-bold text-zinc-700 hover:bg-transparent hover:text-zinc-950"
                      >
                        换一个邮箱重新注册
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">邮箱</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      className={fieldClassName}
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">密码</span>
                    <input
                      type="password"
                      autoComplete={isSignIn ? "current-password" : "new-password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={isSignIn ? "输入密码" : "至少 8 位"}
                      className={fieldClassName}
                    />
                  </label>

                  {!isSignIn ? (
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-zinc-700">
                        确认密码
                      </span>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="再次输入密码"
                        className={fieldClassName}
                      />
                    </label>
                  ) : null}

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {notice ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                      <div className="flex items-start gap-2">
                        {isHandlingVerifiedReturn ? (
                          <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />
                        ) : null}
                        <span>{notice}</span>
                      </div>
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !supabase}
                    className="h-12 w-full rounded-2xl bg-zinc-900 px-5 text-sm font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="size-4 animate-pulse" />
                        处理中...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        {primaryLabel}
                        <ArrowRight className="size-4" />
                      </span>
                    )}
                  </Button>

                  {isSignIn ? (
                    <p className="text-sm leading-6 text-zinc-500">
                      还没有账号？
                      <Link
                        href="/auth?mode=sign-up"
                        className="ml-1 font-bold text-zinc-900 transition-opacity hover:opacity-70"
                      >
                        先注册
                      </Link>
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-zinc-500">
                      已经有账号了？
                      <Link
                        href="/auth"
                        className="ml-1 font-bold text-zinc-900 transition-opacity hover:opacity-70"
                      >
                        直接登录
                      </Link>
                    </p>
                  )}
                </form>
              )}

              {!supabase ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-700">
                  还没有配置 Supabase。先补齐环境变量后，这个页面就能真正创建和登录账号。
                </div>
              ) : null}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
