import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useCalculator } from "../context/CalculatorContext";
import {
  calculateFreedomAge,
  calculateNestEgg,
  calculateYearsToFreedom,
  calculateTotalContributions,
  calculateInvestmentGrowth,
  formatAge,
  formatCurrency,
  getAgeColor,
} from "../utils/calculations";

type Props = NativeStackScreenProps<RootStackParamList, "Reveal">;

const { width } = Dimensions.get("window");

export default function RevealScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { state } = useCalculator();
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  const [tickSeconds, setTickSeconds] = useState(0);

  const freedomAge = calculateFreedomAge(
    state.currentAge,
    state.totalSavings,
    state.monthlySavings,
    state.freedomIncome
  );
  const nestEgg = calculateNestEgg(state.freedomIncome);
  const yearsToFreedom = calculateYearsToFreedom(state.currentAge, freedomAge);
  const totalContributions = calculateTotalContributions(
    state.monthlySavings,
    yearsToFreedom
  );
  const investmentGrowth = calculateInvestmentGrowth(
    state.totalSavings,
    state.monthlySavings,
    nestEgg,
    totalContributions
  );
  const ageColor = getAgeColor(freedomAge, state.currentAge);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const ticker = setInterval(() => {
      setTickSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  const savingsRate =
    state.monthlyIncome > 0
      ? ((state.monthlySavings / state.monthlyIncome) * 100).toFixed(0)
      : "0";

  const tickingDollars = (state.monthlySavings / 30 / 24 / 3600) * tickSeconds;

  const stats = [
    { label: "Nest Egg Needed", value: formatCurrency(nestEgg) },
    { label: "Years to Freedom", value: freedomAge >= 999 ? "∞" : yearsToFreedom.toFixed(1) },
    { label: "Savings Rate", value: `${savingsRate}%` },
    { label: "Investment Growth", value: formatCurrency(investmentGrowth) },
  ];

  return (
    <LinearGradient
      colors={["#0F0F1A", "#1A1A2E", "#16213E"]}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
    >
      {/* Header */}
      <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
        <Text style={styles.heroLabel}>YOUR FREEDOM AGE</Text>

        <Animated.Text
          style={[
            styles.heroAge,
            {
              color: ageColor,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {formatAge(freedomAge)}
        </Animated.Text>

        <Text style={styles.tickingSubtitle}>
          Since opening this screen, you've earned{" "}
          <Text style={{ color: "#6C63FF", fontWeight: "700" }}>
            ${tickingDollars.toFixed(4)}
          </Text>{" "}
          toward freedom
        </Text>
      </Animated.View>

      {/* Stat cards */}
      <Animated.View style={[styles.cardsGrid, { opacity: cardFade }]}>
        {stats.map((s, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardValue}>{s.value}</Text>
            <Text style={styles.cardLabel}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* CTA */}
      <View style={[styles.ctaSection, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate("Paywall")}
        >
          <LinearGradient
            colors={["#6C63FF", "#4F46E5"]}
            style={styles.ctaBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaBtnText}>Unlock Your Full Plan</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recalcBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.recalcText}>Recalculate</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 24,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 8,
  },
  heroAge: {
    fontSize: 96,
    fontWeight: "900",
    marginBottom: 16,
  },
  tickingSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 32,
    justifyContent: "center",
  },
  card: {
    width: (width - 52) / 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ctaSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 28,
  },
  ctaBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  ctaBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  recalcBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  recalcText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
});
