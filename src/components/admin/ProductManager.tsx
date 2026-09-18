"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  useAddProductImage,
  useCategoriesAdmin,
  useCreateProduct,
  useDeleteProduct,
  useDeleteProductImage,
  useProductsAdmin,
  useUpdateProduct,
  useUpdateProductImage,
  type ProductFilters,
} from "./hooks";
import { ImageUploader } from "./ImageUploader";
import type { Category, Product, ProductImage, ProductSpec } from "./types";
import { cn } from "@/lib/utils";

/* ----------------------- helpers ----------------------- */

interface FlatCat {
  id: string;
  nameEn: string;
  nameCn: string;
  depth: number;
  path: string; // "L1 > L2 > L3"
}

function flattenCats(tree: Category[]): FlatCat[] {
  const out: FlatCat[] = [];
  function walk(nodes: Category[], parentPath: string, depth: number) {
    for (const n of nodes) {
      const path = parentPath ? `${parentPath} > ${n.nameEn}` : n.nameEn;
      out.push({
        id: n.id,
        nameEn: n.nameEn,
        nameCn: n.nameCn,
        depth,
        path,
      });
      if (n.children?.length) walk(n.children, path, depth + 1);
    }
  }
  walk(tree, "", 0);
  return out;
}

function parseSpecs(raw: string | null): ProductSpec[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as ProductSpec[];
  } catch {
    return [];
  }
}

/* ----------------------- main view ----------------------- */

export function ProductManager() {
  const lang = useI18n((s) => s.lang);
  const cats = useCategoriesAdmin();
  const [filters, setFilters] = React.useState<ProductFilters>({
    categoryId: "",
    status: "",
    q: "",
  });
  const products = useProductsAdmin(filters);

  const flatCats = React.useMemo(() => flattenCats(cats.data ?? []), [cats.data]);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);

  function onAdd() {
    setEditing(null);
    setEditOpen(true);
  }
  function onEdit(p: Product) {
    setEditing(p);
    setEditOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={lang === "cn" ? "搜索产品名称或描述..." : "Search by name or description..."}
              value={filters.q ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, q: e.target.value }))
              }
              className="pl-9"
            />
          </div>
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                categoryId: v === "all" ? "" : v,
              }))
            }
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue
                placeholder={lang === "cn" ? "全部分类" : "All categories"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {lang === "cn" ? "全部分类" : "All categories"}
              </SelectItem>
              <SelectGroup>
                {flatCats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {`${"　".repeat(c.depth)}${c.path.split(" > ").pop()}${
                      c.depth > 0 ? "" : ""
                    } (${c.nameCn})`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={filters.status || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                status: v === "all" ? "" : (v as "listed" | "unlisted"),
              }))
            }
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder={lang === "cn" ? "全部状态" : "All status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {lang === "cn" ? "全部状态" : "All status"}
              </SelectItem>
              <SelectItem value="listed">{tr("listed", lang)}</SelectItem>
              <SelectItem value="unlisted">{tr("unlisted", lang)}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onAdd}>
            <Plus className="size-4" />
            {lang === "cn" ? "新增产品" : "Add Product"}
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      {products.isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : !products.data || products.data.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <ImageOff className="size-8 opacity-50" />
            <p className="text-sm">
              {lang === "cn" ? "暂无产品，点击新增" : "No products yet. Add one!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.data.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
            >
              <ProductCard
                product={p}
                flatCats={flatCats}
                onEdit={() => onEdit(p)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      <ProductEditor
        open={editOpen}
        onOpenChange={setEditOpen}
        product={editing}
        flatCats={flatCats}
      />
    </div>
  );
}

/* ----------------------- product card ----------------------- */

function ProductCard({
  product,
  flatCats,
  onEdit,
}: {
  product: Product;
  flatCats: FlatCat[];
  onEdit: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const update = useUpdateProduct();
  const delMut = useDeleteProduct();
  const [delOpen, setDelOpen] = React.useState(false);

  async function toggleStatus() {
    try {
      await update.mutateAsync({
        id: product.id,
        data: {
          status: product.status === "listed" ? "unlisted" : "listed",
        },
      });
      toast.success(
        lang === "cn"
          ? product.status === "listed"
            ? "已下架"
            : "已上架"
          : product.status === "listed"
          ? "Unlisted"
          : "Listed"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function toggleFeatured() {
    try {
      await update.mutateAsync({
        id: product.id,
        data: { featured: !product.featured },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function onDel() {
    try {
      await delMut.mutateAsync(product.id);
      toast.success(lang === "cn" ? "已删除产品" : "Product deleted");
      setDelOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const cat = flatCats.find((c) => c.id === product.categoryId);
  const cover = product.coverImage ?? product.images?.[0]?.url;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={product.nameEn}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          {product.status === "listed" ? (
            <Badge className="bg-emerald-600/80 text-white hover:bg-emerald-600">
              {tr("listed", lang)}
            </Badge>
          ) : (
            <Badge variant="secondary" className="opacity-80">
              {tr("unlisted", lang)}
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-brand text-primary-foreground hover:bg-brand">
              <Star className="mr-1 size-3 fill-current" />
              {tr("featured", lang)}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 p-3">
        <div className="line-clamp-1 text-sm font-semibold">
          {lang === "cn" ? product.nameCn : product.nameEn}
        </div>
        <div className="line-clamp-1 text-xs text-muted-foreground">
          {lang === "cn" ? product.nameEn : product.nameCn}
        </div>
        <div className="text-[11px] text-muted-foreground/80">
          {cat ? (
            <>
              {cat.path}
              {" · "}
              {lang === "cn" ? cat.nameCn : cat.nameEn}
            </>
          ) : (
            <span className="text-destructive">—</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1 pt-3">
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
            <Pencil className="size-3.5" />
            {tr("edit", lang)}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={toggleFeatured}
            title={tr("featured", lang)}
          >
            {product.featured ? (
              <Star className="size-4 fill-brand text-brand" />
            ) : (
              <StarOff className="size-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={toggleStatus}
            title={product.status === "listed" ? tr("unlist", lang) : tr("list", lang)}
          >
            {product.status === "listed" ? (
              <ArrowDown className="size-4 text-yellow-500" />
            ) : (
              <ArrowUp className="size-4 text-emerald-500" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDelOpen(true)}
            title={tr("delete", lang)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("confirm_delete", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "cn"
                ? `产品「${product.nameCn}」及其所有图片都将被永久删除。`
                : `Product "${product.nameEn}" and all its images will be permanently deleted.`}
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
    </Card>
  );
}

/* ----------------------- product editor (Sheet) ----------------------- */

function ProductEditor({
  open,
  onOpenChange,
  product,
  flatCats,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
  flatCats: FlatCat[];
}) {
  const lang = useI18n((s) => s.lang);
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();

  const [form, setForm] = React.useState({
    categoryId: "",
    nameEn: "",
    nameCn: "",
    shortDescEn: "",
    shortDescCn: "",
    descEn: "",
    descCn: "",
    status: "listed" as "listed" | "unlisted",
    featured: false,
    order: 0,
  });
  const [specs, setSpecs] = React.useState<ProductSpec[]>([]);
  const [coverImage, setCoverImage] = React.useState<string>("");
  const [images, setImages] = React.useState<ProductImage[]>([]);

  React.useEffect(() => {
    if (open) {
      if (product) {
        setForm({
          categoryId: product.categoryId,
          nameEn: product.nameEn,
          nameCn: product.nameCn,
          shortDescEn: product.shortDescEn ?? "",
          shortDescCn: product.shortDescCn ?? "",
          descEn: product.descEn ?? "",
          descCn: product.descCn ?? "",
          status: product.status,
          featured: product.featured,
          order: product.order,
        });
        setSpecs(parseSpecs(product.specs));
        setCoverImage(product.coverImage ?? "");
        setImages(product.images ?? []);
      } else {
        setForm({
          categoryId: flatCats[0]?.id ?? "",
          nameEn: "",
          nameCn: "",
          shortDescEn: "",
          shortDescCn: "",
          descEn: "",
          descCn: "",
          status: "listed",
          featured: false,
          order: 0,
        });
        setSpecs([]);
        setCoverImage("");
        setImages([]);
      }
    }
  }, [open, product, flatCats]);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    if (!form.categoryId) {
      toast.error(lang === "cn" ? "请选择产品分类" : "Please select a category");
      return;
    }
    if (!form.nameEn && !form.nameCn) {
      toast.error(
        lang === "cn"
          ? "请至少填写一种语言的产品名称"
          : "Please enter at least one language name"
      );
      return;
    }
    const payload = {
      ...form,
      specs: specs.length ? specs : [],
      coverImage: coverImage || null,
    };
    try {
      if (product) {
        await updateMut.mutateAsync({ id: product.id, data: payload });
        toast.success(lang === "cn" ? "产品已更新" : "Product updated");
      } else {
        await createMut.mutateAsync({
          ...payload,
          images: images.map((i) => i.url),
        });
        toast.success(lang === "cn" ? "产品已创建" : "Product created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-2xl md:max-w-3xl"
      >
        <SheetHeader className="pb-3">
          <SheetTitle>
            {product
              ? lang === "cn"
                ? "编辑产品"
                : "Edit Product"
              : lang === "cn"
              ? "新增产品"
              : "Add Product"}
          </SheetTitle>
          <SheetDescription>
            {lang === "cn"
              ? "支持中英双语字段，至少填写一种语言"
              : "Bilingual fields; at least one language required"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          {/* Basic */}
          <Section title={lang === "cn" ? "基础信息" : "Basic"}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldLabel label={lang === "cn" ? "产品分类" : "Category"}>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setField("categoryId", v)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={lang === "cn" ? "选择分类" : "Select category"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {flatCats.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {`${"　".repeat(c.depth)}${c.path.split(" > ").pop()} (${c.nameCn})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldLabel>
              <FieldLabel label={lang === "cn" ? "排序" : "Order"}>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField("order", Number(e.target.value))}
                />
              </FieldLabel>
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
              <FieldLabel label={`${lang === "cn" ? "简短描述" : "Short Desc"} (EN)`}>
                <Textarea
                  rows={2}
                  value={form.shortDescEn}
                  onChange={(e) => setField("shortDescEn", e.target.value)}
                />
              </FieldLabel>
              <FieldLabel label={`${lang === "cn" ? "简短描述" : "Short Desc"} (中文)`}>
                <Textarea
                  rows={2}
                  value={form.shortDescCn}
                  onChange={(e) => setField("shortDescCn", e.target.value)}
                />
              </FieldLabel>
              <FieldLabel label={`${lang === "cn" ? "详细描述" : "Description"} (EN)`}>
                <Textarea
                  rows={4}
                  value={form.descEn}
                  onChange={(e) => setField("descEn", e.target.value)}
                />
              </FieldLabel>
              <FieldLabel label={`${lang === "cn" ? "详细描述" : "Description"} (中文)`}>
                <Textarea
                  rows={4}
                  value={form.descCn}
                  onChange={(e) => setField("descCn", e.target.value)}
                />
              </FieldLabel>
            </div>

            <Separator className="my-3" />

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  {tr("listed", lang)} / {tr("unlisted", lang)}
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setField("status", v as "listed" | "unlisted")
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listed">{tr("listed", lang)}</SelectItem>
                    <SelectItem value="unlisted">{tr("unlisted", lang)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="prod-featured"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  {tr("featured", lang)}
                </Label>
                <Switch
                  id="prod-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setField("featured", v)}
                />
              </div>
            </div>
          </Section>

          {/* Images */}
          <Section
            title={lang === "cn" ? "产品图片" : "Product Images"}
            subtitle={
              lang === "cn"
                ? "拖拽排序，第一张会自动设为封面"
                : "Drag to reorder; first image auto-sets as cover"
            }
          >
            {product ? (
              <ImageManager productId={product.id} images={images} onChange={setImages} />
            ) : (
              <div className="rounded-md border border-dashed border-border/60 bg-muted/30 p-6 text-center text-xs text-muted-foreground">
                {lang === "cn"
                  ? "保存产品后即可上传图片"
                  : "Save the product first to upload images"}
              </div>
            )}

            <div className="mt-3">
              <FieldLabel label={lang === "cn" ? "封面图（可手动指定）" : "Cover Image (override)"}>
                <ImageUploader
                  value={coverImage}
                  onChange={setCoverImage}
                  previewClassName="h-24 w-24"
                  hideUrlInput
                />
              </FieldLabel>
            </div>
          </Section>

          {/* Specs */}
          <Section
            title={lang === "cn" ? "技术规格" : "Specifications"}
            subtitle={
              lang === "cn"
                ? "可新增/删除行；标签 + 值双语填写"
                : "Add/remove rows; bilingual label + value"
            }
          >
            <SpecsEditor specs={specs} onChange={setSpecs} />
          </Section>
        </div>

        <SheetFooter className="mt-6 border-t border-border/60 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tr("cancel", lang)}
          </Button>
          <Button onClick={onSave} disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {tr("save", lang)}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ----------------------- image manager ----------------------- */

function ImageManager({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
}) {
  const lang = useI18n((s) => s.lang);
  const addImg = useAddProductImage();
  const delImg = useDeleteProductImage();
  const updImg = useUpdateProductImage();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function onAdd(url: string) {
    if (!url) return;
    try {
      const created = await addImg.mutateAsync({ productId, url });
      onChange([...images, created]);
      toast.success(lang === "cn" ? "图片已添加" : "Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add failed");
    }
  }

  async function onDel(img: ProductImage) {
    try {
      await delImg.mutateAsync({ productId, imageId: img.id });
      onChange(images.filter((i) => i.id !== img.id));
      toast.success(lang === "cn" ? "图片已删除" : "Image deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function persistOrder(newOrder: ProductImage[]) {
    // Update order for changed items
    await Promise.all(
      newOrder.map((img, idx) =>
        img.order !== idx
          ? updImg.mutateAsync({
              productId,
              imageId: img.id,
              data: { order: idx },
            })
          : Promise.resolve()
      )
    );
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex((i) => i.id === active.id);
    const newIdx = images.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(images, oldIdx, newIdx).map((img, idx) => ({
      ...img,
      order: idx,
    }));
    onChange(next);
    void persistOrder(next);
  }

  async function move(img: ProductImage, dir: -1 | 1) {
    const idx = images.findIndex((i) => i.id === img.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= images.length) return;
    const next = arrayMove(images, idx, newIdx).map((im, i) => ({
      ...im,
      order: i,
    }));
    onChange(next);
    await persistOrder(next);
  }

  return (
    <div className="space-y-3">
      {images.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          {lang === "cn" ? "暂无图片，请上传" : "No images yet"}
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {images.map((img, idx) => (
                <SortableImage
                  key={img.id}
                  img={img}
                  idx={idx}
                  total={images.length}
                  onUp={() => move(img, -1)}
                  onDown={() => move(img, 1)}
                  onDelete={() => onDel(img)}
                  busy={delImg.isPending || updImg.isPending}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <ImageUploader
        label={lang === "cn" ? "新增图片" : "Add Image"}
        onChange={onAdd}
        previewClassName="h-24 w-24"
        hideUrlInput={false}
      />
    </div>
  );
}

function SortableImage({
  img,
  idx,
  total,
  onUp,
  onDown,
  onDelete,
  busy,
}: {
  img: ProductImage;
  idx: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 p-2",
        isDragging && "opacity-50 shadow-lg ring-1 ring-brand"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <img
        src={img.url}
        alt={img.alt ?? `Image ${idx + 1}`}
        className="size-16 shrink-0 rounded-md border border-border/60 object-cover"
      />
      <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
        {img.url}
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          disabled={idx === 0 || busy}
          onClick={onUp}
          title="Up"
        >
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          disabled={idx === total - 1 || busy}
          onClick={onDown}
          title="Down"
        >
          <ArrowDown className="size-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={busy}
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  );
}

/* ----------------------- specs editor ----------------------- */

function SpecsEditor({
  specs,
  onChange,
}: {
  specs: ProductSpec[];
  onChange: (next: ProductSpec[]) => void;
}) {
  const lang = useI18n((s) => s.lang);

  function add() {
    onChange([
      ...specs,
      { labelEn: "", labelCn: "", valueEn: "", valueCn: "" },
    ]);
  }
  function update(idx: number, patch: Partial<ProductSpec>) {
    onChange(specs.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function remove(idx: number) {
    onChange(specs.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {specs.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          {lang === "cn" ? "暂无规格参数" : "No specs yet"}
        </p>
      ) : (
        specs.map((s, idx) => (
          <div
            key={idx}
            className="rounded-md border border-border/50 bg-muted/30 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                #{idx + 1}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => remove(idx)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <Input
                placeholder="Label (EN)"
                value={s.labelEn}
                onChange={(e) => update(idx, { labelEn: e.target.value })}
              />
              <Input
                placeholder="标签 (中文)"
                value={s.labelCn}
                onChange={(e) => update(idx, { labelCn: e.target.value })}
              />
              <Input
                placeholder="Value (EN)"
                value={s.valueEn}
                onChange={(e) => update(idx, { valueEn: e.target.value })}
              />
              <Input
                placeholder="值 (中文)"
                value={s.valueCn}
                onChange={(e) => update(idx, { valueCn: e.target.value })}
              />
            </div>
          </div>
        ))
      )}
      <Button type="button" size="sm" variant="outline" onClick={add}>
        <Plus className="size-4" />
        {lang === "cn" ? "新增参数" : "Add spec"}
      </Button>
    </div>
  );
}

/* ----------------------- small UI helpers ----------------------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
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
