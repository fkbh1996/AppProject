import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useCalculator } from "../context/CalculatorContext";
import StepLayout from "../components/StepLayout";
import SliderControl from "../components/SliderControl";

type Props = NativeStackScreenProps<RootStackParamList, "Step3">;

export default function Step3Screen({ navigation }: Props) {
  const { state, setCurrentAge, setTotalSavings } = useCalculator();

  const fmtAge = (v: number) => `${v}`;
  const fmtMoney = (v: number) =>
    v >= 1000000
      ? `$${(v / 1000000).toFixed(1)}M`
      : v >= 1000
      ? `$${(v / 1000).toFixed(0)}K`
      : `$${v}`;

  return (
    <StepLayout
      step={3}
      totalSteps={4}
      title="Where You Stand"
      subtitle="Your current age and how much you've saved so far."
      onNext={() => navigation.navigate("Step4")}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.section}>
        <Text style={styles.label}>Current Age</Text>
        <SliderControl
          value={state.currentAge}
          min={18}
          max={70}
          step={1}
          formatLabel={fmtAge}
          onValueChange={setCurrentAge}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Total Savings</Text>
        <SliderControl
          value={state.totalSavings}
          min={0}
          max={2000000}
          step={5000}
          formatLabel={fmtMoney}
          onValueChange={setTotalSavings}
        />
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: -8,
  },
});
