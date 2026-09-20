"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useI18n, tr } from "@/store/i18n";
import { usePage, useSettings } from "@/components/public/hooks";
import { BannerSection } from "@/components/public/BannerSection";
import { ContactForm } from "@/components/public/ContactForm";
import { Skeleton } from "@/components/ui/skeleton";
import { pick } from "@/lib/types";

export function ContactPage() {
  const lang = useI18n((s) => s.lang);
  const { data: page, isLoading: pageLoading } = usePage("contact");
  const { data: settings } = useSettings();

  const phone = pick(settings?.phoneEn, settings?.phoneCn, lang);
  const email = pick(settings?.emailEn, settings?.emailCn, lang);
  const address = pick(settings?.addressEn, settings?.addressCn, lang);

  return (
    <>
      {page ? <BannerSection page={page} /> : null}
      {pageLoading && !page ? <Skeleton className="h-[40vh] w-full" /> : null}

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT: Contact form */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  <span className="text-brand">{tr("cf_title", lang)}</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tr("cf_subtitle", lang)}
                </p>
              </div>
              <ContactForm sourcePage="contact" />
            </div>

            {/* RIGHT: Contact info + map placeholder */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h3 className="text-xl font-bold mb-5">
                  <span className="text-brand">{tr("ci_title", lang)}</span>
                </h3>
                <ul className="space-y-4 text-sm">
                  {phone ? (
                    <li className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                        <Phone className="size-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {tr("ci_phone", lang)}
                        </div>
                        <a href={`tel:${phone}`} className="hover:text-brand">
                          {phone}
                        </a>
                      </div>
                    </li>
                  ) : null}
                  {email ? (
                    <li className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                        <Mail className="size-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {tr("ci_email", lang)}
                        </div>
                        <a
                          href={`mailto:${email}`}
                          className="hover:text-brand break-all"
                        >
                          {email}
                        </a>
                      </div>
                    </li>
                  ) : null}
                  {address ? (
                    <li className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                        <MapPin className="size-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {tr("ci_address", lang)}
                        </div>
                        <div>{address}</div>
                      </div>
                    </li>
                  ) : null}
                  <li className="flex items-start gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                      <Clock className="size-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {tr("ci_hours", lang)}
                      </div>
                      <div>{tr("ci_hours_val", lang)}</div>
                    </div>
                  </li>
                  {settings?.whatsapp ? (
                    <li className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                        <MessageCircle className="size-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          WhatsApp
                        </div>
                        <div>{settings.whatsapp}</div>
                      </div>
                    </li>
                  ) : null}
                  {settings?.wechat ? (
                    <li className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md brand-gradient text-primary-foreground">
                        <MessageCircle className="size-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          WeChat
                        </div>
                        <div>{settings.wechat}</div>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>

              {/* Map placeholder (styled, no real map to avoid network/key issues) */}
              <div className="relative aspect-[16/10] rounded-2xl border border-border overflow-hidden bg-card">
                <div className="absolute inset-0 brand-gradient opacity-30" />
                {/* Decorative grid pattern */}
                <div
                  className="absolute inset-0 opacity-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <MapPin className="size-10 text-brand mb-2" />
                  <div className="text-sm text-foreground font-medium">
                    {tr("ci_address", lang)}
                  </div>
                  {address ? (
                    <div className="text-sm text-muted-foreground max-w-md">{address}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
