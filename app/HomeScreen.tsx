import React from "react";
import { Alert, Text, View, StyleSheet, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  text: {
    justifyContent: "center",
  },
});
