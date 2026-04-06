import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Step1Screen from "./screens/Step1Screen";
import Step2Screen from "./screens/Step2Screen";
import Step3Screen from "./screens/Step3Screen";
import Step4Screen from "./screens/Step4Screen";
import LoadingScreen from "./screens/LoadingScreen";
import RevealScreen from "./screens/RevealScreen";
import PaywallScreen from "./screens/PaywallScreen";

export type RootStackParamList = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Step4: undefined;
  Loading: undefined;
  Reveal: undefined;
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Step1"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: false,
          contentStyle: { backgroundColor: "#0F0F1A" },
        }}
      >
        <Stack.Screen name="Step1" component={Step1Screen} />
        <Stack.Screen name="Step2" component={Step2Screen} />
        <Stack.Screen name="Step3" component={Step3Screen} />
        <Stack.Screen name="Step4" component={Step4Screen} />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Reveal"
          component={RevealScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
