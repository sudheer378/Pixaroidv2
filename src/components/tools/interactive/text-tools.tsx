"use client";

import { useMemo, useState } from "react";
import {
  analyzeText,
  convertCase,
  generateLorem,
  platformLimits,
  type CaseStyle,
  type LoremUnit,
} from "@/core/interactive/text";
import { Card, CopyButton, Field, inputClass, PrimaryButton, ResultPanel, selectClass, StatGrid, ToggleChip } from "./ui";

const textareaClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

function formatMinutes(minutes: number): string {
  if (minutes < 1 / 60) return "0 sec";
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  const whole = Math.floor(minutes);
  const seconds = Math.round((minutes - whole) * 60);
  return seconds > 0 ? `${whole} min ${seconds} sec` : `${whole} min`;
}

// ---------- Word counter ----------

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <Card>
      <Field label="Your text">
        <textarea
          rows={10}
          className={textareaClass}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
        />
      </Field>
      <ResultPanel>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div><p className="text-3xl font-bold text-slate-950">{stats.words.toLocaleString()}</p><p className="text-sm text-slate-500">Words</p></div>
          <div><p className="text-3xl font-bold text-slate-950">{stats.characters.toLocaleString()}</p><p className="text-sm text-slate-500">Characters</p></div>
          <div><p className="text-3xl font-bold text-slate-950">{stats.sentences.toLocaleString()}</p><p className="text-sm text-slate-500">Sentences</p></div>
          <div><p className="text-3xl font-bold text-slate-950">{stats.paragraphs.toLocaleString()}</p><p className="text-sm text-slate-500">Paragraphs</p></div>
        </div>
        <StatGrid
          items={[
            { value: stats.charactersNoSpaces.toLocaleString(), label: "Characters (no spaces)" },
            { value: formatMinutes(stats.readingTimeMinutes), label: "Reading time (~225 wpm)" },
            { value: formatMinutes(stats.speakingTimeMinutes), label: "Speaking time (~140 wpm)" },
          ]}
        />
      </ResultPanel>
    </Card>
  );
}

// ---------- Character counter ----------

export function CharacterCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <Card>
      <Field label="Your text">
        <textarea
          rows={8}
          className={textareaClass}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
        />
      </Field>
      <ResultPanel>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-3xl font-bold text-slate-950">{stats.characters.toLocaleString()}</p><p className="text-sm text-slate-500">Characters</p></div>
          <div><p className="text-3xl font-bold text-slate-950">{stats.charactersNoSpaces.toLocaleString()}</p><p className="text-sm text-slate-500">Without spaces</p></div>
        </div>
        <div className="mt-5 space-y-2.5">
          {platformLimits.map((platform) => {
            const remaining = platform.limit - stats.characters;
            const percent = Math.min(100, (stats.characters / platform.limit) * 100);
            return (
              <div key={platform.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-600">{platform.label} ({platform.limit})</span>
                  <span className={remaining < 0 ? "font-semibold text-rose-600" : "text-slate-400"}>
                    {remaining < 0 ? `${Math.abs(remaining)} over` : `${remaining} left`}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${remaining < 0 ? "bg-rose-500" : percent > 85 ? "bg-amber-400" : "bg-emerald-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ResultPanel>
    </Card>
  );
}

// ---------- Case converter ----------

const caseStyles: { id: CaseStyle; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
];

export function CaseConverter() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<CaseStyle>("title");
  const output = useMemo(() => (text ? convertCase(text, style) : ""), [text, style]);

  return (
    <Card>
      <Field label="Your text">
        <textarea
          rows={5}
          className={textareaClass}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
        />
      </Field>
      <div className="mt-4 flex flex-wrap gap-2">
        {caseStyles.map((item) => (
          <ToggleChip key={item.id} active={style === item.id} onClick={() => setStyle(item.id)}>
            {item.label}
          </ToggleChip>
        ))}
      </div>
      {output && (
        <ResultPanel>
          <p className="whitespace-pre-wrap break-words font-mono text-sm text-slate-900">{output}</p>
          <div className="mt-3"><CopyButton text={output} /></div>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Lorem ipsum ----------

export function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState("3");
  const [output, setOutput] = useState(() => generateLorem("paragraphs", 3));

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Generate">
          <select className={selectClass} value={unit} onChange={(event) => setUnit(event.target.value as LoremUnit)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </Field>
        <Field label="Amount">
          <input
            type="number"
            inputMode="numeric"
            className={inputClass}
            value={count}
            min={1}
            max={unit === "words" ? 1000 : 50}
            onChange={(event) => setCount(event.target.value)}
          />
        </Field>
        <div className="flex items-end">
          <PrimaryButton onClick={() => setOutput(generateLorem(unit, Number(count) || 1))}>
            Generate
          </PrimaryButton>
        </div>
      </div>
      {output && (
        <ResultPanel>
          <p className="max-h-72 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">{output}</p>
          <div className="mt-3"><CopyButton text={output} /></div>
        </ResultPanel>
      )}
    </Card>
  );
}
