"use client";

import * as React from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ImageUploaderProps {
  /** Current image URL (or empty/undefined). */
  value?: string | null;
  /** Called whenever the URL changes (upload success or URL paste). */
  onChange: (url: string) => void;
  /** Optional label above the control. */
  label?: string;
  /** Hint shown under the control. */
  hint?: string;
  /** Optional preview size class; defaults to a 160x160 square. */
  previewClassName?: string;
  /** When true, hides the "paste URL" alternate input. */
  hideUrlInput?: boolean;
  /** Optional className applied to the root wrapper. */
  className?: string;
}

/**
 * Reusable image uploader used across the admin CMS.
 * - Click / drop a file: POST /api/upload (multipart, field "file")
 * - The endpoint returns { url: "/uploads/..." } which is passed to onChange.
 * - Alternative: paste a direct URL into the text input.
 */
export function ImageUploader({
  value,
  onChange,
  label,
  hint,
  previewClassName,
  hideUrlInput,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) {
        let msg = `Upload failed (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
    // reset so selecting the same file again re-triggers
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex flex-wrap items-start gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-muted/40 transition-colors",
            dragOver ? "border-brand" : "border-border hover:border-brand/60",
            previewClassName
          )}
          aria-label="Upload image"
        >
          {value ? (
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 p-2 text-center text-muted-foreground">
              {uploading ? (
                <Loader2 className="size-6 animate-spin text-brand" />
              ) : (
                <ImagePlus className="size-6" />
              )}
              <span className="text-[10px]">
                {uploading ? "Uploading..." : "Click or drop"}
              </span>
            </div>
          )}
          {value && !uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="size-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onInputChange}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload
          </Button>
          {value && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          )}
          {!hideUrlInput && (
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="or paste image URL"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-44"
              />
            </div>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
