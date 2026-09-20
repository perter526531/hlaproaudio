"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useNav } from "@/store/nav";
import { useI18n } from "@/store/i18n";
import { useLogout, useMe } from "./hooks";
import { useSettingsAdmin } from "./hooks";
import { pick } from "@/lib/types";
import { AdminLogin } from "./AdminLogin";
import {
  AdminLayout,
  type AdminSection,
} from "./AdminLayout";
import { Dashboard } from "./Dashboard";
import { PageManager } from "./PageManager";
import { CategoryManager } from "./CategoryManager";
import { ProductManager } from "./ProductManager";
import { SubmissionViewer } from "./SubmissionViewer";
import { SettingsEditor } from "./SettingsEditor";

export function AdminApp() {
  const me = useMe();
  const setAdminMode = useNav((s) => s.setAdminMode);
  const logout = useLogout();
  const lang = useI18n((s) => s.lang);
  const { data: settings } = useSettingsAdmin();

  const [active, setActive] = React.useState<AdminSection>("dashboard");

  // Keep document lang in sync with the admin's UI language.
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    }
  }, [lang]);

  // Dynamic browser tab title in admin mode: "{Admin CMS} | {siteName}".
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const siteName =
      pick(settings?.siteNameEn, settings?.siteNameCn, lang) ?? "AudioCenter";
    const adminLabel = lang === "cn" ? "管理后台" : "Admin CMS";
    document.title = `${adminLabel} | ${siteName}`;
    const href = settings?.logo || "/logo.svg";
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [lang, settings]);

  function onViewSite() {
    setAdminMode(false);
  }

  async function onLogout() {
    try {
      await logout.mutateAsync();
    } catch {
      // ignore
    }
    // useMe refetch is auto-triggered via invalidation
  }

  // Loading state for initial /api/auth/me check
  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="size-6 animate-spin text-brand" />
      </div>
    );
  }

  // Not logged in -> show login
  if (!me.data?.user) {
    return <AdminLogin onSuccess={() => me.refetch()} />;
  }

  // Logged in -> show layout with active section
  return (
    <AdminLayout
      active={active}
      onNavigate={setActive}
      user={me.data.user}
      onLogout={onLogout}
      onViewSite={onViewSite}
    >
      {active === "dashboard" && <Dashboard onNavigate={setActive} />}
      {active === "pages" && <PageManager />}
      {active === "categories" && <CategoryManager />}
      {active === "products" && <ProductManager />}
      {active === "submissions" && <SubmissionViewer />}
      {active === "settings" && <SettingsEditor />}
    </AdminLayout>
  );
}
