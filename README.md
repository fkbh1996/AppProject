# FreedomAge - Financial Freedom Calculator

A 4-step financial calculator built with React Native + Expo that dramatically reveals your "freedom age" — the age at which you can stop working.

## Features

- **Step 1**: Monthly take-home income (slider $1K–$20K)
- **Step 2**: Monthly savings amount (slider $0–$5K)
- **Step 3**: Current age + total savings (two sliders)
- **Step 4**: Desired monthly freedom income (slider $1K–$20K)
- **Loading Screen**: Fake 2.5s loading with rotating messages
- **Reveal Screen**: Giant color-coded freedom age (green/amber/red), live ticking subtitle, 4 stat cards
- **Paywall**: Hard paywall via RevenueCat with weekly ($9.99) and annual ($39.99) plans

## Financial Math

- **Nest Egg**: Uses the 4% safe withdrawal rate (`monthly_freedom_income × 12 / 0.04`)
- **Growth**: Models 7% annual return compounded monthly to project when savings reach the nest egg target

## Getting Started

```bash
npm install
npx expo start
```

## RevenueCat Setup

1. Create a RevenueCat project at [revenuecat.com](https://www.revenuecat.com)
2. Set up weekly and annual subscription products in App Store Connect / Google Play Console
3. Replace the placeholder API keys in `src/screens/PaywallScreen.tsx`:
   - `REVENUECAT_API_KEY_IOS` — your iOS API key
   - `REVENUECAT_API_KEY_ANDROID` — your Android API key

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- React Navigation (native stack)
- expo-linear-gradient
- @react-native-community/slider
- react-native-purchases (RevenueCat)
