import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Props {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onNext: () => void;
  onBack?: () => void;
  children: ReactNode;
}

export default function StepLayout({
  step,
  totalSteps,
  title,
  subtitle,
  onNext,
  onBack,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#0F0F1A", "#1A1A2E", "#16213E"]}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
    >
      {/* Progress */}
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < step && styles.progressDotDone,
              i === step - 1 && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.stepLabel}>
        Step {step} of {totalSteps}
      </Text>

      {/* Content area */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </View>

      {/* Buttons */}
      <View style={[styles.buttonRow, { paddingBottom: insets.bottom + 24 }]}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <LinearGradient
            colors={["#6C63FF", "#4F46E5"]}
            style={styles.nextBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextBtnText}>
              {step === totalSteps ? "Calculate" : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  progressDotDone: {
    backgroundColor: "#6C63FF",
  },
  progressDotActive: {
    backgroundColor: "#A78BFA",
    width: 28,
    borderRadius: 5,
  },
  stepLabel: {
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    fontSize: 13,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: 28,
    gap: 12,
  },
  backBtn: {
    width: 80,
    justifyContent: "center",
  },
  backBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    textAlign: "center",
  },
  nextBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  nextBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
