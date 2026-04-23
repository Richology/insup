"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, LogOut, UserRound } from "lucide-react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type HomeAuthStatus = "loading" | "signed-in" | "signed-out" | "disabled";

export function HomeAccountEntry() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [authStatus, setAuthStatus] = useState<HomeAuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  useEffect(() => {
    if (!supabase) {
      setAuthStatus("disabled");
      return;
    }

    let isMounted = true;

    const syncUser = async (sessionUser?: User | null) => {
      const resolvedUser =
        sessionUser !== undefined
          ? sessionUser
          : (await supabase.auth.getUser()).data.user ?? null;

      if (!isMounted) return;

      setUser(resolvedUser);
      setAuthStatus(resolvedUser ? "signed-in" : "signed-out");
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        void syncUser(session?.user ?? null);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;

    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (authStatus !== "signed-in" || !user?.email) {
    return (
      <Button
        asChild
        variant="outline"
        className="rounded-full border-zinc-200 bg-white px-5 text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-white"
      >
        <Link href="/auth">
          {authStatus === "loading" ? "同步中..." : "登录"}
        </Link>
      </Button>
    );
  }

  const label = user.email.split("@")[0] || user.email;

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-11 gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-white",
          isOpen ? "border-zinc-400 ring-2 ring-zinc-100" : "",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <UserRound className="size-4" />
        <span className="max-w-28 truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-zinc-400 transition-transform duration-200",
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
            className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.28)]"
          >
            <div className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                Account
              </p>
              <p className="mt-2 truncate text-sm font-bold text-zinc-950">
                {user.email}
              </p>
            </div>

            <div className="space-y-3 px-5 py-5">
              <Button
                asChild
                className="h-11 w-full rounded-2xl bg-zinc-900 px-4 text-sm font-bold text-white hover:bg-zinc-800"
              >
                <Link href="/workspace">进入 Workspace</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSigningOut}
                onClick={() => {
                  void handleSignOut();
                }}
                className="h-11 w-full rounded-2xl border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 hover:border-zinc-300 hover:bg-white"
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
