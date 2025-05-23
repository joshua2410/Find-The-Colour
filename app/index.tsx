import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "./GameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
