import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

const MESSAGES = [
  "Analyzing your finances...",
  "Running growth projections...",
  "Calculating your freedom age...",
];

export default function LoadingScreen({ navigation }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageIndex = useRef(0);
  const [message, setMessage] = React.useState(MESSAGES[0]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const msgInterval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % MESSAGES.length;
      setMessage(MESSAGES[messageIndex.current]);
    }, 800);

    const timer = setTimeout(() => {
      navigation.replace("Reveal");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(msgInterval);
    };
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#0F0F1A", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <Animated.View style={[styles.spinnerOuter, { transform: [{ rotate: spin }] }]}>
        <View style={styles.spinnerArc} />
      </Animated.View>

      <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
        {message}
      </Animated.Text>

      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: spinAnim.interpolate({
                  inputRange: [i * 0.33, Math.min((i + 1) * 0.33, 1)],
                  outputRange: [0.3, 1],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "rgba(108, 99, 255, 0.15)",
    marginBottom: 40,
  },
  spinnerArc: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#6C63FF",
  },
  message: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6C63FF",
  },
});
