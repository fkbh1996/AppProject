const SAFE_WITHDRAWAL_RATE = 0.04;
const ANNUAL_RETURN = 0.07;
const MONTHLY_RETURN = ANNUAL_RETURN / 12;

export function calculateNestEgg(monthlyFreedomIncome: number): number {
  return (monthlyFreedomIncome * 12) / SAFE_WITHDRAWAL_RATE;
}

export function calculateFreedomAge(
  currentAge: number,
  currentSavings: number,
  monthlySavings: number,
  monthlyFreedomIncome: number
): number {
  const targetNestEgg = calculateNestEgg(monthlyFreedomIncome);

  if (currentSavings >= targetNestEgg) {
    return currentAge;
  }

  if (monthlySavings <= 0) {
    return 999;
  }

  let balance = currentSavings;
  let months = 0;
  const maxMonths = (120 - currentAge) * 12;

  while (balance < targetNestEgg && months < maxMonths) {
    balance = balance * (1 + MONTHLY_RETURN) + monthlySavings;
    months++;
  }

  if (balance < targetNestEgg) {
    return 999;
  }

  return currentAge + months / 12;
}

export function calculateYearsToFreedom(
  currentAge: number,
  freedomAge: number
): number {
  return Math.max(0, freedomAge - currentAge);
}

export function calculateTotalContributions(
  monthlySavings: number,
  yearsToFreedom: number
): number {
  return monthlySavings * 12 * yearsToFreedom;
}

export function calculateInvestmentGrowth(
  currentSavings: number,
  monthlySavings: number,
  nestEgg: number,
  totalContributions: number
): number {
  return Math.max(0, nestEgg - currentSavings - totalContributions);
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatAge(age: number): string {
  if (age >= 999) return "Never";
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  if (months === 0) return `${years}`;
  return `${years}y ${months}m`;
}

export function getAgeColor(freedomAge: number, currentAge: number): string {
  const yearsAway = freedomAge - currentAge;
  if (freedomAge >= 999) return "#EF4444";
  if (yearsAway <= 15) return "#22C55E";
  if (yearsAway <= 30) return "#F59E0B";
  return "#EF4444";
}
