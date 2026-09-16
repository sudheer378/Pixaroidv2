/** Pure calculation logic for interactive calculator tools. Fully unit-testable. */

// ---------- BMI ----------

export type BmiCategory = "Underweight" | "Healthy weight" | "Overweight" | "Obese";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) throw new Error("Height and weight must be positive.");
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const category: BmiCategory =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obese";
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyMinKg: Math.round(18.5 * heightM * heightM * 10) / 10,
    healthyMaxKg: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function poundsToKg(pounds: number): number {
  return pounds * 0.45359237;
}

// ---------- Age ----------

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthdayInDays: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dateOnlyUTC(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonthsClamped(date: Date, months: number): Date {
  const targetMonthIndex = date.getMonth() + months;
  const targetYear = date.getFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTarget = new Date(targetYear, targetMonth + 1, 0).getDate();
  return new Date(targetYear, targetMonth, Math.min(date.getDate(), lastDayOfTarget));
}

export function calculateAge(birthDate: Date, atDate: Date): AgeResult {
  if (dateOnlyUTC(birthDate) > dateOnlyUTC(atDate)) {
    throw new Error("Date of birth must be before the target date.");
  }

  // Clamped-anniversary method: count complete months (clamping 29/30/31st
  // birthdays to shorter months), then remaining days.
  let totalMonthsElapsed =
    (atDate.getFullYear() - birthDate.getFullYear()) * 12 + (atDate.getMonth() - birthDate.getMonth());
  if (dateOnlyUTC(addMonthsClamped(birthDate, totalMonthsElapsed)) > dateOnlyUTC(atDate)) {
    totalMonthsElapsed -= 1;
  }
  const anchor = addMonthsClamped(birthDate, totalMonthsElapsed);
  const years = Math.floor(totalMonthsElapsed / 12);
  const months = totalMonthsElapsed % 12;
  const days = Math.round((dateOnlyUTC(atDate) - dateOnlyUTC(anchor)) / MS_PER_DAY);

  const totalDays = Math.round((dateOnlyUTC(atDate) - dateOnlyUTC(birthDate)) / MS_PER_DAY);

  let nextBirthday = new Date(atDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (dateOnlyUTC(nextBirthday) <= dateOnlyUTC(atDate)) {
    nextBirthday = new Date(atDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const nextBirthdayInDays = Math.round((dateOnlyUTC(nextBirthday) - dateOnlyUTC(atDate)) / MS_PER_DAY);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    nextBirthdayInDays,
  };
}

// ---------- Percentage ----------

export function percentOf(percent: number, value: number): number {
  return (value * percent) / 100;
}

export function whatPercent(part: number, whole: number): number {
  if (whole === 0) throw new Error("Cannot divide by zero.");
  return (part / whole) * 100;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) throw new Error("Cannot compute change from zero.");
  return ((to - from) / from) * 100;
}

// ---------- Loan ----------

export interface LoanResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculateLoan(principal: number, annualRatePercent: number, years: number): LoanResult {
  if (principal <= 0 || years <= 0 || annualRatePercent < 0) {
    throw new Error("Enter a positive amount and term.");
  }
  const n = Math.round(years * 12);
  const r = annualRatePercent / 100 / 12;
  const monthlyPayment = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPaid = monthlyPayment * n;
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round((totalPaid - principal) * 100) / 100,
  };
}

// ---------- Tip ----------

export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

export function calculateTip(bill: number, tipPercent: number, people: number): TipResult {
  if (bill < 0 || tipPercent < 0 || people < 1) throw new Error("Enter valid amounts.");
  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  return {
    tip: Math.round(tip * 100) / 100,
    total: Math.round(total * 100) / 100,
    perPerson: Math.round((total / people) * 100) / 100,
    tipPerPerson: Math.round((tip / people) * 100) / 100,
  };
}

// ---------- Dates ----------

export interface DateDiffResult {
  totalDays: number;
  weeks: number;
  remainderDays: number;
  months: number;
  years: number;
  weekdays: number;
}

export function daysBetween(start: Date, end: Date): DateDiffResult {
  const startUTC = dateOnlyUTC(start);
  const endUTC = dateOnlyUTC(end);
  const [a, b] = startUTC <= endUTC ? [startUTC, endUTC] : [endUTC, startUTC];
  const totalDays = Math.round((b - a) / MS_PER_DAY);

  let weekdays = 0;
  for (let t = a; t < b; t += MS_PER_DAY) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) weekdays += 1;
  }

  const age = calculateAge(new Date(a), new Date(b));

  return {
    totalDays,
    weeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
    months: age.totalMonths,
    years: age.years,
    weekdays,
  };
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ---------- Units ----------

export type UnitCategory = "length" | "weight" | "temperature" | "volume" | "area" | "speed";

interface UnitDef {
  id: string;
  label: string;
  /** Multiplier to the category base unit (linear categories only). */
  toBase: number;
}

export const unitCategories: Record<UnitCategory, { label: string; units: UnitDef[] }> = {
  length: {
    label: "Length",
    units: [
      { id: "mm", label: "Millimetres (mm)", toBase: 0.001 },
      { id: "cm", label: "Centimetres (cm)", toBase: 0.01 },
      { id: "m", label: "Metres (m)", toBase: 1 },
      { id: "km", label: "Kilometres (km)", toBase: 1000 },
      { id: "in", label: "Inches (in)", toBase: 0.0254 },
      { id: "ft", label: "Feet (ft)", toBase: 0.3048 },
      { id: "yd", label: "Yards (yd)", toBase: 0.9144 },
      { id: "mi", label: "Miles (mi)", toBase: 1609.344 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { id: "mg", label: "Milligrams (mg)", toBase: 0.000001 },
      { id: "g", label: "Grams (g)", toBase: 0.001 },
      { id: "kg", label: "Kilograms (kg)", toBase: 1 },
      { id: "t", label: "Tonnes (t)", toBase: 1000 },
      { id: "oz", label: "Ounces (oz)", toBase: 0.028349523125 },
      { id: "lb", label: "Pounds (lb)", toBase: 0.45359237 },
      { id: "st", label: "Stone (st)", toBase: 6.35029318 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius (°C)", toBase: 1 },
      { id: "f", label: "Fahrenheit (°F)", toBase: 1 },
      { id: "k", label: "Kelvin (K)", toBase: 1 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "ml", label: "Millilitres (ml)", toBase: 0.001 },
      { id: "l", label: "Litres (l)", toBase: 1 },
      { id: "floz-us", label: "US Fluid Ounces", toBase: 0.0295735295625 },
      { id: "cup-us", label: "US Cups", toBase: 0.2365882365 },
      { id: "pt-us", label: "US Pints", toBase: 0.473176473 },
      { id: "gal-us", label: "US Gallons", toBase: 3.785411784 },
      { id: "gal-uk", label: "UK Gallons", toBase: 4.54609 },
    ],
  },
  area: {
    label: "Area",
    units: [
      { id: "sqm", label: "Square metres (m²)", toBase: 1 },
      { id: "sqkm", label: "Square kilometres (km²)", toBase: 1_000_000 },
      { id: "sqft", label: "Square feet (ft²)", toBase: 0.09290304 },
      { id: "acre", label: "Acres", toBase: 4046.8564224 },
      { id: "ha", label: "Hectares (ha)", toBase: 10000 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "kmh", label: "Kilometres/hour (km/h)", toBase: 1 },
      { id: "mph", label: "Miles/hour (mph)", toBase: 1.609344 },
      { id: "ms", label: "Metres/second (m/s)", toBase: 3.6 },
      { id: "kn", label: "Knots (kn)", toBase: 1.852 },
    ],
  },
};

export function convertUnit(category: UnitCategory, fromId: string, toId: string, value: number): number {
  if (category === "temperature") {
    return convertTemperature(fromId, toId, value);
  }
  const units = unitCategories[category].units;
  const from = units.find((unit) => unit.id === fromId);
  const to = units.find((unit) => unit.id === toId);
  if (!from || !to) throw new Error("Unknown unit.");
  return (value * from.toBase) / to.toBase;
}

function convertTemperature(fromId: string, toId: string, value: number): number {
  let celsius: number;
  switch (fromId) {
    case "c": celsius = value; break;
    case "f": celsius = (value - 32) / 1.8; break;
    case "k": celsius = value - 273.15; break;
    default: throw new Error("Unknown unit.");
  }
  switch (toId) {
    case "c": return celsius;
    case "f": return celsius * 1.8 + 32;
    case "k": return celsius + 273.15;
    default: throw new Error("Unknown unit.");
  }
}
