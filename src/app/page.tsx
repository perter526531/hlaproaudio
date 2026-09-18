"use client";

import { Providers } from "@/components/providers";
import { useNav } from "@/store/nav";
import dynamic from "next/dynamic";

// Public site + admin are both client-only SPAs rendered inside the single / route.
const PublicSite = dynamic(
  () => import("@/components/public/PublicSite").then((m) => m.PublicSite),
  { ssr: false }
);
const AdminApp = dynamic(
  () => import("@/components/admin/AdminApp").then((m) => m.AdminApp),
  { ssr: false }
);

export default function Page() {
  return (
    <Providers>
      <Shell />
    </Providers>
  );
}

function Shell() {
  const adminMode = useNav((s) => s.adminMode);
  if (adminMode) return <AdminApp />;
  return <PublicSite />;
}
