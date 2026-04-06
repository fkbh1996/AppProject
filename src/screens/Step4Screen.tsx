import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useCalculator } from "../context/CalculatorContext";
import StepLayout from "../components/StepLayout";
import SliderControl from "../components/SliderControl";

type Props = NativeStackScreenProps<RootStackParamList, "Step4">;

export default function Step4Screen({ navigation }: Props) {
  const { state, setFreedomIncome } = useCalculator();

  const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;

  return (
    <StepLayout
      step={4}
      totalSteps={4}
      title="Freedom Income"
      subtitle="How much monthly income do you need to never work again?"
      onNext={() => navigation.navigate("Loading")}
      onBack={() => navigation.goBack()}
    >
      <SliderControl
        value={state.freedomIncome}
        min={1000}
        max={20000}
        step={500}
        formatLabel={fmt}
        onValueChange={setFreedomIncome}
      />
    </StepLayout>
  );
}
