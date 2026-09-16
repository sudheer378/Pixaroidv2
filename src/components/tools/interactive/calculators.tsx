"use client";

import { useMemo, useState } from "react";
import {
  addDays,
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
  unitCategories,
  whatPercent,
  type UnitCategory,
} from "@/core/interactive/calculators";
import {
  BigNumber,
  Card,
  ErrorText,
  Field,
  inputClass,
  ResultPanel,
  selectClass,
  StatGrid,
  ToggleChip,
} from "./ui";

// ---------- BMI ----------

export function BmiCalculator() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [pounds, setPounds] = useState("154");

  const result = useMemo(() => {
    try {
      const cm = units === "metric" ? Number(heightCm) : feetInchesToCm(Number(feet) || 0, Number(inches) || 0);
      const kg = units === "metric" ? Number(weightKg) : poundsToKg(Number(pounds) || 0);
      if (!cm || !kg || cm <= 0 || kg <= 0) return null;
      return calculateBmi(cm, kg);
    } catch {
      return null;
    }
  }, [units, heightCm, weightKg, feet, inches, pounds]);

  const categoryColor =
    result?.category === "Healthy weight" ? "text-emerald-600" :
    result?.category === "Underweight" ? "text-amber-600" :
    result ? "text-rose-600" : "";

  return (
    <Card>
      <div className="flex gap-2">
        <ToggleChip active={units === "metric"} onClick={() => setUnits("metric")}>Metric (cm, kg)</ToggleChip>
        <ToggleChip active={units === "imperial"} onClick={() => setUnits("imperial")}>Imperial (ft, lb)</ToggleChip>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {units === "metric" ? (
          <>
            <Field label="Height (cm)">
              <input type="number" inputMode="decimal" className={inputClass} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} min={50} max={272} />
            </Field>
            <Field label="Weight (kg)">
              <input type="number" inputMode="decimal" className={inputClass} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} min={10} max={500} />
            </Field>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (ft)">
                <input type="number" inputMode="numeric" className={inputClass} value={feet} onChange={(e) => setFeet(e.target.value)} min={1} max={8} />
              </Field>
              <Field label="(in)">
                <input type="number" inputMode="numeric" className={inputClass} value={inches} onChange={(e) => setInches(e.target.value)} min={0} max={11} />
              </Field>
            </div>
            <Field label="Weight (lb)">
              <input type="number" inputMode="decimal" className={inputClass} value={pounds} onChange={(e) => setPounds(e.target.value)} min={20} max={1100} />
            </Field>
          </>
        )}
      </div>

      {result && (
        <ResultPanel>
          <div className="flex items-end justify-between gap-4">
            <BigNumber value={result.bmi.toFixed(1)} label="Your BMI" />
            <p className={`text-lg font-bold ${categoryColor}`}>{result.category}</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 via-30% to-rose-500">
            <div
              className="relative h-full"
              style={{ marginLeft: `${Math.min(97, Math.max(0, ((result.bmi - 14) / (40 - 14)) * 100))}%` }}
            >
              <div className="h-full w-1.5 rounded bg-slate-900" />
            </div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>14</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Healthy weight range for your height: <strong>{result.healthyMinKg}–{result.healthyMaxKg} kg</strong>
            {units === "imperial" && <> ({Math.round(result.healthyMinKg / 0.45359237)}–{Math.round(result.healthyMaxKg / 0.45359237)} lb)</>}
          </p>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Age ----------

function toDateInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function AgeCalculator() {
  const [birth, setBirth] = useState("2000-01-01");
  const [at, setAt] = useState(toDateInput(new Date()));

  const { result, error } = useMemo(() => {
    const birthDate = parseDateInput(birth);
    const atDate = parseDateInput(at);
    if (!birthDate || !atDate) return { result: null, error: null };
    try {
      return { result: calculateAge(birthDate, atDate), error: null };
    } catch (cause) {
      return { result: null, error: cause instanceof Error ? cause.message : "Invalid dates." };
    }
  }, [birth, at]);

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth">
          <input type="date" className={inputClass} value={birth} max={toDateInput(new Date())} onChange={(e) => setBirth(e.target.value)} />
        </Field>
        <Field label="Age at date">
          <input type="date" className={inputClass} value={at} onChange={(e) => setAt(e.target.value)} />
        </Field>
      </div>
      <ErrorText message={error} />
      {result && (
        <ResultPanel>
          <BigNumber
            value={`${result.years} years, ${result.months} months, ${result.days} days`}
            label="Exact age"
          />
          <StatGrid
            items={[
              { value: result.totalMonths.toLocaleString(), label: "Total months" },
              { value: result.totalWeeks.toLocaleString(), label: "Total weeks" },
              { value: result.totalDays.toLocaleString(), label: "Total days" },
              { value: `${result.nextBirthdayInDays} days`, label: "Until next birthday" },
            ]}
          />
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Percentage ----------

type PercentMode = "of" | "what" | "change";

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentMode>("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("80");

  const numA = Number(a);
  const numB = Number(b);
  const valid = a !== "" && b !== "" && Number.isFinite(numA) && Number.isFinite(numB);

  let answer: string | null = null;
  let working = "";
  try {
    if (valid && mode === "of") {
      const result = percentOf(numA, numB);
      answer = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
      working = `${numB} × ${numA} ÷ 100 = ${answer}`;
    } else if (valid && mode === "what") {
      const result = whatPercent(numA, numB);
      answer = `${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
      working = `${numA} ÷ ${numB} × 100 = ${answer}`;
    } else if (valid && mode === "change") {
      const result = percentChange(numA, numB);
      answer = `${result >= 0 ? "+" : ""}${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
      working = `(${numB} − ${numA}) ÷ ${numA} × 100 = ${answer}`;
    }
  } catch {
    answer = null;
  }

  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        <ToggleChip active={mode === "of"} onClick={() => setMode("of")}>X% of Y</ToggleChip>
        <ToggleChip active={mode === "what"} onClick={() => setMode("what")}>X is what % of Y</ToggleChip>
        <ToggleChip active={mode === "change"} onClick={() => setMode("change")}>% change</ToggleChip>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Field label={mode === "of" ? "Percentage (%)" : mode === "what" ? "Value X" : "From value"}>
          <input type="number" inputMode="decimal" className={inputClass} value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label={mode === "of" ? "Of number" : mode === "what" ? "Of value Y" : "To value"}>
          <input type="number" inputMode="decimal" className={inputClass} value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
      </div>
      {answer !== null && (
        <ResultPanel>
          <BigNumber value={answer} label="Result" />
          <p className="mt-2 font-mono text-sm text-slate-500">{working}</p>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Loan ----------

export function LoanCalculator() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    try {
      const principal = Number(amount);
      const annualRate = Number(rate);
      const term = Number(years);
      if (!principal || !term || principal <= 0 || term <= 0 || annualRate < 0) return null;
      return calculateLoan(principal, annualRate, term);
    } catch {
      return null;
    }
  }, [amount, rate, years]);

  const currency = (value: number) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount">
          <input type="number" inputMode="decimal" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} min={1} />
        </Field>
        <Field label="Interest rate (% p.a.)">
          <input type="number" inputMode="decimal" step="0.1" className={inputClass} value={rate} onChange={(e) => setRate(e.target.value)} min={0} max={50} />
        </Field>
        <Field label="Term (years)">
          <input type="number" inputMode="numeric" className={inputClass} value={years} onChange={(e) => setYears(e.target.value)} min={1} max={50} />
        </Field>
      </div>
      {result && (
        <ResultPanel>
          <BigNumber value={currency(result.monthlyPayment)} label="Monthly repayment" />
          <StatGrid
            items={[
              { value: currency(result.totalPaid), label: "Total paid" },
              { value: currency(result.totalInterest), label: "Total interest" },
              { value: `${Math.round((result.totalInterest / Number(amount)) * 100)}%`, label: "Interest vs principal" },
            ]}
          />
          <p className="mt-3 text-xs text-slate-500">Estimate only — excludes fees, insurance and rate changes.</p>
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Tip ----------

export function TipCalculator() {
  const [bill, setBill] = useState("60");
  const [tipPercent, setTipPercent] = useState(18);
  const [custom, setCustom] = useState("");
  const [people, setPeople] = useState("2");

  const effectiveTip = custom !== "" ? Number(custom) : tipPercent;
  const result = useMemo(() => {
    try {
      const amount = Number(bill);
      const heads = Math.max(1, Math.floor(Number(people) || 1));
      if (!amount || amount < 0 || !Number.isFinite(effectiveTip) || effectiveTip < 0) return null;
      return calculateTip(amount, effectiveTip, heads);
    } catch {
      return null;
    }
  }, [bill, effectiveTip, people]);

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bill amount">
          <input type="number" inputMode="decimal" className={inputClass} value={bill} onChange={(e) => setBill(e.target.value)} min={0} />
        </Field>
        <Field label="Split between (people)">
          <input type="number" inputMode="numeric" className={inputClass} value={people} onChange={(e) => setPeople(e.target.value)} min={1} max={100} />
        </Field>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">Tip percentage</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {[10, 15, 18, 20, 25].map((percent) => (
          <ToggleChip
            key={percent}
            active={custom === "" && tipPercent === percent}
            onClick={() => { setTipPercent(percent); setCustom(""); }}
          >
            {percent}%
          </ToggleChip>
        ))}
        <input
          type="number"
          inputMode="decimal"
          placeholder="Custom %"
          className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          min={0}
          max={100}
        />
      </div>
      {result && (
        <ResultPanel>
          <div className="grid grid-cols-2 gap-4">
            <BigNumber value={result.total.toFixed(2)} label="Total with tip" />
            <BigNumber value={result.perPerson.toFixed(2)} label="Per person" />
          </div>
          <StatGrid
            items={[
              { value: result.tip.toFixed(2), label: `Tip (${effectiveTip}%)` },
              { value: result.tipPerPerson.toFixed(2), label: "Tip per person" },
            ]}
          />
        </ResultPanel>
      )}
    </Card>
  );
}

// ---------- Date calculator ----------

export function DateCalculator() {
  const [mode, setMode] = useState<"between" | "add">("between");
  const [start, setStart] = useState(toDateInput(new Date()));
  const [end, setEnd] = useState(toDateInput(addDays(new Date(), 30)));
  const [amount, setAmount] = useState("90");
  const [direction, setDirection] = useState<"add" | "subtract">("add");

  const between = useMemo(() => {
    if (mode !== "between") return null;
    const startDate = parseDateInput(start);
    const endDate = parseDateInput(end);
    if (!startDate || !endDate) return null;
    return daysBetween(startDate, endDate);
  }, [mode, start, end]);

  const shifted = useMemo(() => {
    if (mode !== "add") return null;
    const startDate = parseDateInput(start);
    const days = Number(amount);
    if (!startDate || !Number.isFinite(days)) return null;
    return addDays(startDate, direction === "add" ? days : -days);
  }, [mode, start, amount, direction]);

  return (
    <Card>
      <div className="flex gap-2">
        <ToggleChip active={mode === "between"} onClick={() => setMode("between")}>Days between dates</ToggleChip>
        <ToggleChip active={mode === "add"} onClick={() => setMode("add")}>Add / subtract days</ToggleChip>
      </div>

      {mode === "between" ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <input type="date" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="End date">
              <input type="date" className={inputClass} value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
          {between && (
            <ResultPanel>
              <BigNumber value={`${between.totalDays.toLocaleString()} days`} label="Between the two dates" />
              <StatGrid
                items={[
                  { value: `${between.weeks} wk ${between.remainderDays} d`, label: "In weeks" },
                  { value: `${between.months}`, label: "Whole months" },
                  { value: `${between.weekdays}`, label: "Weekdays (Mon–Fri)" },
                ]}
              />
            </ResultPanel>
          )}
        </>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Start date">
              <input type="date" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="Operation">
              <select className={selectClass} value={direction} onChange={(e) => setDirection(e.target.value as "add" | "subtract")}>
                <option value="add">Add days</option>
                <option value="subtract">Subtract days</option>
              </select>
            </Field>
            <Field label="Number of days">
              <input type="number" inputMode="numeric" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} min={0} max={100000} />
            </Field>
          </div>
          {shifted && (
            <ResultPanel>
              <BigNumber
                value={shifted.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                label={`${direction === "add" ? "Adding" : "Subtracting"} ${amount || 0} days`}
              />
            </ResultPanel>
          )}
        </>
      )}
    </Card>
  );
}

// ---------- Unit converter ----------

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("in");
  const [value, setValue] = useState("100");

  const units = unitCategories[category].units;

  function switchCategory(next: UnitCategory) {
    setCategory(next);
    const nextUnits = unitCategories[next].units;
    setFromUnit(nextUnits[0].id);
    setToUnit(nextUnits[1]?.id ?? nextUnits[0].id);
  }

  const result = useMemo(() => {
    const num = Number(value);
    if (value === "" || !Number.isFinite(num)) return null;
    try {
      return convertUnit(category, fromUnit, toUnit, num);
    } catch {
      return null;
    }
  }, [category, fromUnit, toUnit, value]);

  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(unitCategories) as UnitCategory[]).map((id) => (
          <ToggleChip key={id} active={category === id} onClick={() => switchCategory(id)}>
            {unitCategories[id].label}
          </ToggleChip>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Value">
          <input type="number" inputMode="decimal" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="From">
          <select className={selectClass} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
          </select>
        </Field>
        <Field label="To">
          <select className={selectClass} value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
          </select>
        </Field>
      </div>
      {result !== null && (
        <ResultPanel>
          <BigNumber
            value={result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            label={units.find((unit) => unit.id === toUnit)?.label ?? ""}
          />
        </ResultPanel>
      )}
    </Card>
  );
}
