import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Alba: require("../assets/fonts/ALBAS.ttf"),
      Typo: require("../assets/fonts/Typo.otf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View onLayout={onLayoutRootView}>
          <Text style={styles.heading}>Guess The Colour</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Game")}>
            <Text style={styles.button}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
            <Text style={styles.button}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("HowToPlay")}>
            <Text style={styles.button}>How to play</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  heading: {
    fontFamily: "Alba",
    fontSize: 24,
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: 20,
  },
  button: {
    fontFamily: "Typo",
    fontSize: 24,
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: 20,
  },
});
