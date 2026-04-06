import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
} from "react-native-purchases";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

const REVENUECAT_API_KEY_IOS = "appl_YOUR_IOS_KEY";
const REVENUECAT_API_KEY_ANDROID = "goog_YOUR_ANDROID_KEY";

interface PlanOption {
  id: "weekly" | "annual";
  title: string;
  price: string;
  period: string;
  badge?: string;
  pkg?: PurchasesPackage;
}

const FALLBACK_PLANS: PlanOption[] = [
  {
    id: "annual",
    title: "Annual",
    price: "$39.99",
    period: "/year",
    badge: "BEST VALUE",
  },
  {
    id: "weekly",
    title: "Weekly",
    price: "$9.99",
    period: "/week",
  },
];

export default function PaywallScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "annual">("annual");
  const [plans, setPlans] = useState<PlanOption[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(false);
  const [rcConfigured, setRcConfigured] = useState(false);

  useEffect(() => {
    initRevenueCat();
  }, []);

  async function initRevenueCat() {
    try {
      const apiKey =
        Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

      Purchases.configure({ apiKey });
      setRcConfigured(true);

      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        const pkgs = offerings.current.availablePackages;
        const mapped: PlanOption[] = [];

        for (const pkg of pkgs) {
          if (
            pkg.packageType === "WEEKLY" ||
            pkg.product.identifier.includes("weekly")
          ) {
            mapped.push({
              id: "weekly",
              title: "Weekly",
              price: pkg.product.priceString,
              period: "/week",
              pkg,
            });
          } else if (
            pkg.packageType === "ANNUAL" ||
            pkg.product.identifier.includes("annual")
          ) {
            mapped.push({
              id: "annual",
              title: "Annual",
              price: pkg.product.priceString,
              period: "/year",
              badge: "BEST VALUE",
              pkg,
            });
          }
        }

        if (mapped.length > 0) {
          setPlans(mapped);
        }
      }
    } catch {
      // RevenueCat not available (simulator etc.) - use fallback plans
    }
  }

  async function handlePurchase() {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan?.pkg) {
      Alert.alert(
        "Store Not Available",
        "In-app purchases are not available in this environment. Please try on a real device."
      );
      return;
    }

    setLoading(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        Alert.alert("Welcome!", "You've unlocked Freedom Age Pro.");
        navigation.goBack();
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error", "Purchase failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRestore() {
    setLoading(true);
    Purchases.restorePurchases()
      .then(({ entitlements }) => {
        if (Object.keys(entitlements.active).length > 0) {
          Alert.alert("Restored!", "Your subscription has been restored.");
          navigation.goBack();
        } else {
          Alert.alert("No Subscription", "No active subscription found.");
        }
      })
      .catch(() => {
        Alert.alert("Error", "Could not restore purchases.");
      })
      .finally(() => setLoading(false));
  }

  const features = [
    "Detailed freedom roadmap",
    "Custom investment strategies",
    "Monthly progress tracking",
    "Expert financial insights",
  ];

  return (
    <LinearGradient
      colors={["#0F0F1A", "#1A1A2E", "#16213E"]}
      style={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
      ]}
    >
      {/* Close */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Unlock Your{"\n"}Freedom Plan</Text>
        <Text style={styles.headerSubtitle}>
          Get a personalized roadmap to financial independence
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        {plans
          .sort((a, b) => (a.id === "annual" ? -1 : 1))
          .map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}
              <View style={styles.radioOuter}>
                {selectedPlan === plan.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>
                  {plan.price}
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Purchase button */}
      <TouchableOpacity
        style={styles.purchaseBtn}
        onPress={handlePurchase}
        disabled={loading}
      >
        <LinearGradient
          colors={["#6C63FF", "#4F46E5"]}
          style={styles.purchaseBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseBtnText}>Continue</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.footerLink}>Restore Purchases</Text>
        </TouchableOpacity>
        <Text style={styles.footerDivider}>·</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms</Text>
        </TouchableOpacity>
        <Text style={styles.footerDivider}>·</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        Payment will be charged to your Apple ID / Google Play account.
        Subscription automatically renews unless cancelled at least 24 hours
        before the end of the current period.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  features: {
    marginBottom: 28,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(108, 99, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    color: "#6C63FF",
    fontSize: 13,
    fontWeight: "700",
  },
  featureText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  planCardSelected: {
    borderColor: "#6C63FF",
    backgroundColor: "rgba(108, 99, 255, 0.08)",
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#6C63FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6C63FF",
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  planPrice: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255,255,255,0.4)",
  },
  purchaseBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  purchaseBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  purchaseBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  footerLink: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
  },
  footerDivider: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 13,
  },
  disclaimer: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
});
