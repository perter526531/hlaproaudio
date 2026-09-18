"use client";

import * as React from "react";
import {
  Globe,
  Image as ImageIcon,
  Info,
  Loader2,
  Phone,
  Save,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useI18n, tr } from "@/store/i18n";
import { useSettingsAdmin, useUpdateSettings } from "./hooks";
import { ImageUploader } from "./ImageUploader";
import type { SiteSetting } from "./types";

const SOCIAL_FIELDS: { key: keyof SiteSetting; en: string; cn: string }[] = [
  { key: "whatsapp", en: "WhatsApp", cn: "WhatsApp" },
  { key: "wechat", en: "WeChat", cn: "微信" },
  { key: "facebook", en: "Facebook", cn: "Facebook" },
  { key: "youtube", en: "YouTube", cn: "YouTube" },
  { key: "instagram", en: "Instagram", cn: "Instagram" },
  { key: "linkedin", en: "LinkedIn", cn: "LinkedIn" },
];

const SETTING_KEYS = [
  "logo",
  "phoneEn",
  "phoneCn",
  "emailEn",
  "emailCn",
  "addressEn",
  "addressCn",
  "whatsapp",
  "wechat",
  "facebook",
  "youtube",
  "instagram",
  "linkedin",
  "copyrightEn",
  "copyrightCn",
] as const;

export function SettingsEditor() {
  const lang = useI18n((s) => s.lang);
  const { data, isLoading } = useSettingsAdmin();
  const update = useUpdateSettings();

  const [form, setForm] = React.useState<Record<string, string>>(
    () => Object.fromEntries(SETTING_KEYS.map((k) => [k, ""]))
  );

  React.useEffect(() => {
    if (!data) return;
    const next: Record<string, string> = {};
    for (const k of SETTING_KEYS) {
      // @ts-expect-error dynamic access on SiteSetting
      next[k] = (data[k] as string | null) ?? "";
    }
    setForm(next);
  }, [data]);

  function setField(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    try {
      // Send all fields; the API ignores undefined but accepts all keys.
      await update.mutateAsync({
        logo: form.logo || null,
        phoneEn: form.phoneEn || null,
        phoneCn: form.phoneCn || null,
        emailEn: form.emailEn || null,
        emailCn: form.emailCn || null,
        addressEn: form.addressEn || null,
        addressCn: form.addressCn || null,
        whatsapp: form.whatsapp || null,
        wechat: form.wechat || null,
        facebook: form.facebook || null,
        youtube: form.youtube || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
        copyrightEn: form.copyrightEn || null,
        copyrightCn: form.copyrightCn || null,
      });
      toast.success(lang === "cn" ? "设置已保存" : "Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {tr("admin_settings", lang)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === "cn"
              ? "管理 Logo、联系方式与社交媒体链接"
              : "Manage logo, contact info and social links"}
          </p>
        </div>
        <Button onClick={onSave} disabled={update.isPending}>
          {update.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {tr("save", lang)}
        </Button>
      </div>

      {/* Logo */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ImageIcon className="size-4 text-brand" />
            {lang === "cn" ? "网站 Logo" : "Site Logo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            label={lang === "cn" ? "Logo 图片" : "Logo Image"}
            value={form.logo}
            onChange={(v) => setField("logo", v)}
            previewClassName="h-24 w-24"
            hint={lang === "cn" ? "推荐透明背景 PNG/SVG" : "Transparent PNG/SVG recommended"}
          />
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-brand" />
            {lang === "cn" ? "联系方式" : "Contact Info"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldLabel label={`${lang === "cn" ? "电话" : "Phone"} (EN)`}>
              <Input
                value={form.phoneEn}
                onChange={(e) => setField("phoneEn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "电话" : "Phone"} (中文)`}>
              <Input
                value={form.phoneCn}
                onChange={(e) => setField("phoneCn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "邮箱" : "Email"} (EN)`}>
              <Input
                value={form.emailEn}
                onChange={(e) => setField("emailEn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "邮箱" : "Email"} (中文)`}>
              <Input
                value={form.emailCn}
                onChange={(e) => setField("emailCn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "地址" : "Address"} (EN)`}>
              <Textarea
                rows={2}
                value={form.addressEn}
                onChange={(e) => setField("addressEn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "地址" : "Address"} (中文)`}>
              <Textarea
                rows={2}
                value={form.addressCn}
                onChange={(e) => setField("addressCn", e.target.value)}
              />
            </FieldLabel>
          </div>
        </CardContent>
      </Card>

      {/* Socials */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Share2 className="size-4 text-brand" />
            {lang === "cn" ? "社交媒体" : "Social Media"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SOCIAL_FIELDS.map((s) => (
              <FieldLabel
                key={s.key}
                label={lang === "cn" ? s.cn : s.en}
              >
                <Input
                  value={form[s.key] ?? ""}
                  onChange={(e) => setField(s.key, e.target.value)}
                  placeholder="https://"
                />
              </FieldLabel>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Info className="size-4 text-brand" />
            {lang === "cn" ? "版权信息" : "Copyright"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldLabel label={`Copyright (EN)`}>
              <Textarea
                rows={2}
                value={form.copyrightEn}
                onChange={(e) => setField("copyrightEn", e.target.value)}
                placeholder="© 2024 AudioCenter. All rights reserved."
              />
            </FieldLabel>
            <FieldLabel label={`Copyright (中文)`}>
              <Textarea
                rows={2}
                value={form.copyrightCn}
                onChange={(e) => setField("copyrightCn", e.target.value)}
                placeholder="© 2024 AudioCenter 版权所有"
              />
            </FieldLabel>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
        <Globe className="size-4 text-brand" />
        <span>
          {lang === "cn"
            ? "前台 EN / 中文切换会根据访客的语言显示对应内容。请确保两种语言都填写。"
            : "The public site will display content based on the visitor's language. Make sure both EN and CN are filled."}
        </span>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
