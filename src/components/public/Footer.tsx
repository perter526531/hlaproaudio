"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Volume2,
  Youtube,
} from "lucide-react";
import { useI18n, tr, type TKey } from "@/store/i18n";
import { useNav, type Route } from "@/store/nav";
import { useSettings } from "@/components/public/hooks";
import { pick, type SiteSetting } from "@/lib/types";

interface Link {
  key: TKey;
  route: Route;
}

const LINKS: Link[] = [
  { key: "nav_home", route: { name: "home" } },
  { key: "nav_about", route: { name: "about" } },
  { key: "nav_products", route: { name: "products" } },
  { key: "nav_solutions", route: { name: "solutions" } },
  { key: "nav_news", route: { name: "news" } },
  { key: "nav_contact", route: { name: "contact" } },
];

/** Sticky footer (apply mt-auto in the parent layout). */
export function Footer() {
  const lang = useI18n((s) => s.lang);
  const go = useNav((s) => s.go);
  const { data: settings } = useSettings();

  const phone = pick(settings?.phoneEn, settings?.phoneCn, lang);
  const email = pick(settings?.emailEn, settings?.emailCn, lang);
  const address = pick(settings?.addressEn, settings?.addressCn, lang);
  const copyright = pick(settings?.copyrightEn, settings?.copyrightCn, lang) ?? "";

  const socials = settings ? socialLinks(settings) : [];

  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <button
              onClick={() => go({ name: "home" })}
              className="flex items-center gap-2 mb-3"
            >
              <span className="inline-flex items-center justify-center size-9 rounded-md brand-gradient text-primary-foreground">
                <Volume2 className="size-5" />
              </span>
              <span className="font-bold tracking-widest text-base">
                AUDIO<span className="text-brand">CENTER</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {tr("footer_about_desc", lang)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              {tr("footer_links", lang)}
            </h3>
            <ul className="space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.key}>
                  <button
                    onClick={() => go(l.route)}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    {tr(l.key, lang)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              {tr("footer_contact", lang)}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {phone ? (
                <li className="flex items-start gap-2">
                  <Phone className="size-4 mt-0.5 shrink-0 text-brand" />
                  <span>{phone}</span>
                </li>
              ) : null}
              {email ? (
                <li className="flex items-start gap-2">
                  <Mail className="size-4 mt-0.5 shrink-0 text-brand" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-brand transition-colors break-all"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-2">
                  <MapPin className="size-4 mt-0.5 shrink-0 text-brand" />
                  <span>{address}</span>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              {tr("footer_follow", lang)}
            </h3>
            {socials.length ? (
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.key}
                    className="inline-flex items-center justify-center size-9 rounded-md border border-border text-muted-foreground hover:text-brand hover:border-brand transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : null}
            {settings?.wechat ? (
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-foreground font-medium">WeChat:</span>{" "}
                {settings.wechat}
              </div>
            ) : null}
            {settings?.whatsapp ? (
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="text-foreground font-medium">WhatsApp:</span>{" "}
                {settings.whatsapp}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
}

function socialLinks(s: SiteSetting) {
  const out: { key: string; url: string; icon: React.ReactNode }[] = [];
  if (s.facebook) out.push({ key: "facebook", url: s.facebook, icon: <Facebook className="size-4" /> });
  if (s.youtube) out.push({ key: "youtube", url: s.youtube, icon: <Youtube className="size-4" /> });
  if (s.instagram) out.push({ key: "instagram", url: s.instagram, icon: <Instagram className="size-4" /> });
  if (s.linkedin) out.push({ key: "linkedin", url: s.linkedin, icon: <Linkedin className="size-4" /> });
  return out;
}
