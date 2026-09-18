"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderTree,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useCategoriesAdmin,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "./hooks";
import type { Category } from "./types";
import { cn } from "@/lib/utils";

export function CategoryManager() {
  const lang = useI18n((s) => s.lang);
  const { data: tree, isLoading } = useCategoriesAdmin();
  const createCat = useCreateCategory();
  const [addRoot, setAddRoot] = React.useState(false);

  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FolderTree className="size-4 text-brand" />
              {tr("admin_categories", lang)}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "cn" ? "三级分类树：L1 > L2 > L3" : "3-level tree: L1 > L2 > L3"}
            </p>
          </div>
          <Button size="sm" onClick={() => setAddRoot(true)}>
            <Plus className="size-4" />
            {lang === "cn" ? "新增一级分类" : "Add L1"}
          </Button>
        </CardHeader>
        <CardContent className="p-3">
          {isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : !tree || tree.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Folder className="size-8 opacity-50" />
              <p className="text-sm">
                {lang === "cn" ? "暂无分类" : "No categories"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {tree.map((node) => (
                <CategoryNode key={node.id} node={node} depth={0} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={addRoot}
        onOpenChange={setAddRoot}
        mode="create"
        parentPath={null}
        initial={null}
        onSave={async (data) => {
          await createCat.mutateAsync(data);
          toast.success(lang === "cn" ? "已新增分类" : "Category added");
        }}
      />
    </div>
  );
}

/* ----------------------- Category node (recursive) ----------------------- */

function CategoryNode({
  node,
  depth,
}: {
  node: Category;
  depth: number;
}) {
  const lang = useI18n((s) => s.lang);
  const [expanded, setExpanded] = React.useState(depth < 2);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [delOpen, setDelOpen] = React.useState(false);
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const hasChildren = !!node.children && node.children.length > 0;
  const canAddChild = depth < 2; // 3-level tree

  const path = React.useMemo(() => {
    // For child category display: show parent path label (e.g. "Loudspeakers > Line Arrays >")
    // Without parent context here we just show current name as a hint
    return `${node.nameEn} / ${node.nameCn}`;
  }, [node]);

  async function onDel() {
    try {
      await deleteCat.mutateAsync(node.id);
      toast.success(lang === "cn" ? "已删除分类" : "Category deleted");
      setDelOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-accent/50"
        style={{ paddingLeft: `${8 + depth * 20}px` }}
      >
        <button
          className="flex size-5 items-center justify-center text-muted-foreground"
          onClick={() => hasChildren && setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse" : "Expand"}
          type="button"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )
          ) : (
            <span className="size-3.5" />
          )}
        </button>

        <Folder
          className={cn(
            "size-4 shrink-0",
            depth === 0 ? "text-brand" : "text-muted-foreground"
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="truncate text-sm font-medium">
              {lang === "cn" ? node.nameCn : node.nameEn}
            </span>
            <span className="text-xs text-muted-foreground">
              {lang === "cn" ? node.nameEn : node.nameCn}
            </span>
            {node.descEn && (
              <span className="truncate text-xs text-muted-foreground/70">
                — {lang === "cn" ? node.descCn ?? node.descEn : node.descEn}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {canAddChild && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              title={lang === "cn" ? "新增子分类" : "Add sub-category"}
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-3.5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            title={tr("edit", lang)}
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            title={tr("delete", lang)}
            onClick={() => setDelOpen(true)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Add child dialog */}
      <CategoryDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="create"
        parentPath={path}
        initial={null}
        parentId={node.id}
        onSave={async (data) => {
          await createCat.mutateAsync(data);
          toast.success(lang === "cn" ? "已新增子分类" : "Sub-category added");
        }}
      />

      {/* Edit dialog */}
      <CategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        parentPath={null}
        initial={node}
        onSave={async (data) => {
          await updateCat.mutateAsync({ id: node.id, data });
          toast.success(lang === "cn" ? "已更新分类" : "Category updated");
        }}
      />

      {/* Delete confirm */}
      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("confirm_delete", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "cn"
                ? `分类「${node.nameCn}」及其所有子分类、关联产品都将被删除，无法恢复。`
                : `Category "${node.nameEn}" and all its sub-categories and associated products will be permanently deleted.`}
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

/* ----------------------- Category dialog ----------------------- */

function CategoryDialog({
  open,
  onOpenChange,
  mode,
  parentPath,
  initial,
  parentId,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  parentPath: string | null;
  initial: Category | null;
  parentId?: string | null;
  onSave: (data: Partial<Category>) => Promise<void>;
}) {
  const lang = useI18n((s) => s.lang);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({
    nameEn: "",
    nameCn: "",
    descEn: "",
    descCn: "",
    icon: "",
    order: 0,
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        nameEn: initial?.nameEn ?? "",
        nameCn: initial?.nameCn ?? "",
        descEn: initial?.descEn ?? "",
        descCn: initial?.descCn ?? "",
        icon: initial?.icon ?? "",
        order: initial?.order ?? 0,
      });
    }
  }, [open, initial]);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameEn && !form.nameCn) {
      toast.error(
        lang === "cn"
          ? "请至少填写一种语言的名称"
          : "Please enter at least one language name"
      );
      return;
    }
    setBusy(true);
    try {
      const data: Partial<Category> = {
        nameEn: form.nameEn || "Untitled",
        nameCn: form.nameCn || "未命名",
        descEn: form.descEn || null,
        descCn: form.descCn || null,
        icon: form.icon || null,
        order: Number(form.order) || 0,
      };
      if (mode === "create" && parentId) {
        data.parentId = parentId;
      }
      await onSave(data);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? lang === "cn" ? "新增分类" : "Add Category"
              : lang === "cn" ? "编辑分类" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {parentPath
              ? lang === "cn"
                ? `父级：${parentPath}`
                : `Parent: ${parentPath}`
              : lang === "cn"
              ? "将创建为顶级（一级）分类"
              : "Will be created as a top-level (L1) category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldLabel label={`${lang === "cn" ? "名称" : "Name"} (EN)`}>
              <Input
                value={form.nameEn}
                onChange={(e) => setField("nameEn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "名称" : "Name"} (中文)`}>
              <Input
                value={form.nameCn}
                onChange={(e) => setField("nameCn", e.target.value)}
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldLabel label={`${lang === "cn" ? "描述" : "Description"} (EN)`}>
              <Textarea
                rows={2}
                value={form.descEn}
                onChange={(e) => setField("descEn", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "描述" : "Description"} (中文)`}>
              <Textarea
                rows={2}
                value={form.descCn}
                onChange={(e) => setField("descCn", e.target.value)}
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldLabel label={`${lang === "cn" ? "图标（可选）" : "Icon (optional)"}`}>
              <Input
                value={form.icon}
                onChange={(e) => setField("icon", e.target.value)}
                placeholder="e.g. speakers"
              />
            </FieldLabel>
            <FieldLabel label={`${lang === "cn" ? "排序" : "Order"}`}>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
              />
            </FieldLabel>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {tr("cancel", lang)}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {tr("save", lang)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
