import React, { createContext, useContext, useState, ReactNode } from "react";

interface CalculatorState {
  monthlyIncome: number;
  monthlySavings: number;
  currentAge: number;
  totalSavings: number;
  freedomIncome: number;
}

interface CalculatorContextType {
  state: CalculatorState;
  setMonthlyIncome: (v: number) => void;
  setMonthlySavings: (v: number) => void;
  setCurrentAge: (v: number) => void;
  setTotalSavings: (v: number) => void;
  setFreedomIncome: (v: number) => void;
  reset: () => void;
}

const defaults: CalculatorState = {
  monthlyIncome: 5000,
  monthlySavings: 1000,
  currentAge: 30,
  totalSavings: 50000,
  freedomIncome: 5000,
};

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalculatorState>(defaults);

  const value: CalculatorContextType = {
    state,
    setMonthlyIncome: (v) => setState((s) => ({ ...s, monthlyIncome: v })),
    setMonthlySavings: (v) => setState((s) => ({ ...s, monthlySavings: v })),
    setCurrentAge: (v) => setState((s) => ({ ...s, currentAge: v })),
    setTotalSavings: (v) => setState((s) => ({ ...s, totalSavings: v })),
    setFreedomIncome: (v) => setState((s) => ({ ...s, freedomIncome: v })),
    reset: () => setState(defaults),
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator(): CalculatorContextType {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
}
