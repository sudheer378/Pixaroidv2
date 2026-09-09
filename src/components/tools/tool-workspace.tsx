"use client";

import { useState } from "react";
import { runTool } from "../../core/tool-engine/run-tool";
import type { ToolDefinition } from "../../core/tools/types";
import type { ProcessingStatus } from "../../core/processing/types";

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function processFile() {
    if (!file) return;
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus("processing");

    try {
      const response = await runTool(tool.slug, file, {
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
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <section className="tool-workspace" aria-label={`${tool.name} workspace`}>
      <label className="file-picker">
        <span>Select a file</span>
        <input
          type="file"
          accept={tool.inputFormats.join(",")}
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
            setStatus(selected ? "ready" : "idle");
            setProgress(0);
            setResult(null);
            setError(null);
          }}
        />
      </label>

      <div className="workspace-actions">
        <button type="button" onClick={processFile} disabled={!file || status === "processing"}>
          {status === "processing" ? `Processing ${progress}%` : "Process file"}
        </button>
        {result ? (
          <button type="button" onClick={download}>
            Download result
          </button>
        ) : null}
      </div>

      <p className="workspace-status" aria-live="polite">
        {error ?? (result ? "Your result is ready." : file ? `${file.name} selected.` : "Choose a supported file to begin.")}
      </p>
    </section>
  );
}
