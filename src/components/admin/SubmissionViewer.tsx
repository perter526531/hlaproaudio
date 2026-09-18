"use client";

import * as React from "react";
import {
  Calendar,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
  User,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n, tr } from "@/store/i18n";
import {
  useDeleteSubmission,
  useSubmission,
  useSubmissions,
  useUpdateSubmission,
} from "./hooks";
import type { FormSubmission } from "./types";
import { cn } from "@/lib/utils";

type StatusFilter = "new" | "read" | "replied" | "";

const STATUS_OPTIONS: { value: StatusFilter; en: string; cn: string }[] = [
  { value: "", en: "All", cn: "全部" },
  { value: "new", en: "New", cn: "新" },
  { value: "read", en: "Read", cn: "已读" },
  { value: "replied", en: "Replied", cn: "已回复" },
];

function StatusBadge({ status, lang }: { status: string; lang: "en" | "cn" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border",
        status === "new"
          ? "border-destructive/40 text-destructive"
          : status === "read"
          ? "border-yellow-500/40 text-yellow-500"
          : "border-emerald-500/40 text-emerald-500"
      )}
    >
      {status === "new"
        ? lang === "cn"
          ? "新"
          : "New"
        : status === "read"
        ? lang === "cn"
          ? "已读"
          : "Read"
        : lang === "cn"
        ? "已回复"
        : "Replied"}
    </Badge>
  );
}

function fmtDate(iso: string, lang: "en" | "cn") {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString(lang === "cn" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function SubmissionViewer() {
  const lang = useI18n((s) => s.lang);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("");
  const list = useSubmissions(statusFilter);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Inbox className="size-4 text-brand" />
            {tr("admin_submissions", lang)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {lang === "cn" ? "筛选" : "Filter"}:
            </span>
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) =>
                setStatusFilter(v === "all" ? "" : (v as StatusFilter))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value || "all"} value={o.value || "all"}>
                    {lang === "cn" ? o.cn : o.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {list.isLoading ? (
        <Card className="border-border/60">
          <CardContent className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-md" />
            ))}
          </CardContent>
        </Card>
      ) : !list.data || list.data.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <Inbox className="size-8 opacity-50" />
            <p className="text-sm">
              {lang === "cn" ? "暂无留言" : "No inquiries"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden border-border/60 md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {lang === "cn" ? "公司" : "Company"}
                    </TableHead>
                    <TableHead>
                      {lang === "cn" ? "联系人" : "Contact"}
                    </TableHead>
                    <TableHead>
                      {lang === "cn" ? "电话" : "Phone"}
                    </TableHead>
                    <TableHead>
                      {lang === "cn" ? "状态" : "Status"}
                    </TableHead>
                    <TableHead>
                      <Calendar className="size-3.5" />
                      <span className="sr-only">{lang === "cn" ? "日期" : "Date"}</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.data.map((s, idx) => (
                    <TableRow
                      key={s.id}
                      onClick={() => setDetailId(s.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {s.status === "new" && (
                            <span className="size-1.5 rounded-full bg-destructive" />
                          )}
                          <span className="truncate">{s.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{s.contactPerson}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.phone}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} lang={lang} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {fmtDate(s.createdAt, lang)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {list.data.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                onClick={() => setDetailId(s.id)}
              >
                <Card className="cursor-pointer border-border/60 transition-colors hover:border-brand/40">
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium">
                        {s.companyName}
                      </span>
                      <StatusBadge status={s.status} lang={lang} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{s.contactPerson}</span>
                      <span>{fmtDate(s.createdAt, lang)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{s.phone}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <SubmissionDetail
        id={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}

/* ----------------------- submission detail dialog ----------------------- */

function SubmissionDetail({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const detail = useSubmission(id);
  const update = useUpdateSubmission();
  const delMut = useDeleteSubmission();
  const [delOpen, setDelOpen] = React.useState(false);

  async function changeStatus(v: "new" | "read" | "replied") {
    if (!id) return;
    try {
      await update.mutateAsync({ id, data: { status: v } });
      toast.success(lang === "cn" ? "状态已更新" : "Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function onDel() {
    if (!id) return;
    try {
      await delMut.mutateAsync(id);
      toast.success(lang === "cn" ? "已删除" : "Deleted");
      setDelOpen(false);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const data = detail.data;

  return (
    <Dialog open={!!id} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="size-4 text-brand" />
            {lang === "cn" ? "留言详情" : "Inquiry Detail"}
          </DialogTitle>
          <DialogDescription>
            {lang === "cn"
              ? "查看客户咨询详情并更新状态"
              : "View inquiry details and update status"}
          </DialogDescription>
        </DialogHeader>

        {detail.isLoading || !data ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <DetailRow
              icon={Building2}
              label={lang === "cn" ? "公司名称" : "Company"}
              value={data.companyName}
            />
            <DetailRow
              icon={User}
              label={lang === "cn" ? "联系人" : "Contact"}
              value={data.contactPerson}
            />
            <DetailRow
              icon={Phone}
              label={lang === "cn" ? "电话" : "Phone"}
              value={data.phone}
            />
            {data.email && (
              <DetailRow
                icon={Mail}
                label={lang === "cn" ? "邮箱" : "Email"}
                value={data.email}
              />
            )}
            {data.sourcePage && (
              <DetailRow
                icon={MessageSquare}
                label={lang === "cn" ? "来源页" : "Source"}
                value={data.sourcePage}
              />
            )}
            <div className="rounded-md border border-border/60 bg-muted/30 p-3">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                {lang === "cn" ? "需求描述" : "Requirements"}
              </div>
              <p className="whitespace-pre-wrap text-sm">{data.requirements}</p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {lang === "cn" ? "状态" : "Status"}
                </div>
                <div className="mt-1">
                  <StatusBadge status={data.status} lang={lang} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {lang === "cn" ? "更新为" : "Mark as"}
                </span>
                <Select
                  value={data.status}
                  onValueChange={(v) =>
                    changeStatus(v as "new" | "read" | "replied")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">
                      {lang === "cn" ? "新" : "New"}
                    </SelectItem>
                    <SelectItem value="read">
                      {lang === "cn" ? "已读" : "Read"}
                    </SelectItem>
                    <SelectItem value="replied">
                      {lang === "cn" ? "已回复" : "Replied"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {fmtDate(data.createdAt, lang)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setDelOpen(true)}
              >
                <Trash2 className="size-4" />
                {tr("delete", lang)}
              </Button>
            </div>
          </div>
        )}

        <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tr("confirm_delete", lang)}</AlertDialogTitle>
              <AlertDialogDescription>
                {lang === "cn"
                  ? "该留言将被永久删除。"
                  : "This inquiry will be permanently deleted."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tr("cancel", lang)}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDel}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {tr("delete", lang)}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm break-words">{value}</div>
      </div>
    </div>
  );
}
