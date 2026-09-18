"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n, tr } from "@/store/i18n";
import { useLogin } from "./hooks";

export interface AdminLoginProps {
  /** Called when login succeeds so parent can refetch /api/auth/me. */
  onSuccess?: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const lang = useI18n((s) => s.lang);
  const login = useLogin();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      toast.error(lang === "cn" ? "请填写用户名和密码" : "Please enter username and password");
      return;
    }
    setSubmitting(true);
    try {
      await login.mutateAsync({ username, password });
      toast.success(lang === "cn" ? "登录成功" : "Login successful");
      onSuccess?.();
    } catch (err) {
      toast.error(lang === "cn" ? "用户名或密码错误" : "Invalid credentials");
      void err;
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || login.isPending;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative background gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 size-[28rem] rounded-full bg-brand/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md">
          <CardContent className="p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-md bg-brand text-primary-foreground shadow-lg shadow-brand/30">
                <span className="text-lg font-bold">A</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                AUDIO<span className="text-brand">CENTER</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {tr("admin_login", lang)}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ac-username" className="text-xs uppercase tracking-wider text-muted-foreground">
                  {tr("admin_username", lang)}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ac-username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={tr("admin_username", lang)}
                    className="pl-9"
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ac-password" className="text-xs uppercase tracking-wider text-muted-foreground">
                  {tr("admin_password", lang)}
                </Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ac-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr("admin_password", lang)}
                    className="pl-9"
                    disabled={busy}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="brand-gradient w-full text-primary-foreground"
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {lang === "cn" ? "登录中..." : "Signing in..."}
                  </>
                ) : (
                  tr("admin_login", lang)
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              {lang === "cn"
                ? "默认账号 admin / admin123"
                : "Default: admin / admin123"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
