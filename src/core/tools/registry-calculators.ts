import type { ToolDefinition } from "./types";

export const calculatorTools: ToolDefinition[] = [
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Calculate your Body Mass Index in metric or imperial units with WHO category ranges.",
    primaryIntent: "calculate BMI",
    processingMode: "browser",
    seo: {
      title: "BMI Calculator — Check Your Body Mass Index (Metric & Imperial)",
      description:
        "Free BMI calculator for adults. Enter height and weight in metric or imperial units to get your BMI, WHO category and healthy weight range instantly.",
      h1: "BMI Calculator",
      directAnswer:
        "BMI (Body Mass Index) is your weight in kilograms divided by your height in metres squared: BMI = kg ÷ m². A BMI of 18.5-24.9 is classed as a healthy weight by the WHO; 25-29.9 is overweight and 30+ is obese.",
      howTo: [
        "Choose metric (cm/kg) or imperial (ft-in/lb) units.",
        "Enter your height and weight.",
        "Read your BMI, WHO category and healthy weight range instantly.",
      ],
      faqs: [
        {
          question: "What is a healthy BMI?",
          answer:
            "For adults, the World Health Organization defines a healthy BMI as 18.5 to 24.9. Below 18.5 is underweight, 25 to 29.9 is overweight, and 30 or above is classed as obese.",
        },
        {
          question: "How is BMI calculated?",
          answer:
            "BMI = weight (kg) ÷ height (m)². In imperial units the formula is BMI = 703 × weight (lb) ÷ height (in)². For example, 70 kg at 1.75 m gives a BMI of 22.9.",
        },
        {
          question: "Is BMI accurate for everyone?",
          answer:
            "BMI is a useful screening tool for most adults but does not distinguish muscle from fat, so athletes may score high without excess body fat, and it is not designed for children, pregnant women or the elderly. Treat it as a guide, not a diagnosis.",
        },
      ],
      keywords: ["bmi calculator", "body mass index", "bmi chart", "healthy weight calculator"],
    },
    relatedTools: ["age-calculator", "percentage-calculator", "unit-converter"],
    status: "live",
  },
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Work out an exact age in years, months and days from any date of birth.",
    primaryIntent: "calculate age from date of birth",
    processingMode: "browser",
    seo: {
      title: "Age Calculator — Exact Age in Years, Months & Days",
      description:
        "Free age calculator. Enter a date of birth to get exact age in years, months and days, plus total days lived and days until the next birthday.",
      h1: "Age Calculator",
      directAnswer:
        "To calculate age, subtract the date of birth from today's date accounting for months and days. Someone born on 15 March 2000 is, as of 16 September 2026, exactly 26 years, 6 months and 1 day old.",
      howTo: [
        "Enter the date of birth.",
        "Optionally change the 'age at' date (defaults to today).",
        "Read the exact age in years, months and days, plus fun totals.",
      ],
      faqs: [
        {
          question: "How is exact age calculated?",
          answer:
            "Exact age counts complete years first, then complete months since the last birthday, then remaining days — handling different month lengths and leap years correctly.",
        },
        {
          question: "Can I calculate age at a past or future date?",
          answer:
            "Yes. Change the 'age at' date to any date you like — useful for forms, retirement dates, school-entry cutoffs or historical records.",
        },
        {
          question: "How are leap-year birthdays handled?",
          answer:
            "If you were born on 29 February, in non-leap years your birthday is treated as 1 March for the purpose of counting complete years — the convention most jurisdictions use.",
        },
      ],
      keywords: ["age calculator", "how old am i", "date of birth calculator", "calculate age"],
    },
    relatedTools: ["date-calculator", "bmi-calculator", "percentage-calculator"],
    status: "live",
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Solve every common percentage problem: X% of Y, percent change, and 'what percent'.",
    primaryIntent: "calculate a percentage",
    processingMode: "browser",
    seo: {
      title: "Percentage Calculator — % of a Number, Change & More",
      description:
        "Free percentage calculator. Find X% of a number, what percent X is of Y, and percentage increase or decrease between two values — instantly.",
      h1: "Percentage Calculator",
      directAnswer:
        "To find X% of a number, multiply the number by X and divide by 100. For example, 15% of 80 is 80 × 15 ÷ 100 = 12. To find what percent X is of Y, divide X by Y and multiply by 100.",
      howTo: [
        "Pick the calculation type: % of a number, X is what % of Y, or % change.",
        "Enter your two values.",
        "The answer appears instantly, with the working shown.",
      ],
      faqs: [
        {
          question: "How do I calculate a percentage of a number?",
          answer:
            "Multiply the number by the percentage and divide by 100. Example: 20% of 150 = 150 × 20 ÷ 100 = 30.",
        },
        {
          question: "How do I calculate percentage increase or decrease?",
          answer:
            "Subtract the old value from the new value, divide by the old value and multiply by 100. Going from 50 to 65 is (65 − 50) ÷ 50 × 100 = a 30% increase.",
        },
        {
          question: "How do I work out a discount price?",
          answer:
            "Multiply the price by (100 − discount%) ÷ 100. A $80 item at 25% off costs 80 × 0.75 = $60.",
        },
      ],
      keywords: ["percentage calculator", "percent of a number", "percentage change", "percent off"],
    },
    relatedTools: ["tip-calculator", "loan-calculator", "unit-converter"],
    status: "live",
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    name: "Loan Repayment Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Estimate monthly repayments and total interest for any loan or mortgage.",
    primaryIntent: "calculate loan repayments",
    processingMode: "browser",
    seo: {
      title: "Loan Calculator — Monthly Repayments & Total Interest",
      description:
        "Free loan repayment calculator. Enter amount, interest rate and term to see monthly payments, total interest and total cost for any loan or mortgage.",
      h1: "Loan Repayment Calculator",
      directAnswer:
        "Monthly loan repayments are calculated with the amortization formula M = P × r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the amount borrowed, r the monthly interest rate and n the number of payments. A $250,000 loan at 6% over 30 years costs about $1,499 per month.",
      howTo: [
        "Enter the loan amount.",
        "Enter the annual interest rate and the term in years.",
        "Read the monthly repayment, total interest and total amount paid.",
      ],
      faqs: [
        {
          question: "How are monthly loan repayments calculated?",
          answer:
            "Lenders use the amortizing-loan formula, which spreads principal and interest over equal monthly payments. Early payments are mostly interest; later payments are mostly principal.",
        },
        {
          question: "How much interest will I pay in total?",
          answer:
            "Total interest = (monthly payment × number of payments) − amount borrowed. On long terms interest can exceed the principal: a 30-year loan at 7% costs roughly 1.4× the borrowed amount in interest alone.",
        },
        {
          question: "Does this work for mortgages and car loans?",
          answer:
            "Yes — the same amortization math applies to mortgages, car loans and personal loans. It doesn't model fees, offset accounts or variable-rate changes, so treat results as an estimate.",
        },
      ],
      keywords: ["loan calculator", "mortgage calculator", "repayment calculator", "loan interest"],
    },
    relatedTools: ["percentage-calculator", "tip-calculator", "date-calculator"],
    status: "live",
  },
  {
    id: "tip-calculator",
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Calculate the tip and split the bill between any number of people.",
    primaryIntent: "calculate a tip",
    processingMode: "browser",
    seo: {
      title: "Tip Calculator — Tip Amount & Split the Bill",
      description:
        "Free tip calculator. Enter the bill, choose a tip percentage and split between people to see tip amount, total and per-person cost instantly.",
      h1: "Tip Calculator",
      directAnswer:
        "To calculate a tip, multiply the bill by the tip percentage. On a $60 bill, a standard 18% tip is $10.80, making the total $70.80 — or $35.40 each between two people.",
      howTo: [
        "Enter the bill amount.",
        "Choose a tip percentage (or type a custom one).",
        "Set the number of people to split between.",
        "Read the tip, total and per-person amounts.",
      ],
      faqs: [
        {
          question: "How much should I tip in the US?",
          answer:
            "In the United States 15-20% is customary at restaurants, with 18% a common middle ground. Counter service is discretionary, and 10% is common for delivery.",
        },
        {
          question: "Do people tip in Australia, New Zealand or Europe?",
          answer:
            "Tipping is optional in Australia and New Zealand, where staff earn full wages. In much of Europe a service charge is often included; rounding up or 5-10% for great service is appreciated but not expected.",
        },
      ],
      keywords: ["tip calculator", "bill splitter", "gratuity calculator", "split the bill"],
    },
    relatedTools: ["percentage-calculator", "loan-calculator", "unit-converter"],
    status: "live",
  },
  {
    id: "date-calculator",
    slug: "date-calculator",
    name: "Date Calculator",
    category: "calculator",
    kind: "interactive",
    description: "Count the days between two dates, or add and subtract days from a date.",
    primaryIntent: "calculate days between dates",
    processingMode: "browser",
    seo: {
      title: "Date Calculator — Days Between Dates & Add/Subtract Days",
      description:
        "Free date calculator. Count days, weeks, months and years between two dates, or add and subtract days from any date. Includes weekday count.",
      h1: "Date Calculator",
      directAnswer:
        "To count days between two dates, subtract the earlier date from the later one. From 1 January 2026 to 16 September 2026 is 258 days. Pixora also shows the gap in weeks, months and business days.",
      howTo: [
        "Choose 'days between dates' or 'add/subtract days'.",
        "Enter your start date (and end date, or the number of days).",
        "Read the difference — total days, weeks, months and weekdays.",
      ],
      faqs: [
        {
          question: "How do I count days between two dates?",
          answer:
            "Enter both dates and the calculator returns the exact number of calendar days between them, along with the equivalent weeks and months, handling leap years automatically.",
        },
        {
          question: "What date is 90 days from today?",
          answer:
            "Use add/subtract mode: enter today's date and add 90 days. The result accounts for month lengths and leap years — no manual counting needed.",
        },
        {
          question: "Can I count only business days?",
          answer:
            "Yes — the result includes a weekday count that excludes Saturdays and Sundays. Public holidays vary by country and are not excluded.",
        },
      ],
      keywords: ["days between dates", "date calculator", "date difference", "add days to date"],
    },
    relatedTools: ["age-calculator", "timezone-converter", "percentage-calculator"],
    status: "live",
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    name: "Unit Converter",
    category: "calculator",
    kind: "interactive",
    description: "Convert length, weight, temperature, volume, area and speed between metric and imperial.",
    primaryIntent: "convert units",
    processingMode: "browser",
    seo: {
      title: "Unit Converter — Length, Weight, Temperature & More",
      description:
        "Free unit converter for length, weight, temperature, volume, area and speed. Convert metric to imperial and back instantly: cm to inches, kg to lbs, °C to °F.",
      h1: "Unit Converter",
      directAnswer:
        "To convert between units, pick a category (length, weight, temperature, volume, area or speed), choose your from and to units, and type a value — the conversion updates instantly. For example, 10 km = 6.214 miles and 70 kg = 154.32 lb.",
      howTo: [
        "Pick a category: length, weight, temperature, volume, area or speed.",
        "Choose the units to convert from and to.",
        "Type a value — the result updates as you type.",
      ],
      faqs: [
        {
          question: "How do I convert cm to inches?",
          answer:
            "Divide centimetres by 2.54. For example, 180 cm ÷ 2.54 = 70.87 inches (about 5 ft 10.9 in).",
        },
        {
          question: "How do I convert kg to pounds?",
          answer:
            "Multiply kilograms by 2.20462. For example, 75 kg × 2.20462 = 165.35 lb.",
        },
        {
          question: "How do I convert Celsius to Fahrenheit?",
          answer:
            "Multiply by 9/5 and add 32: °F = °C × 1.8 + 32. So 25 °C = 77 °F, and body temperature 37 °C = 98.6 °F.",
        },
      ],
      keywords: ["unit converter", "cm to inches", "kg to lbs", "celsius to fahrenheit", "metric to imperial"],
    },
    relatedTools: ["percentage-calculator", "timezone-converter", "bmi-calculator"],
    status: "live",
  },
];
