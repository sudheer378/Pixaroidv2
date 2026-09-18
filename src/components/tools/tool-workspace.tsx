"use client";

import { useRef, useState } from "react";
import { runTool } from "@/core/tool-engine/run-tool";
import type { ToolDefinition } from "@/core/tools/types";
import type { ProcessingStatus } from "@/core/processing/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Per-tool options
  const [splitMode, setSplitMode] = useState<"range" | "all">("range");
  const [splitRange, setSplitRange] = useState("");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [pdfPreset, setPdfPreset] = useState<"balanced" | "strong">("balanced");

  const accept = (tool.inputFormats ?? []).join(",");
  const multi = Boolean(tool.multiFile);

  function acceptFiles(list: FileList | File[] | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const [firstIncoming] = incoming;
    if (!firstIncoming) return;
    // Use functional update to avoid stale closure race when adding files quickly.
    setFiles((prev) => (multi ? [...prev, ...incoming] : [firstIncoming]));
    setStatus("ready");
    setResult(null);
    setError(null);
    setProgress(0);
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const current = next[index];
      const swap = next[target];
      if (!current || !swap) return prev;
      next[index] = swap;
      next[target] = current;
      return next;
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setStatus("idle");
      return next;
    });
  }

  async function processFiles() {
    const [firstFile] = files;
    if (!firstFile) return;
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus("processing");

    const options: Record<string, unknown> = {};
    if (tool.slug === "split-pdf") {
      options.mode = splitMode;
      options.range = splitRange;
    }
    if (tool.slug === "image-resizer") {
      options.width = Number(resizeWidth) || 0;
      options.height = Number(resizeHeight) || 0;
    }
    if (tool.slug === "compress-pdf") {
      options.preset = pdfPreset;
    }

    try {
      const response = await runTool(tool.slug, multi ? files : firstFile, {
        options,
        onProgress: setProgress,
        onStatus: setStatus,
      });
      setResult(response.output);
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "Processing failed.");
    }
  }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result instanceof File && result.name ? result.name : `pixora-${tool.slug}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Give browser time to start download before revoking.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const inputSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <section
      aria-label={`${tool.name} workspace`}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            // Space would otherwise scroll the page as well as activating.
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          acceptFiles(event.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
      >
        <svg className="mb-3 h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="font-semibold text-slate-900">
          {multi ? "Click to select files" : "Click to select a file"}
        </p>
        <p className="mt-1 text-sm text-slate-500">or drag and drop here</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multi}
          className="hidden"
          onChange={(event) => {
            acceptFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1 truncate text-slate-700">{file.name}</span>
              <span className="shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
              {multi && files.length > 1 && (
                <span className="flex shrink-0 gap-1">
                  <button type="button" aria-label="Move up" onClick={() => moveFile(index, -1)} className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-200" disabled={index === 0}>↑</button>
                  <button type="button" aria-label="Move down" onClick={() => moveFile(index, 1)} className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-200" disabled={index === files.length - 1}>↓</button>
                </span>
              )}
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(index)} className="shrink-0 rounded px-1.5 py-0.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">✕</button>
            </li>
          ))}
        </ul>
      )}

      {tool.slug === "split-pdf" && files.length > 0 && (
        <div className="mt-4 space-y-3 rounded-lg border border-slate-200 p-4">
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="split-mode" checked={splitMode === "range"} onChange={() => setSplitMode("range")} />
              Extract page range
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="split-mode" checked={splitMode === "all"} onChange={() => setSplitMode("all")} />
              Split every page
            </label>
          </div>
          {splitMode === "range" && (
            <input
              type="text"
              value={splitRange}
              onChange={(event) => setSplitRange(event.target.value)}
              placeholder="e.g. 1-3 or 2,5,7-9"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              aria-label="Page range"
            />
          )}
        </div>
      )}

      {tool.slug === "compress-pdf" && files.length > 0 && (
        <div className="mt-4 space-y-3 rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700">Compression strength</p>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="pdf-preset" checked={pdfPreset === "balanced"} onChange={() => setPdfPreset("balanced")} />
              Balanced (preserves quality)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="pdf-preset" checked={pdfPreset === "strong"} onChange={() => setPdfPreset("strong")} />
              Strong (smaller file, may soften scans)
            </label>
          </div>
        </div>
      )}

      {tool.slug === "image-resizer" && files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-4">
          <label className="text-sm text-slate-600">
            Width (px)
            <input
              type="number"
              min={1}
              max={10000}
              value={resizeWidth}
              onChange={(event) => setResizeWidth(event.target.value)}
              placeholder="auto"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-600">
            Height (px)
            <input
              type="number"
              min={1}
              max={10000}
              value={resizeHeight}
              onChange={(event) => setResizeHeight(event.target.value)}
              placeholder="auto"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>
          <p className="col-span-2 text-xs text-slate-400">Leave one field empty to keep the aspect ratio.</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={processFiles}
          disabled={files.length === 0 || status === "processing"}
          className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "processing" ? `Processing… ${progress}%` : tool.name}
        </button>
        {result && (
          <button
            type="button"
            onClick={download}
            className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Download {result instanceof File ? `(${formatBytes(result.size)})` : ""}
          </button>
        )}
      </div>

      {status === "processing" && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <p className="mt-3 text-sm text-slate-500" aria-live="polite">
        {error ? (
          <span className="font-medium text-rose-600">{error}</span>
        ) : result ? (
          <span className="font-medium text-emerald-600">
            Done{result.size > 0 && inputSize > result.size ? ` — ${Math.round((1 - result.size / inputSize) * 100)}% smaller` : ""}. Your file is ready to download.
          </span>
        ) : files.length > 0 ? (
          `${files.length} file${files.length > 1 ? "s" : ""} selected (${formatBytes(inputSize)}).`
        ) : (
          "Files are processed on your device and never uploaded."
        )}
      </p>
    </section>
  );
}
