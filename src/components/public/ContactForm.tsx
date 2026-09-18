"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n, tr, type TKey } from "@/store/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  sourcePage?: string;
  className?: string;
}

interface FormState {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  requirements: string;
}

const EMPTY: FormState = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  requirements: "",
};

/** Reusable inquiry form. Submits to public POST /api/submissions. */
export function ContactForm({ sourcePage, className }: ContactFormProps) {
  const lang = useI18n((s) => s.lang);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const setField = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const label = (key: TKey) => tr(key, lang);

  const validate = () => {
    const e: Partial<Record<keyof FormState, boolean>> = {};
    if (!form.companyName.trim()) e.companyName = true;
    if (!form.contactPerson.trim()) e.contactPerson = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.requirements.trim()) e.requirements = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error(tr("cf_required", lang));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          contactPerson: form.contactPerson.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          requirements: form.requirements.trim(),
          sourcePage: sourcePage ?? undefined,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      toast.success(tr("cf_success", lang));
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      toast.error(
        lang === "en"
          ? "Submission failed. Please try again later."
          : "提交失败，请稍后再试。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          id="cf_company"
          label={label("cf_company")}
          required
          error={errors.companyName}
        >
          <Input
            id="cf_company_input"
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            placeholder={lang === "en" ? "Your company" : "请输入公司名称"}
            autoComplete="organization"
            aria-invalid={!!errors.companyName}
          />
        </Field>
        <Field
          id="cf_contact"
          label={label("cf_contact")}
          required
          error={errors.contactPerson}
        >
          <Input
            id="cf_contact_input"
            value={form.contactPerson}
            onChange={(e) => setField("contactPerson", e.target.value)}
            placeholder={lang === "en" ? "Contact name" : "请输入联系人"}
            autoComplete="name"
            aria-invalid={!!errors.contactPerson}
          />
        </Field>
        <Field
          id="cf_phone"
          label={label("cf_phone")}
          required
          error={errors.phone}
        >
          <Input
            id="cf_phone_input"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder={lang === "en" ? "+86 138 0000 0000" : "请输入联系电话"}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
        </Field>
        <Field id="cf_email" label={label("cf_email")}>
          <Input
            id="cf_email_input"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder={lang === "en" ? "you@example.com" : "请输入邮箱（选填）"}
            autoComplete="email"
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field
          id="cf_requirements"
          label={label("cf_requirements")}
          required
          error={errors.requirements}
        >
          <Textarea
            id="cf_requirements_input"
            value={form.requirements}
            onChange={(e) => setField("requirements", e.target.value)}
            rows={5}
            placeholder={
              lang === "en"
                ? "Tell us about your project, quantities, venue size, etc."
                : "请描述您的项目、数量、场馆规模等需求…"
            }
            aria-invalid={!!errors.requirements}
          />
        </Field>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {lang === "en" ? "We'll reply within 24h." : "我们将在24小时内回复。"}
      </p>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 w-full sm:w-auto brand-gradient text-primary-foreground"
        size="lg"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {label("cf_submit")}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  const lang = useI18n((s) => s.lang);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${id}_input`} className="text-sm">
        {label}
        {required ? <span className="text-brand ml-1">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-brand">
          {lang === "cn" ? "此项为必填" : "This field is required"}
        </p>
      ) : null}
    </div>
  );
}
