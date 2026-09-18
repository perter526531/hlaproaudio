"use client";

import * as React from "react";
import {
  ArrowRight,
  FileText,
  FolderTree,
  Inbox,
  Package,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useI18n, tr, type TKey } from "@/store/i18n";
import {
  useCategoriesAdmin,
  usePagesAdmin,
  useProductsAdmin,
  useSubmissions,
} from "./hooks";
import type { AdminSection } from "./AdminLayout";
import type { Category } from "./types";

export interface DashboardProps {
  /** Navigate to a section. */
  onNavigate: (s: AdminSection) => void;
}

function countCategoryNodes(nodes: Category[]): number {
  let n = 0;
  for (const node of nodes) {
    n += 1;
    if (node.children?.length) n += countCategoryNodes(node.children);
  }
  return n;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const lang = useI18n((s) => s.lang);
  const pages = usePagesAdmin();
  const cats = useCategoriesAdmin();
  const products = useProductsAdmin({ status: "", categoryId: "", q: "" });
  const subs = useSubmissions("new");

  const loading = pages.isLoading || cats.isLoading || products.isLoading || subs.isLoading;

  const pageCnt = pages.data?.length ?? 0;
  const catCnt = countCategoryNodes(cats.data ?? []);
  const prodCnt = products.data?.length ?? 0;
  const newSubCnt = subs.data?.length ?? 0;

  const stats: {
    key: TKey;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    section: AdminSection;
  }[] = [
    {
      key: "stat_pages",
      value: pageCnt,
      icon: FileText,
      accent: "from-chart-1/30 to-chart-5/20",
      section: "pages",
    },
    {
      key: "stat_categories",
      value: catCnt,
      icon: FolderTree,
      accent: "from-chart-2/30 to-chart-3/20",
      section: "categories",
    },
    {
      key: "stat_products",
      value: prodCnt,
      icon: Package,
      accent: "from-chart-4/30 to-chart-1/20",
      section: "products",
    },
    {
      key: "stat_inquiries",
      value: newSubCnt,
      icon: Inbox,
      accent: "from-chart-5/30 to-chart-2/20",
      section: "submissions",
    },
  ];

  const recent = React.useMemo(() => {
    if (!subs.data) return [];
    return subs.data.slice(0, 5);
  }, [subs.data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {lang === "cn" ? "概览" : "Overview"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === "cn"
            ? "管理您网站的内容、产品与客户留言"
            : "Manage your site content, products and customer inquiries"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          : stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                >
                  <Card
                    className="relative cursor-pointer overflow-hidden border-border/60 transition-all hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
                    onClick={() => onNavigate(s.section)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex size-10 items-center justify-center rounded-md bg-gradient-to-br ${s.accent} text-foreground`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground/40" />
                      </div>
                      <div className="mt-4 text-3xl font-bold tracking-tight">
                        {s.value}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                        {tr(s.key, lang)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {/* Recent inquiries */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold">
                {lang === "cn" ? "最新留言" : "Recent Inquiries"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "cn"
                  ? "最近 5 条客户咨询"
                  : "Latest 5 customer inquiries"}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onNavigate("submissions")}>
              {lang === "cn" ? "查看全部" : "View All"}
            </Button>
          </div>

          {subs.isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Inbox className="size-8" />
              <p className="text-sm">
                {lang === "cn" ? "暂无留言" : "No inquiries yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "cn" ? "公司" : "Company"}</TableHead>
                  <TableHead>{lang === "cn" ? "联系人" : "Contact"}</TableHead>
                  <TableHead>{lang === "cn" ? "电话" : "Phone"}</TableHead>
                  <TableHead>{lang === "cn" ? "状态" : "Status"}</TableHead>
                  <TableHead className="text-right">
                    {lang === "cn" ? "操作" : "Action"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.companyName}</TableCell>
                    <TableCell>{s.contactPerson}</TableCell>
                    <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          s.status === "new"
                            ? "border-destructive/40 text-destructive"
                            : s.status === "read"
                            ? "border-yellow-500/40 text-yellow-500"
                            : "border-emerald-500/40 text-emerald-500"
                        }
                      >
                        {s.status === "new"
                          ? lang === "cn" ? "新" : "New"
                          : s.status === "read"
                          ? lang === "cn" ? "已读" : "Read"
                          : lang === "cn" ? "已回复" : "Replied"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onNavigate("submissions")}
                      >
                        {lang === "cn" ? "查看" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <QuickLink
          icon={FileText}
          title={lang === "cn" ? "编辑页面内容" : "Edit Site Pages"}
          desc={
            lang === "cn"
              ? "更新首页横幅、关于我们等"
              : "Update homepage banners, about us, etc."
          }
          onClick={() => onNavigate("pages")}
          lang={lang}
        />
        <QuickLink
          icon={Package}
          title={lang === "cn" ? "管理产品" : "Manage Products"}
          desc={
            lang === "cn"
              ? "新增、上下架产品及多图"
              : "Add, list/unlist products & images"
          }
          onClick={() => onNavigate("products")}
          lang={lang}
        />
        <QuickLink
          icon={TrendingUp}
          title={lang === "cn" ? "回复客户留言" : "Reply to Inquiries"}
          desc={
            lang === "cn"
              ? "处理潜在客户咨询"
              : "Handle prospective customer inquiries"
          }
          onClick={() => onNavigate("submissions")}
          lang={lang}
        />
      </div>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  title,
  desc,
  onClick,
  lang,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick: () => void;
  lang: "en" | "cn";
}) {
  void lang;
  return (
    <Card
      className="group cursor-pointer border-border/60 transition-all hover:border-brand/40 hover:bg-accent/40"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-md bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-xs text-muted-foreground">{desc}</div>
        </div>
        <ArrowRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
      </CardContent>
    </Card>
  );
}
