import { describe, expect, it } from "vitest";
import {
  calculateAge,
  calculateBmi,
  calculateLoan,
  calculateTip,
  convertUnit,
  daysBetween,
  feetInchesToCm,
  percentChange,
  percentOf,
  poundsToKg,
  whatPercent,
} from "@/core/interactive/calculators";

describe("BMI calculator", () => {
  it("computes BMI and category", () => {
    const result = calculateBmi(175, 70);
    expect(result.bmi).toBeCloseTo(22.9, 1);
    expect(result.category).toBe("Healthy weight");
  });

  it("classifies underweight, overweight and obese", () => {
    expect(calculateBmi(175, 50).category).toBe("Underweight");
    expect(calculateBmi(175, 85).category).toBe("Overweight");
    expect(calculateBmi(175, 100).category).toBe("Obese");
  });

  it("converts imperial inputs", () => {
    expect(feetInchesToCm(5, 9)).toBeCloseTo(175.26, 1);
    expect(poundsToKg(154)).toBeCloseTo(69.85, 1);
  });

  it("rejects invalid input", () => {
    expect(() => calculateBmi(0, 70)).toThrow();
  });
});

describe("Age calculator", () => {
  it("computes exact age", () => {
    const result = calculateAge(new Date(2000, 2, 15), new Date(2026, 8, 16));
    expect(result.years).toBe(26);
    expect(result.months).toBe(6);
    expect(result.days).toBe(1);
  });

  it("handles month-end borrowing", () => {
    const result = calculateAge(new Date(2000, 0, 31), new Date(2000, 2, 1));
    expect(result.years).toBe(0);
    expect(result.months).toBe(1);
    expect(result.days).toBe(1);
  });

  it("rejects future birth dates", () => {
    expect(() => calculateAge(new Date(2030, 0, 1), new Date(2026, 0, 1))).toThrow();
  });
});

describe("Percentage calculator", () => {
  it("computes percent of a number", () => {
    expect(percentOf(15, 80)).toBe(12);
  });

  it("computes what percent", () => {
    expect(whatPercent(30, 150)).toBe(20);
    expect(() => whatPercent(1, 0)).toThrow();
  });

  it("computes percent change", () => {
    expect(percentChange(50, 65)).toBeCloseTo(30);
    expect(percentChange(100, 75)).toBeCloseTo(-25);
  });
});

describe("Loan calculator", () => {
  it("matches standard amortization", () => {
    const result = calculateLoan(250000, 6, 30);
    expect(result.monthlyPayment).toBeCloseTo(1498.88, 1);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("handles zero interest", () => {
    const result = calculateLoan(12000, 0, 1);
    expect(result.monthlyPayment).toBe(1000);
    expect(result.totalInterest).toBe(0);
  });
});

describe("Tip calculator", () => {
  it("computes tip, total and per-person amounts", () => {
    const result = calculateTip(60, 18, 2);
    expect(result.tip).toBeCloseTo(10.8);
    expect(result.total).toBeCloseTo(70.8);
    expect(result.perPerson).toBeCloseTo(35.4);
  });
});

describe("Date calculator", () => {
  it("counts days between dates", () => {
    const result = daysBetween(new Date(2026, 0, 1), new Date(2026, 8, 16));
    expect(result.totalDays).toBe(258);
  });

  it("handles leap years", () => {
    const result = daysBetween(new Date(2024, 1, 28), new Date(2024, 2, 1));
    expect(result.totalDays).toBe(2);
  });

  it("counts weekdays", () => {
    // Mon 2026-09-07 to Mon 2026-09-14 = 5 weekdays
    const result = daysBetween(new Date(2026, 8, 7), new Date(2026, 8, 14));
    expect(result.weekdays).toBe(5);
  });
});

describe("Unit converter", () => {
  it("converts length", () => {
    expect(convertUnit("length", "km", "mi", 10)).toBeCloseTo(6.2137, 3);
    expect(convertUnit("length", "cm", "in", 2.54)).toBeCloseTo(1);
  });

  it("converts weight", () => {
    expect(convertUnit("weight", "kg", "lb", 70)).toBeCloseTo(154.32, 1);
    expect(convertUnit("weight", "st", "kg", 1)).toBeCloseTo(6.35, 2);
  });

  it("converts temperature", () => {
    expect(convertUnit("temperature", "c", "f", 25)).toBeCloseTo(77);
    expect(convertUnit("temperature", "f", "c", 98.6)).toBeCloseTo(37);
    expect(convertUnit("temperature", "c", "k", 0)).toBeCloseTo(273.15);
  });

  it("throws on unknown unit", () => {
    expect(() => convertUnit("length", "nope", "m", 1)).toThrow();
  });
});
