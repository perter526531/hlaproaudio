"use client";

import { Volume2 } from "lucide-react";
import { useI18n } from "@/store/i18n";
import { useSettings } from "@/components/public/hooks";
import { pick } from "@/lib/types";
import { cn } from "@/lib/utils";

type BrandSize = "sm" | "md" | "lg";

const ICON_BOX: Record<BrandSize, string> = {
  sm: "size-7",
  md: "size-9",
  lg: "size-12",
};
const ICON: Record<BrandSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};
const TEXT: Record<BrandSize, string> = {
  sm: "text-sm",
  md: "text-base sm:text-lg",
  lg: "text-xl",
};
const LOGO_H: Record<BrandSize, string> = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
};

/**
 * Brand mark: renders the site logo image (if set in Site Setting) or falls
 * back to the Volume2 icon + wordmark. The wordmark is the bilingual site name
 * from settings; when unset it defaults to the split "AUDIO|CENTER" treatment.
 * Used by the public Header/Footer and the admin login/layout chrome.
 */
export function Brand({
  size = "md",
  showText = true,
  className,
  onClick,
}: {
  size?: BrandSize;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const { data: settings } = useSettings();
  const name = pick(settings?.siteNameEn, settings?.siteNameCn, lang);
  const logo = settings?.logo ?? null;

  const content = logo ? (
    <img
      src={logo}
      alt={name ?? "logo"}
      className={cn(LOGO_H[size], "w-auto object-contain")}
      onError={(e) => {
        e.currentTarget.style.opacity = "0";
      }}
    />
  ) : (
    <>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md brand-gradient text-primary-foreground",
          ICON_BOX[size]
        )}
      >
        <Volume2 className={ICON[size]} />
      </span>
      {showText && (
        <span className={cn("font-bold tracking-widest", TEXT[size])}>
          {name ? (
            name
          ) : (
            <>
              AUDIO<span className="text-brand">CENTER</span>
            </>
          )}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn("flex items-center gap-2 shrink-0 group", className)}
        aria-label={`${name ?? "AudioCenter"} home`}
      >
        {content}
      </button>
    );
  }
  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      {content}
    </div>
  );
}
