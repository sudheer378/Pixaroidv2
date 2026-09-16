/** Pure logic for generator and developer tools. Unit-testable where deterministic. */

// ---------- Password ----------

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
} as const;

export function generatePassword(options: PasswordOptions, randomValues?: (length: number) => Uint32Array): string {
  const pools: string[] = [];
  if (options.uppercase) pools.push(CHAR_SETS.uppercase);
  if (options.lowercase) pools.push(CHAR_SETS.lowercase);
  if (options.numbers) pools.push(CHAR_SETS.numbers);
  if (options.symbols) pools.push(CHAR_SETS.symbols);
  if (pools.length === 0) throw new Error("Select at least one character type.");

  const length = Math.max(4, Math.min(options.length, 128));
  const alphabet = pools.join("");

  const getRandom = randomValues ?? ((count: number) => {
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    return array;
  });

  // Guarantee at least one character from each selected pool.
  const values = getRandom(length);
  const chars: string[] = [];
  for (let i = 0; i < length; i += 1) {
    if (i < pools.length) {
      chars.push(pools[i][values[i] % pools[i].length]);
    } else {
      chars.push(alphabet[values[i] % alphabet.length]);
    }
  }

  // Shuffle (Fisher-Yates) so guaranteed characters aren't predictable.
  const shuffleValues = getRandom(length);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = shuffleValues[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

export function passwordEntropyBits(options: PasswordOptions): number {
  let poolSize = 0;
  if (options.uppercase) poolSize += CHAR_SETS.uppercase.length;
  if (options.lowercase) poolSize += CHAR_SETS.lowercase.length;
  if (options.numbers) poolSize += CHAR_SETS.numbers.length;
  if (options.symbols) poolSize += CHAR_SETS.symbols.length;
  if (poolSize === 0) return 0;
  return Math.round(options.length * Math.log2(poolSize));
}

// ---------- Random numbers ----------

export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  unique: boolean,
  randomValue: () => number = secureRandom,
): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error("Enter valid numbers.");
  if (min > max) throw new Error("Minimum must be less than or equal to maximum.");
  const rangeSize = max - min + 1;
  const clampedCount = Math.max(1, Math.min(count, 1000));
  if (unique && clampedCount > rangeSize) {
    throw new Error(`Cannot draw ${clampedCount} unique numbers from a range of ${rangeSize}.`);
  }

  if (unique) {
    const pool = Array.from({ length: rangeSize }, (_, index) => min + index);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(randomValue() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, clampedCount);
  }

  return Array.from({ length: clampedCount }, () => min + Math.floor(randomValue() * rangeSize));
}

function secureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / 2 ** 32;
}

// ---------- UUID ----------

export function generateUuids(count: number): string[] {
  const clamped = Math.max(1, Math.min(count, 500));
  return Array.from({ length: clamped }, () => crypto.randomUUID());
}

// ---------- Base64 ----------

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function decodeBase64(base64: string): string {
  const cleaned = base64.replace(/\s+/g, "");
  let binary: string;
  try {
    binary = atob(cleaned);
  } catch {
    throw new Error("This is not valid Base64. Check for missing characters or padding.");
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Decoded data is not valid UTF-8 text (it may be binary data).");
  }
}

// ---------- JSON ----------

export interface JsonFormatResult {
  ok: boolean;
  output: string;
  error?: string;
}

export function formatJson(input: string, indent: number | "minify"): JsonFormatResult {
  try {
    const parsed = JSON.parse(input);
    const output = indent === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    return { ok: true, output };
  } catch (cause) {
    return {
      ok: false,
      output: "",
      error: cause instanceof Error ? cause.message : "Invalid JSON.",
    };
  }
}

// ---------- Hashing ----------

export async function hashText(text: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- Color ----------

export interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  rgbString: string;
  hslString: string;
}

export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace(/^#/, "");
  const expanded = cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function colorFromHex(hex: string): ColorFormats | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const normalizedHex = "#" + [rgb.r, rgb.g, rgb.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return {
    hex: normalizedHex,
    rgb,
    hsl,
    rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}

// ---------- Time zones ----------

export const worldCities = [
  { id: "Pacific/Auckland", label: "Auckland" },
  { id: "Australia/Sydney", label: "Sydney" },
  { id: "Australia/Perth", label: "Perth" },
  { id: "Asia/Tokyo", label: "Tokyo" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Asia/Kolkata", label: "Mumbai / Delhi" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Europe/Moscow", label: "Moscow" },
  { id: "Europe/Athens", label: "Athens" },
  { id: "Europe/Berlin", label: "Berlin" },
  { id: "Europe/Paris", label: "Paris" },
  { id: "Europe/Amsterdam", label: "Amsterdam" },
  { id: "Europe/Madrid", label: "Madrid" },
  { id: "Europe/Rome", label: "Rome" },
  { id: "Europe/London", label: "London" },
  { id: "America/Sao_Paulo", label: "São Paulo" },
  { id: "America/New_York", label: "New York" },
  { id: "America/Toronto", label: "Toronto" },
  { id: "America/Chicago", label: "Chicago" },
  { id: "America/Denver", label: "Denver" },
  { id: "America/Los_Angeles", label: "Los Angeles" },
  { id: "Pacific/Honolulu", label: "Honolulu" },
] as const;

/**
 * Convert a wall-clock time in `fromZone` to the equivalent wall-clock time in `toZone`.
 * Uses the Intl API, so DST rules are applied per the IANA database.
 */
export function convertZonedTime(
  dateISO: string,
  timeHHMM: string,
  fromZone: string,
  toZone: string,
): { date: string; time: string; dayLabel: string } {
  const [year, month, day] = dateISO.split("-").map(Number);
  const [hours, minutes] = timeHHMM.split(":").map(Number);

  // Find the UTC instant whose wall-clock in fromZone matches the requested time.
  let utc = Date.UTC(year, month - 1, day, hours, minutes);
  for (let i = 0; i < 3; i += 1) {
    const parts = wallClockInZone(new Date(utc), fromZone);
    const desired = Date.UTC(year, month - 1, day, hours, minutes);
    const actual = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const diff = desired - actual;
    if (diff === 0) break;
    utc += diff;
  }

  const target = wallClockInZone(new Date(utc), toZone);
  const source = wallClockInZone(new Date(utc), fromZone);

  const sourceUTC = Date.UTC(source.year, source.month - 1, source.day);
  const targetUTC = Date.UTC(target.year, target.month - 1, target.day);
  const dayDiff = Math.round((targetUTC - sourceUTC) / (24 * 60 * 60 * 1000));
  const dayLabel = dayDiff === 0 ? "same day" : dayDiff > 0 ? "next day" : "previous day";

  return {
    date: `${target.year}-${String(target.month).padStart(2, "0")}-${String(target.day).padStart(2, "0")}`,
    time: `${String(target.hour).padStart(2, "0")}:${String(target.minute).padStart(2, "0")}`,
    dayLabel,
  };
}

function wallClockInZone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    minute: Number(parts.minute),
  };
}
