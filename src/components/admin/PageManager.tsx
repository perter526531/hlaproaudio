"use client";

import * as React from "react";
import {
  ArrowUp,
  ArrowDown,
  ChevronRight,
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
  useCreateBlock,
  useCreatePage,
  useDeleteBlock,
  useDeletePage,
  usePagesAdmin,
  useUpdateBlock,
  useUpdatePage,
} from "./hooks";
import { ImageUploader } from "./ImageUploader";
import type { ContentBlock, ContentBlockType, SitePage } from "./types";
import { cn } from "@/lib/utils";

const BLOCK_TYPES: { value: ContentBlockType; labelEn: string; labelCn: string }[] = [
  { value: "text", labelEn: "Text", labelCn: "文本" },
  { value: "image", labelEn: "Image", labelCn: "图片" },
  { value: "hero", labelEn: "Hero", labelCn: "横幅" },
  { value: "features", labelEn: "Features", labelCn: "特性" },
  { value: "quote", labelEn: "Quote", labelCn: "引言" },
  { value: "stats", labelEn: "Stats", labelCn: "数据" },
];

export function PageManager() {
  const lang = useI18n((s) => s.lang);
  const { data: pages, isLoading } = usePagesAdmin();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Pick the first page by default once data loads
  React.useEffect(() => {
    if (!selectedId && pages && pages.length) {
      setSelectedId(pages[0].id);
    }
  }, [pages, selectedId]);

  const selected = React.useMemo(
    () => pages?.find((p) => p.id === selectedId) ?? null,
    [pages, selectedId]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* Left: pages list */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-brand" />
            {lang === "cn" ? "页面列表" : "Pages"}
          </CardTitle>
          <AddPageDialog
            onCreated={(id) => {
              if (id) setSelectedId(id);
            }}
          />
        </CardHeader>
        <CardContent className="p-2">
          {!pages || pages.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {lang === "cn" ? "暂无页面" : "No pages"}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {pages.map((p) => {
                const isActive = p.id === selectedId;
                return (
                  <li key={p.id} className="group relative">
                    <button
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-2 pr-9 text-left text-sm transition-colors",
                        isActive
                          ? "bg-brand text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <ChevronRight
                        className={cn(
                          "size-3.5 shrink-0",
                          !isActive && "text-muted-foreground/50"
                        )}
                      />
                      <span className="flex-1 truncate">
                        {lang === "cn" ? p.titleCn : p.titleEn}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          isActive ? "text-primary-foreground/70" : "text-muted-foreground/50"
                        )}
                      >
                        {p.slug}
                      </span>
                    </button>
                    <DeletePageButton
                      page={p}
                      onDeleted={() => {
                        if (selectedId === p.id) setSelectedId(null);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Right: editor */}
      {selected ? (
        <PageEditor key={selected.id} page={selected} />
      ) : (
        <Card className="flex min-h-[400px] items-center justify-center border-border/60">
          <CardContent className="text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 size-8 opacity-50" />
            <p className="text-sm">
              {lang === "cn" ? "请选择一个页面进行编辑" : "Select a page to edit"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ----------------------- Page editor ----------------------- */

function PageEditor({ page }: { page: SitePage }) {
  const lang = useI18n((s) => s.lang);
  const update = useUpdatePage();

  const [form, setForm] = React.useState({
    slug: page.slug,
    titleEn: page.titleEn,
    titleCn: page.titleCn,
    bannerImage: page.bannerImage ?? "",
    bannerTitleEn: page.bannerTitleEn ?? "",
    bannerTitleCn: page.bannerTitleCn ?? "",
    bannerSubEn: page.bannerSubEn ?? "",
    bannerSubCn: page.bannerSubCn ?? "",
    metaEn: page.metaEn ?? "",
    metaCn: page.metaCn ?? "",
  });

  // Reset form when page changes
  React.useEffect(() => {
    setForm({
      slug: page.slug,
      titleEn: page.titleEn,
      titleCn: page.titleCn,
      bannerImage: page.bannerImage ?? "",
      bannerTitleEn: page.bannerTitleEn ?? "",
      bannerTitleCn: page.bannerTitleCn ?? "",
      bannerSubEn: page.bannerSubEn ?? "",
      bannerSubCn: page.bannerSubCn ?? "",
      metaEn: page.metaEn ?? "",
      metaCn: page.metaCn ?? "",
    });
  }, [page]);

  function setField<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    try {
      await update.mutateAsync({
        id: page.id,
        data: {
          slug: form.slug,
          titleEn: form.titleEn,
          titleCn: form.titleCn,
          bannerImage: form.bannerImage || null,
          bannerTitleEn: form.bannerTitleEn || null,
          bannerTitleCn: form.bannerTitleCn || null,
          bannerSubEn: form.bannerSubEn || null,
          bannerSubCn: form.bannerSubCn || null,
          metaEn: form.metaEn || null,
          metaCn: form.metaCn || null,
        },
      });
      toast.success(lang === "cn" ? "页面已保存" : "Page saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  const blocks = React.useMemo(
    () => [...(page.contentBlocks ?? [])].sort((a, b) => a.order - b.order),
    [page.contentBlocks]
  );

  return (
    <div className="space-y-6">
      {/* Page header + save */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">
              {lang === "cn" ? page.titleCn : page.titleEn}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              /{page.slug}
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
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title + slug */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={`${lang === "cn" ? "标题" : "Title"} (EN)`}>
              <Input
                value={form.titleEn}
                onChange={(e) => setField("titleEn", e.target.value)}
              />
            </Field>
            <Field label={`${lang === "cn" ? "标题" : "Title"} (中文)`}>
              <Input
                value={form.titleCn}
                onChange={(e) => setField("titleCn", e.target.value)}
              />
            </Field>
          </div>
          <Field label={`${lang === "cn" ? "页面路径" : "Slug"}`}>
            <Input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="home / about / products ..."
            />
          </Field>
        </CardContent>
      </Card>

      {/* Banner */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {lang === "cn" ? "横幅 Banner" : "Banner"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageUploader
            label={lang === "cn" ? "横幅图片" : "Banner Image"}
            value={form.bannerImage}
            onChange={(url) => setField("bannerImage", url)}
            previewClassName="h-32 w-56"
          />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={`${lang === "cn" ? "横幅主标题" : "Banner Title"} (EN)`}>
              <Input
                value={form.bannerTitleEn}
                onChange={(e) => setField("bannerTitleEn", e.target.value)}
              />
            </Field>
            <Field label={`${lang === "cn" ? "横幅主标题" : "Banner Title"} (中文)`}>
              <Input
                value={form.bannerTitleCn}
                onChange={(e) => setField("bannerTitleCn", e.target.value)}
              />
            </Field>
            <Field label={`${lang === "cn" ? "横幅副标题" : "Banner Subtitle"} (EN)`}>
              <Input
                value={form.bannerSubEn}
                onChange={(e) => setField("bannerSubEn", e.target.value)}
              />
            </Field>
            <Field label={`${lang === "cn" ? "横幅副标题" : "Banner Subtitle"} (中文)`}>
              <Input
                value={form.bannerSubCn}
                onChange={(e) => setField("bannerSubCn", e.target.value)}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Content blocks */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm">
              {lang === "cn" ? "内容区块" : "Content Blocks"}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "cn" ? "按顺序在页面渲染" : "Rendered in order"}
            </p>
          </div>
          <BlockDialog
            mode="create"
            pageId={page.id}
            trigger={
              <Button size="sm">
                <Plus className="size-4" />
                {tr("add", lang)}
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="space-y-2 p-3">
          {blocks.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              {lang === "cn" ? "暂无内容区块" : "No content blocks"}
            </p>
          ) : (
            blocks.map((b, idx) => (
              <BlockRow
                key={b.id}
                pageId={page.id}
                block={b}
                index={idx}
                total={blocks.length}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Meta */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {lang === "cn" ? "SEO Meta" : "SEO Meta"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label={`Meta (EN)`}>
            <Textarea
              rows={2}
              value={form.metaEn}
              onChange={(e) => setField("metaEn", e.target.value)}
            />
          </Field>
          <Field label={`Meta (中文)`}>
            <Textarea
              rows={2}
              value={form.metaCn}
              onChange={(e) => setField("metaCn", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ----------------------- Block row ----------------------- */

function BlockRow({
  pageId,
  block,
  index,
  total,
}: {
  pageId: string;
  block: ContentBlock;
  index: number;
  total: number;
}) {
  const lang = useI18n((s) => s.lang);
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const [delOpen, setDelOpen] = React.useState(false);

  async function move(dir: -1 | 1) {
    try {
      await updateBlock.mutateAsync({
        pageId,
        blockId: block.id,
        data: { order: block.order + dir * 1.5 },
      });
      // Note: backend keeps the order field as-is; refetch via invalidation
      // will rebuild the list. Numeric drift is acceptable here for simple
      // reorder. If stricter ordering is needed, a rebalance endpoint would
      // be added on the API side.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    }
  }

  async function onDel() {
    try {
      await deleteBlock.mutateAsync({ pageId, blockId: block.id });
      toast.success(lang === "cn" ? "已删除" : "Deleted");
      setDelOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const typeLabel = BLOCK_TYPES.find((b) => b.value === block.type);

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60">
      <div className="flex flex-col gap-0.5">
        <GripVertical className="size-4 text-muted-foreground/40" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            {typeLabel ? (lang === "cn" ? typeLabel.labelCn : typeLabel.labelEn) : block.type}
          </span>
          <span className="truncate text-sm font-medium">
            {block.titleEn || block.titleCn || (lang === "cn" ? "无标题" : "Untitled")}
          </span>
        </div>
        {block.contentEn && (
          <span className="truncate text-xs text-muted-foreground">
            {block.contentEn.slice(0, 80)}
            {block.contentEn.length > 80 ? "..." : ""}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          disabled={index === 0 || updateBlock.isPending}
          onClick={() => move(-1)}
          title={lang === "cn" ? "上移" : "Move up"}
        >
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          disabled={index === total - 1 || updateBlock.isPending}
          onClick={() => move(1)}
          title={lang === "cn" ? "下移" : "Move down"}
        >
          <ArrowDown className="size-3.5" />
        </Button>
        <BlockDialog
          mode="edit"
          pageId={pageId}
          block={block}
          trigger={
            <Button size="icon" variant="ghost" className="size-8" title={tr("edit", lang)}>
              <Pencil className="size-3.5" />
            </Button>
          }
        />
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title={tr("delete", lang)}
          onClick={() => setDelOpen(true)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("confirm_delete", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "cn" ? "该内容区块将被永久删除。" : "This block will be permanently deleted."}
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
    </div>
  );
}

/* ----------------------- Structured content editors (stats / features) ----------------------- */

type StatsRow = { value: string; labelEn: string; labelCn: string };
type FeaturesRow = {
  titleEn: string;
  titleCn: string;
  descEn: string;
  descCn: string;
};

function emptyStatsRow(): StatsRow {
  return { value: "", labelEn: "", labelCn: "" };
}
function emptyFeaturesRow(): FeaturesRow {
  return { titleEn: "", titleCn: "", descEn: "", descCn: "" };
}

/** Parse contentEn into a stats row list; falls back to 4 empty rows. */
function parseStatsRows(raw: string | null | undefined): StatsRow[] {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw ?? "");
  } catch {
    parsed = null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return [emptyStatsRow(), emptyStatsRow(), emptyStatsRow(), emptyStatsRow()];
  }
  const rows = parsed
    .map((r): StatsRow => ({
      value:
        r && typeof (r as StatsRow).value === "string" ? (r as StatsRow).value : "",
      labelEn:
        r && typeof (r as StatsRow).labelEn === "string" ? (r as StatsRow).labelEn : "",
      labelCn:
        r && typeof (r as StatsRow).labelCn === "string" ? (r as StatsRow).labelCn : "",
    }))
    .slice(0, 6);
  return rows.length > 0
    ? rows
    : [emptyStatsRow(), emptyStatsRow(), emptyStatsRow(), emptyStatsRow()];
}

/** Parse contentEn into a features row list; falls back to 3 empty rows. */
function parseFeaturesRows(raw: string | null | undefined): FeaturesRow[] {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw ?? "");
  } catch {
    parsed = null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return [emptyFeaturesRow(), emptyFeaturesRow(), emptyFeaturesRow()];
  }
  const rows = parsed
    .map((r): FeaturesRow => ({
      titleEn:
        r && typeof (r as FeaturesRow).titleEn === "string"
          ? (r as FeaturesRow).titleEn
          : "",
      titleCn:
        r && typeof (r as FeaturesRow).titleCn === "string"
          ? (r as FeaturesRow).titleCn
          : "",
      descEn:
        r && typeof (r as FeaturesRow).descEn === "string"
          ? (r as FeaturesRow).descEn
          : "",
      descCn:
        r && typeof (r as FeaturesRow).descCn === "string"
          ? (r as FeaturesRow).descCn
          : "",
    }))
    .slice(0, 6);
  return rows.length > 0
    ? rows
    : [emptyFeaturesRow(), emptyFeaturesRow(), emptyFeaturesRow()];
}

/** Serialize stats rows to a JSON string, dropping rows with empty value. */
function serializeStatsRows(rows: StatsRow[]): string {
  const cleaned = rows
    .filter((r) => r.value.trim() !== "")
    .map((r) => ({ value: r.value, labelEn: r.labelEn, labelCn: r.labelCn }));
  return cleaned.length > 0 ? JSON.stringify(cleaned) : "";
}

/** Serialize features rows to a JSON string, dropping rows with no title. */
function serializeFeaturesRows(rows: FeaturesRow[]): string {
  const cleaned = rows.filter(
    (r) => r.titleEn.trim() !== "" || r.titleCn.trim() !== ""
  );
  return cleaned.length > 0 ? JSON.stringify(cleaned) : "";
}

function StatsEditor({
  rows,
  onUpdate,
  onAdd,
  onRemove,
}: {
  rows: StatsRow[];
  onUpdate: (i: number, field: keyof StatsRow, value: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  const lang = useI18n((s) => s.lang);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          {lang === "cn" ? "数据项" : "Stat Items"}
        </Label>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus className="size-3.5" />
          {lang === "cn" ? "添加" : "Add"}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {lang === "cn"
          ? "value 为数值（如 20+）；labelEn / labelCn 为双语说明。空 value 的行保存时会被忽略。"
          : "value is the figure (e.g. 20+); labelEn / labelCn are bilingual labels. Rows with an empty value are dropped on save."}
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-md border border-border/60 bg-muted/30 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-[100px_1fr_1fr]">
                <Input
                  placeholder="20+"
                  value={row.value}
                  onChange={(e) => onUpdate(i, "value", e.target.value)}
                />
                <Input
                  placeholder={lang === "cn" ? "英文标签" : "Label (EN)"}
                  value={row.labelEn}
                  onChange={(e) => onUpdate(i, "labelEn", e.target.value)}
                />
                <Input
                  placeholder={lang === "cn" ? "中文标签" : "Label (中文)"}
                  value={row.labelCn}
                  onChange={(e) => onUpdate(i, "labelCn", e.target.value)}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(i)}
                title={lang === "cn" ? "删除" : "Remove"}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesEditor({
  rows,
  onUpdate,
  onAdd,
  onRemove,
}: {
  rows: FeaturesRow[];
  onUpdate: (i: number, field: keyof FeaturesRow, value: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  const lang = useI18n((s) => s.lang);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          {lang === "cn" ? "特性项" : "Feature Items"}
        </Label>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus className="size-3.5" />
          {lang === "cn" ? "添加" : "Add"}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {lang === "cn"
          ? "titleEn / titleCn 为双语标题；descEn / descCn 为双语描述；图标按顺序自动循环。无标题的行保存时会被忽略。"
          : "titleEn / titleCn are bilingual titles; descEn / descCn bilingual descriptions; icons cycle by index. Rows without any title are dropped on save."}
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-md border border-border/60 bg-muted/30 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                <Input
                  placeholder={lang === "cn" ? "标题 (EN)" : "Title (EN)"}
                  value={row.titleEn}
                  onChange={(e) => onUpdate(i, "titleEn", e.target.value)}
                />
                <Input
                  placeholder={lang === "cn" ? "标题 (中文)" : "Title (中文)"}
                  value={row.titleCn}
                  onChange={(e) => onUpdate(i, "titleCn", e.target.value)}
                />
                <Textarea
                  rows={2}
                  placeholder={lang === "cn" ? "描述 (EN)" : "Description (EN)"}
                  value={row.descEn}
                  onChange={(e) => onUpdate(i, "descEn", e.target.value)}
                />
                <Textarea
                  rows={2}
                  placeholder={lang === "cn" ? "描述 (中文)" : "Description (中文)"}
                  value={row.descCn}
                  onChange={(e) => onUpdate(i, "descCn", e.target.value)}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(i)}
                title={lang === "cn" ? "删除" : "Remove"}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- Block dialog (add/edit) ----------------------- */

function BlockDialog({
  mode,
  pageId,
  block,
  trigger,
}: {
  mode: "create" | "edit";
  pageId: string;
  block?: ContentBlock;
  trigger: React.ReactNode;
}) {
  const lang = useI18n((s) => s.lang);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const [open, setOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    type: "text" as ContentBlockType,
    titleEn: "",
    titleCn: "",
    contentEn: "",
    contentCn: "",
    image: "",
    order: 0,
  });
  const [statsRows, setStatsRows] = React.useState<StatsRow[]>(() => [
    emptyStatsRow(),
    emptyStatsRow(),
    emptyStatsRow(),
    emptyStatsRow(),
  ]);
  const [featuresRows, setFeaturesRows] = React.useState<FeaturesRow[]>(() => [
    emptyFeaturesRow(),
    emptyFeaturesRow(),
    emptyFeaturesRow(),
  ]);

  // Initialize form + structured rows when the dialog opens (or the block prop
  // changes after a refetch). Rows are re-derived from the saved contentEn
  // JSON so an existing stats / features block loads its items correctly.
  React.useEffect(() => {
    if (!open) return;
    const nextForm = {
      type: block?.type ?? "text",
      titleEn: block?.titleEn ?? "",
      titleCn: block?.titleCn ?? "",
      contentEn: block?.contentEn ?? "",
      contentCn: block?.contentCn ?? "",
      image: block?.image ?? "",
      order: block?.order ?? 0,
    };
    setForm(nextForm);
    if (nextForm.type === "stats") setStatsRows(parseStatsRows(nextForm.contentEn));
    else if (nextForm.type === "features")
      setFeaturesRows(parseFeaturesRows(nextForm.contentEn));
  }, [open, block]);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // When the admin switches the block type, re-initialize the structured
  // editor from the current contentEn (so toggling type never loses data).
  // `form.contentEn` is read from the closure (current value, which is the
  // pre-type-change contentEn); type itself is the only field mutated here.
  function onTypeChange(v: string) {
    const nextType = v as ContentBlockType;
    setForm((f) => ({ ...f, type: nextType }));
    if (nextType === "stats") setStatsRows(parseStatsRows(form.contentEn));
    else if (nextType === "features")
      setFeaturesRows(parseFeaturesRows(form.contentEn));
  }

  function updateStatsRow(i: number, field: keyof StatsRow, value: string) {
    const next = statsRows.map((r, idx) =>
      idx === i ? { ...r, [field]: value } : r
    );
    setStatsRows(next);
    setForm((f) => ({ ...f, contentEn: serializeStatsRows(next) }));
  }
  function addStatsRow() {
    setStatsRows((prev) => [...prev, emptyStatsRow()]);
  }
  function removeStatsRow(i: number) {
    const next = statsRows.filter((_, idx) => idx !== i);
    setStatsRows(next);
    setForm((f) => ({ ...f, contentEn: serializeStatsRows(next) }));
  }

  function updateFeaturesRow(
    i: number,
    field: keyof FeaturesRow,
    value: string
  ) {
    const next = featuresRows.map((r, idx) =>
      idx === i ? { ...r, [field]: value } : r
    );
    setFeaturesRows(next);
    setForm((f) => ({ ...f, contentEn: serializeFeaturesRows(next) }));
  }
  function addFeaturesRow() {
    setFeaturesRows((prev) => [...prev, emptyFeaturesRow()]);
  }
  function removeFeaturesRow(i: number) {
    const next = featuresRows.filter((_, idx) => idx !== i);
    setFeaturesRows(next);
    setForm((f) => ({ ...f, contentEn: serializeFeaturesRows(next) }));
  }

  async function onSave() {
    // For stats / features, all bilingual data lives inside contentEn JSON;
    // contentCn is unused — clear it so no stale text lingers when a block is
    // switched from text/hero/etc. into a structured type.
    const isStructured = form.type === "stats" || form.type === "features";
    const data = {
      type: form.type,
      titleEn: form.titleEn || null,
      titleCn: form.titleCn || null,
      contentEn: form.contentEn || null,
      contentCn: isStructured ? null : form.contentCn || null,
      image: form.image || null,
      order: Number(form.order) || 0,
    };
    try {
      if (mode === "create") {
        await createBlock.mutateAsync({ pageId, data });
        toast.success(lang === "cn" ? "已新增区块" : "Block added");
      } else if (block) {
        await updateBlock.mutateAsync({ pageId, blockId: block.id, data });
        toast.success(lang === "cn" ? "已更新区块" : "Block updated");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  const busy = createBlock.isPending || updateBlock.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? lang === "cn" ? "新增内容区块" : "Add Content Block"
              : lang === "cn" ? "编辑内容区块" : "Edit Content Block"}
          </DialogTitle>
          <DialogDescription>
            {lang === "cn"
              ? "填写双语内容；至少填写一种语言"
              : "Fill bilingual content; at least one language required"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={lang === "cn" ? "类型" : "Type"}>
              <Select value={form.type} onValueChange={onTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOCK_TYPES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {lang === "cn" ? b.labelCn : b.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={lang === "cn" ? "顺序" : "Order"}>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
              />
            </Field>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={`${lang === "cn" ? "标题" : "Title"} (EN)`}>
              <Input
                value={form.titleEn}
                onChange={(e) => setField("titleEn", e.target.value)}
              />
            </Field>
            <Field label={`${lang === "cn" ? "标题" : "Title"} (中文)`}>
              <Input
                value={form.titleCn}
                onChange={(e) => setField("titleCn", e.target.value)}
              />
            </Field>
          </div>

          {form.type === "stats" ? (
            <StatsEditor
              rows={statsRows}
              onUpdate={updateStatsRow}
              onAdd={addStatsRow}
              onRemove={removeStatsRow}
            />
          ) : form.type === "features" ? (
            <FeaturesEditor
              rows={featuresRows}
              onUpdate={updateFeaturesRow}
              onAdd={addFeaturesRow}
              onRemove={removeFeaturesRow}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label={`${lang === "cn" ? "内容" : "Content"} (EN)`}>
                <Textarea
                  rows={4}
                  value={form.contentEn}
                  onChange={(e) => setField("contentEn", e.target.value)}
                />
              </Field>
              <Field label={`${lang === "cn" ? "内容" : "Content"} (中文)`}>
                <Textarea
                  rows={4}
                  value={form.contentCn}
                  onChange={(e) => setField("contentCn", e.target.value)}
                />
              </Field>
            </div>
          )}

          <ImageUploader
            label={lang === "cn" ? "图片" : "Image"}
            value={form.image}
            onChange={(url) => setField("image", url)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tr("cancel", lang)}
          </Button>
          <Button onClick={onSave} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {tr("save", lang)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------- Add Page dialog ----------------------- */

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function AddPageDialog({ onCreated }: { onCreated: (id?: string) => void }) {
  const lang = useI18n((s) => s.lang);
  const createPage = useCreatePage();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ slug: "", titleEn: "", titleCn: "" });
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm({ slug: "", titleEn: "", titleCn: "" });
      setTouched(false);
    }
  }, [open]);

  const slugValid = SLUG_RE.test(form.slug.trim());
  const titleValid = form.titleEn.trim().length > 0 || form.titleCn.trim().length > 0;
  const canSave = slugValid && titleValid && !createPage.isPending;

  async function onSave() {
    setTouched(true);
    if (!canSave) return;
    try {
      const created = await createPage.mutateAsync({
        slug: form.slug.trim(),
        titleEn: form.titleEn.trim() || form.titleCn.trim(),
        titleCn: form.titleCn.trim() || form.titleEn.trim(),
      });
      toast.success(lang === "cn" ? "已新增页面" : "Page added");
      setOpen(false);
      onCreated(created?.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="size-4" />
          {lang === "cn" ? "新增页面" : "Add Page"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {lang === "cn" ? "新增页面" : "Add Page"}
          </DialogTitle>
          <DialogDescription>
            {lang === "cn"
              ? "新建一个站点页面，可随后编辑横幅与内容区块。"
              : "Create a new site page. You can edit its banner and content blocks afterwards."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Field
            label={lang === "cn" ? "路径 Slug" : "Slug"}
            hint={
              lang === "cn"
                ? "只能包含小写字母、数字与连字符，例如 about-us"
                : "Lowercase letters, digits and hyphens only — e.g. about-us"
            }
          >
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="about-us"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSave();
                }
              }}
            />
            {touched && !slugValid && (
              <p className="text-[11px] text-destructive">
                {lang === "cn"
                  ? "Slug 必须为小写字母/数字并以连字符分隔"
                  : "Slug must be lowercase letters/digits separated by hyphens"}
              </p>
            )}
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={`${lang === "cn" ? "标题" : "Title"} (EN)`}>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                placeholder="About Us"
              />
            </Field>
            <Field label={`${lang === "cn" ? "标题" : "Title"} (中文)`}>
              <Input
                value={form.titleCn}
                onChange={(e) => setForm((f) => ({ ...f, titleCn: e.target.value }))}
                placeholder="关于我们"
              />
            </Field>
          </div>
          {touched && !titleValid && (
            <p className="text-[11px] text-destructive">
              {lang === "cn"
                ? "至少填写一种语言的标题"
                : "At least one language title is required"}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tr("cancel", lang)}
          </Button>
          <Button onClick={onSave} disabled={!canSave}>
            {createPage.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {tr("save", lang)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------- Delete Page button ----------------------- */

function DeletePageButton({
  page,
  onDeleted,
}: {
  page: SitePage;
  onDeleted: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const deletePage = useDeletePage();
  const [open, setOpen] = React.useState(false);

  async function onDel() {
    try {
      await deletePage.mutateAsync(page.id);
      toast.success(lang === "cn" ? "已删除页面" : "Page deleted");
      setOpen(false);
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        title={tr("delete", lang)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("confirm_delete", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "cn"
                ? "删除该页面会使其路由失效；前台导航仍会指向该 slug。是否继续？"
                : "Deleting this page orphans its route; the public nav still links to the slug. Continue?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr("cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDel}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deletePage.isPending}
            >
              {deletePage.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {tr("delete", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
