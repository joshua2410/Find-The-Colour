import React from "react";
import { Alert, Text, View, StyleSheet, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.text}>Guess The Colour</Text>
          <Button
            title="Start Game"
            onPress={() => navigation.navigate("Game")}
          />
          <Button
            title="Leaderboard"
            onPress={() => navigation.navigate("Leaderboard")}
          />
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
  text: {
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: 20,
    fontFamily: Platform.select({
      android: "Inter_900Black",
      ios: "Inter-Black",
    }),
  },
});
