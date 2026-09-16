"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  generatePassword,
  generateRandomNumbers,
  generateUuids,
  passwordEntropyBits,
} from "@/core/interactive/generators";
import { Card, CopyButton, ErrorText, Field, inputClass, PrimaryButton, ResultPanel, selectClass, ToggleChip } from "./ui";

// ---------- QR code ----------

type QrType = "url" | "text" | "wifi" | "email";

export function QrCodeGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [dark, setDark] = useState("#0f172a");
  const [light, setLight] = useState("#ffffff");
  const [size, setSize] = useState(320);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasContent, setHasContent] = useState(false);

  const payload = useMemo(() => {
    switch (type) {
      case "url": return url.trim() === "" || url.trim() === "https://" ? "" : url.trim();
      case "text": return text.trim();
      case "wifi": {
        if (!ssid) return "";
        const escape = (v: string) => v.replace(/([\\;,:"])/g, "\\$1");
        return `WIFI:T:${security};S:${escape(ssid)};P:${escape(wifiPassword)};;`;
      }
      case "email": {
        if (!email) return "";
        const params = subject ? `?subject=${encodeURIComponent(subject)}` : "";
        return `mailto:${email}${params}`;
      }
    }
  }, [type, url, text, ssid, wifiPassword, security, email, subject]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!payload) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      // Async state update keeps React render cascades clean.
      Promise.resolve().then(() => setHasContent(false));
      return;
    }
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 2,
      color: { dark, light },
      errorCorrectionLevel: "M",
    }).then(() => setHasContent(true)).catch(() => setHasContent(false));
  }, [payload, dark, light, size]);

  async function downloadPng() {
    if (!payload) return;
    const dataUrl = await QRCode.toDataURL(payload, {
      width: 1024,
      margin: 2,
      color: { dark, light },
      errorCorrectionLevel: "M",
    });
    triggerDownload(dataUrl, "pixora-qr-code.png");
  }

  async function downloadSvg() {
    if (!payload) return;
    const svg = await QRCode.toString(payload, {
      type: "svg",
      margin: 2,
      color: { dark, light },
      errorCorrectionLevel: "M",
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, "pixora-qr-code.svg");
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  function triggerDownload(href: string, name: string) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        <ToggleChip active={type === "url"} onClick={() => setType("url")}>Link / URL</ToggleChip>
        <ToggleChip active={type === "text"} onClick={() => setType("text")}>Text</ToggleChip>
        <ToggleChip active={type === "wifi"} onClick={() => setType("wifi")}>Wi-Fi</ToggleChip>
        <ToggleChip active={type === "email"} onClick={() => setType("email")}>Email</ToggleChip>
      </div>

      <div className="mt-4 space-y-4">
        {type === "url" && (
          <Field label="Website URL">
            <input type="url" className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </Field>
        )}
        {type === "text" && (
          <Field label="Text content">
            <textarea rows={3} className={inputClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text…" />
          </Field>
        )}
        {type === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Network name (SSID)">
              <input type="text" className={inputClass} value={ssid} onChange={(e) => setSsid(e.target.value)} />
            </Field>
            <Field label="Password">
              <input type="text" className={inputClass} value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
            </Field>
            <Field label="Security">
              <select className={selectClass} value={security} onChange={(e) => setSecurity(e.target.value)}>
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (no password)</option>
              </select>
            </Field>
          </div>
        )}
        {type === "email" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email address">
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" />
            </Field>
            <Field label="Subject (optional)">
              <input type="text" className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Field label="Code colour">
            <input type="color" className="mt-1 h-11 w-full cursor-pointer rounded-lg border border-slate-300" value={dark} onChange={(e) => setDark(e.target.value)} />
          </Field>
          <Field label="Background">
            <input type="color" className="mt-1 h-11 w-full cursor-pointer rounded-lg border border-slate-300" value={light} onChange={(e) => setLight(e.target.value)} />
          </Field>
          <Field label="Preview size">
            <select className={selectClass} value={size} onChange={(e) => setSize(Number(e.target.value))}>
              <option value={240}>Small</option>
              <option value={320}>Medium</option>
              <option value={400}>Large</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-6">
        <canvas ref={canvasRef} className={hasContent ? "" : "hidden"} aria-label="Generated QR code" />
        {!hasContent && <p className="py-16 text-sm text-slate-400">Enter content above to generate your QR code</p>}
        {hasContent && (
          <div className="mt-4 flex gap-3">
            <PrimaryButton onClick={downloadPng}>Download PNG</PrimaryButton>
            <button type="button" onClick={downloadSvg} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600">
              Download SVG
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ---------- Password ----------

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(
    () => ({ length, uppercase, lowercase, numbers, symbols }),
    [length, uppercase, lowercase, numbers, symbols],
  );

  const regenerate = useCallback(() => {
    try {
      setError(null);
      setPassword(generatePassword(options));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate password.");
    }
  }, [options]);

  useEffect(() => {
    // Generate after mount (async) so server and client HTML match.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) regenerate();
    });
    return () => {
      cancelled = true;
    };
  }, [regenerate]);

  const entropy = passwordEntropyBits(options);
  const strength = entropy >= 100 ? { label: "Very strong", color: "bg-emerald-500", width: 100 }
    : entropy >= 70 ? { label: "Strong", color: "bg-emerald-400", width: 80 }
    : entropy >= 50 ? { label: "Good", color: "bg-amber-400", width: 60 }
    : { label: "Weak", color: "bg-rose-500", width: 30 };

  return (
    <Card>
      <ResultPanel>
        <p className="break-all font-mono text-xl font-semibold text-slate-950" aria-label="Generated password">
          {password || "—"}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <CopyButton text={password} label="Copy password" />
          <PrimaryButton onClick={regenerate}>Regenerate</PrimaryButton>
        </div>
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full ${strength.color}`} style={{ width: `${strength.width}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">{strength.label} · ~{entropy} bits of entropy</p>
        </div>
      </ResultPanel>

      <div className="mt-5">
        <Field label={`Length: ${length}`}>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full accent-blue-600"
          />
        </Field>
        <div className="mt-4 flex flex-wrap gap-2">
          <ToggleChip active={uppercase} onClick={() => setUppercase(!uppercase)}>ABC</ToggleChip>
          <ToggleChip active={lowercase} onClick={() => setLowercase(!lowercase)}>abc</ToggleChip>
          <ToggleChip active={numbers} onClick={() => setNumbers(!numbers)}>123</ToggleChip>
          <ToggleChip active={symbols} onClick={() => setSymbols(!symbols)}>#$&</ToggleChip>
        </div>
        <ErrorText message={error} />
        <p className="mt-3 text-xs text-slate-400">
          Generated with the Web Crypto API on your device. Nothing is transmitted or stored.
        </p>
      </div>
    </Card>
  );
}

// ---------- Random numbers ----------

export function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  function generate() {
    try {
      setError(null);
      setResults(generateRandomNumbers(Number(min), Number(max), Number(count) || 1, unique));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate numbers.");
    }
  }

  return (
    <Card>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Minimum">
          <input type="number" inputMode="numeric" className={inputClass} value={min} onChange={(e) => setMin(e.target.value)} />
        </Field>
        <Field label="Maximum">
          <input type="number" inputMode="numeric" className={inputClass} value={max} onChange={(e) => setMax(e.target.value)} />
        </Field>
        <Field label="How many">
          <input type="number" inputMode="numeric" className={inputClass} value={count} min={1} max={1000} onChange={(e) => setCount(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-blue-600" />
          No duplicates
        </label>
        <PrimaryButton onClick={generate}>Generate</PrimaryButton>
      </div>
      <ErrorText message={error} />
      {results.length > 0 && (
        <ResultPanel>
          <div className="flex flex-wrap gap-2" aria-label="Generated numbers">
            {results.map((value, index) => (
              <span key={index} className="rounded-lg bg-white px-3 py-1.5 font-mono text-lg font-semibold text-slate-900 shadow-sm">
                {value.toLocaleString()}
              </span>
            ))}
          </div>
          <div className="mt-3"><CopyButton text={results.join(", ")} label="Copy all" /></div>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- UUID ----------

export function UuidGenerator() {
  const [count, setCount] = useState("1");
  const [uuids, setUuids] = useState<string[]>(() => []);

  useEffect(() => {
    // Generate after mount (async) so server and client HTML match.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setUuids(generateUuids(1));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <div className="flex items-end gap-4">
        <Field label="How many UUIDs">
          <input type="number" inputMode="numeric" className={inputClass} value={count} min={1} max={500} onChange={(e) => setCount(e.target.value)} />
        </Field>
        <PrimaryButton onClick={() => setUuids(generateUuids(Number(count) || 1))}>Generate</PrimaryButton>
      </div>
      {uuids.length > 0 && (
        <ResultPanel>
          <ul className="max-h-72 space-y-1.5 overflow-y-auto">
            {uuids.map((uuid) => (
              <li key={uuid} className="font-mono text-sm text-slate-900">{uuid}</li>
            ))}
          </ul>
          <div className="mt-3"><CopyButton text={uuids.join("\n")} label={uuids.length > 1 ? "Copy all" : "Copy"} /></div>
        </ResultPanel>
      )}
    </Card>
  );
}
