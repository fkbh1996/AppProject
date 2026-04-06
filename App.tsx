import React from "react";
import { StatusBar } from "expo-status-bar";
import { CalculatorProvider } from "./src/context/CalculatorContext";
import Navigation from "./src/navigation";

export default function App() {
  return (
    <CalculatorProvider>
      <StatusBar style="light" />
      <Navigation />
    </CalculatorProvider>
  );
}
