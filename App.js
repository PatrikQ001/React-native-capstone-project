import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <Text style={styles.splashText}>Loading...</Text>
  </View>
);

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const status = await AsyncStorage.getItem("onboardingComplete");
      setIsOnboardingComplete(status === "true");
    };
    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete === null) {
    return <SplashScreen />;
  }

  return (
<NavigationContainer>
      <Stack.Navigator
        initialRouteName={isOnboardingComplete ? "Profile" : "Onboarding"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding">
          {(props) => (
            <Onboarding {...props} onComplete={handleOnboardingComplete} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashText: {
    fontSize: 24,
    color: "#333",
  },
});
