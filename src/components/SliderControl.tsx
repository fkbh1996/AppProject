import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  formatLabel: (v: number) => string;
  onValueChange: (v: number) => void;
}

export default function SliderControl({
  value,
  min,
  max,
  step,
  formatLabel,
  onValueChange,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.value}>{formatLabel(value)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#6C63FF"
        maximumTrackTintColor="rgba(255,255,255,0.15)"
        thumbTintColor="#A78BFA"
      />
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{formatLabel(min)}</Text>
        <Text style={styles.rangeText}>{formatLabel(max)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 32,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rangeText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
  },
});
