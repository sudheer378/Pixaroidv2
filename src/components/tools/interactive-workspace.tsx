"use client";

import type { ToolDefinition } from "@/core/tools/types";
import {
  AgeCalculator,
  BmiCalculator,
  DateCalculator,
  LoanCalculator,
  PercentageCalculator,
  TipCalculator,
  UnitConverter,
} from "./interactive/calculators";
import {
  CaseConverter,
  CharacterCounter,
  LoremIpsumGenerator,
  WordCounter,
} from "./interactive/text-tools";
import {
  PasswordGenerator,
  QrCodeGenerator,
  RandomNumberGenerator,
  UuidGenerator,
} from "./interactive/generators";
import {
  Base64Tool,
  ColorConverter,
  HashGenerator,
  JsonFormatter,
  TimezoneConverter,
} from "./interactive/developer-tools";

const widgets: Record<string, React.ComponentType> = {
  "bmi-calculator": BmiCalculator,
  "age-calculator": AgeCalculator,
  "percentage-calculator": PercentageCalculator,
  "loan-calculator": LoanCalculator,
  "tip-calculator": TipCalculator,
  "date-calculator": DateCalculator,
  "unit-converter": UnitConverter,
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "qr-code-generator": QrCodeGenerator,
  "password-generator": PasswordGenerator,
  "random-number-generator": RandomNumberGenerator,
  "uuid-generator": UuidGenerator,
  "json-formatter": JsonFormatter,
  "base64-encode-decode": Base64Tool,
  "hash-generator": HashGenerator,
  "color-converter": ColorConverter,
  "timezone-converter": TimezoneConverter,
};

export function InteractiveWorkspace({ tool }: { tool: ToolDefinition }) {
  // Keyed on slug, matching getDefaultProcessor, so both lookup tables agree.
  const Widget = widgets[tool.slug];
  if (!Widget) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        This tool is coming soon.
      </div>
    );
  }
  return <Widget />;
}
