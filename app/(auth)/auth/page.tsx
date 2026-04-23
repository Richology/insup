import type { Metadata } from "next";

import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "账户登录",
  description: "登录或注册 InSup 账号，继续同步和管理你的内容资产。",
};

interface AuthPageProps {
  searchParams: Promise<{
    mode?: string;
    verified?: string;
  }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = params.mode === "sign-up" ? "sign-up" : "sign-in";
  const verified = params.verified === "1";

  return <AuthScreen mode={mode} verified={verified} />;
}
