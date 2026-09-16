"use client";

import { useEffect, useMemo, useState } from "react";
import {
  colorFromHex,
  convertZonedTime,
  decodeBase64,
  encodeBase64,
  formatJson,
  hashText,
  worldCities,
} from "@/core/interactive/generators";
import { Card, CopyButton, ErrorText, Field, inputClass, ResultPanel, selectClass, ToggleChip } from "./ui";

const textareaClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

// ---------- JSON formatter ----------

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");

  const result = useMemo(() => {
    if (input.trim() === "") return null;
    return formatJson(input, mode === "minify" ? "minify" : 2);
  }, [input, mode]);

  return (
    <Card>
      <Field label="JSON input">
        <textarea
          rows={10}
          className={textareaClass}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='{"name": "Pixora", "tools": 32}'
          spellCheck={false}
        />
      </Field>
      <div className="mt-4 flex gap-2">
        <ToggleChip active={mode === "format"} onClick={() => setMode("format")}>Format (2 spaces)</ToggleChip>
        <ToggleChip active={mode === "minify"} onClick={() => setMode("minify")}>Minify</ToggleChip>
      </div>
      {result && (
        <ResultPanel>
          {result.ok ? (
            <>
              <p className="mb-2 text-sm font-semibold text-emerald-600">✓ Valid JSON</p>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 font-mono text-sm text-slate-900 shadow-sm">{result.output}</pre>
              <div className="mt-3"><CopyButton text={result.output} /></div>
            </>
          ) : (
            <p className="text-sm font-medium text-rose-600">✗ Invalid JSON: {result.error}</p>
          )}
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Base64 ----------

export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (input === "") return { output: "", error: null as string | null };
    try {
      return { output: mode === "encode" ? encodeBase64(input) : decodeBase64(input), error: null };
    } catch (cause) {
      return { output: "", error: cause instanceof Error ? cause.message : "Conversion failed." };
    }
  }, [mode, input]);

  return (
    <Card>
      <div className="flex gap-2">
        <ToggleChip active={mode === "encode"} onClick={() => setMode("encode")}>Encode → Base64</ToggleChip>
        <ToggleChip active={mode === "decode"} onClick={() => setMode("decode")}>Decode ← Base64</ToggleChip>
      </div>
      <div className="mt-4">
        <Field label={mode === "encode" ? "Plain text" : "Base64 string"}>
          <textarea
            rows={6}
            className={textareaClass}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="}
            spellCheck={false}
          />
        </Field>
      </div>
      <ErrorText message={result.error} />
      {result.output && (
        <ResultPanel>
          <p className="max-h-72 overflow-y-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-900">{result.output}</p>
          <div className="mt-3"><CopyButton text={result.output} /></div>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Hash generator ----------

const HASH_ALGORITHMS = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"] as const;

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (input === "") return;
    let cancelled = false;
    Promise.all(
      HASH_ALGORITHMS.map(async (algorithm) => [algorithm, await hashText(input, algorithm)] as const),
    ).then((entries) => {
      if (!cancelled) setHashes(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <Card>
      <Field label="Text to hash">
        <textarea
          rows={5}
          className={textareaClass}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type or paste text…"
          spellCheck={false}
        />
      </Field>
      {input !== "" && Object.keys(hashes).length > 0 && (
        <ResultPanel>
          <div className="space-y-4">
            {HASH_ALGORITHMS.map((algorithm) => (
              <div key={algorithm}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{algorithm}</p>
                  <CopyButton text={hashes[algorithm] ?? ""} />
                </div>
                <p className="mt-1 break-all font-mono text-sm text-slate-900">{hashes[algorithm]}</p>
              </div>
            ))}
          </div>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Color converter ----------

export function ColorConverter() {
  const [hex, setHex] = useState("#2563eb");
  const [textInput, setTextInput] = useState("#2563eb");

  const color = useMemo(() => colorFromHex(hex), [hex]);

  function handleTextInput(value: string) {
    setTextInput(value);
    const parsed = colorFromHex(value);
    if (parsed) setHex(parsed.hex);
  }

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <Field label="Pick a colour">
          <input
            type="color"
            className="mt-1 h-24 w-24 cursor-pointer rounded-xl border border-slate-300"
            value={color?.hex ?? "#2563eb"}
            onChange={(event) => {
              setHex(event.target.value);
              setTextInput(event.target.value);
            }}
          />
        </Field>
        <Field label="Or enter a HEX value">
          <input
            type="text"
            className={inputClass}
            value={textInput}
            onChange={(event) => handleTextInput(event.target.value)}
            placeholder="#2563eb"
            spellCheck={false}
          />
        </Field>
      </div>
      {color && (
        <ResultPanel>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 shadow-inner" style={{ backgroundColor: color.hex }} />
            <div className="grid flex-1 gap-2">
              {[
                { label: "HEX", value: color.hex },
                { label: "RGB", value: color.rgbString },
                { label: "HSL", value: color.hslString },
              ].map((format) => (
                <div key={format.label} className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm text-slate-900">
                    <span className="mr-2 text-xs font-semibold text-slate-400">{format.label}</span>
                    {format.value}
                  </p>
                  <CopyButton text={format.value} />
                </div>
              ))}
            </div>
          </div>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Time zone converter ----------

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function TimezoneConverter() {
  const [fromZone, setFromZone] = useState("America/New_York");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("09:00");

  const conversions = useMemo(() => {
    if (!date || !time) return [];
    try {
      return worldCities
        .filter((city) => city.id !== fromZone)
        .map((city) => ({
          city,
          result: convertZonedTime(date, time, fromZone, city.id),
        }));
    } catch {
      return [];
    }
  }, [date, time, fromZone]);

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="From city">
          <select className={selectClass} value={fromZone} onChange={(event) => setFromZone(event.target.value)}>
            {worldCities.map((city) => (
              <option key={city.id} value={city.id}>{city.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputClass} value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="Time">
          <input type="time" className={inputClass} value={time} onChange={(event) => setTime(event.target.value)} />
        </Field>
      </div>
      {conversions.length > 0 && (
        <ResultPanel>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {conversions.map(({ city, result }) => (
              <li key={city.id} className="flex items-baseline justify-between gap-3 border-b border-blue-100 py-1.5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                <span className="text-sm text-slate-600">{city.label}</span>
                <span className="font-mono text-sm font-semibold text-slate-950">
                  {result.time}
                  {result.dayLabel !== "same day" && (
                    <span className="ml-1.5 text-xs font-normal text-amber-600">({result.dayLabel})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">Daylight saving is applied automatically for the selected date.</p>
        </ResultPanel>
      )}
    </Card>
  );
}
