import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useCalculator } from "../context/CalculatorContext";
import StepLayout from "../components/StepLayout";
import SliderControl from "../components/SliderControl";

type Props = NativeStackScreenProps<RootStackParamList, "Step1">;

export default function Step1Screen({ navigation }: Props) {
  const { state, setMonthlyIncome } = useCalculator();

  const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;

  return (
    <StepLayout
      step={1}
      totalSteps={4}
      title="Monthly Take-Home"
      subtitle="How much money hits your bank account each month after taxes?"
      onNext={() => navigation.navigate("Step2")}
    >
      <SliderControl
        value={state.monthlyIncome}
        min={1000}
        max={20000}
        step={500}
        formatLabel={fmt}
        onValueChange={setMonthlyIncome}
      />
    </StepLayout>
  );
}
