import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useCalculator } from "../context/CalculatorContext";
import StepLayout from "../components/StepLayout";
import SliderControl from "../components/SliderControl";

type Props = NativeStackScreenProps<RootStackParamList, "Step2">;

export default function Step2Screen({ navigation }: Props) {
  const { state, setMonthlySavings } = useCalculator();

  const fmt = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`;

  return (
    <StepLayout
      step={2}
      totalSteps={4}
      title="Monthly Savings"
      subtitle="How much can you put away toward investments each month?"
      onNext={() => navigation.navigate("Step3")}
      onBack={() => navigation.goBack()}
    >
      <SliderControl
        value={state.monthlySavings}
        min={0}
        max={5000}
        step={100}
        formatLabel={fmt}
        onValueChange={setMonthlySavings}
      />
    </StepLayout>
  );
}
