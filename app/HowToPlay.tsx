import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HowToPlay({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>How to play</Text>
      <Text style={styles.body}>
        Once you start the game your phone will ask your permission to use the
        camera, once granted the game will begin. The aim of the game is to find
        a target colour in your surroundings. The target colour will be shown in
        the bottom left box and the center circle. Once guessed the game will
        show you a percentage score. When the game has ended you have the option
        to save your score to the leaderboard by simply putting in your name and
        submitting it. Have fun and try to top the leaderboard
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.button}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "Typo",
    fontSize: 24,
    textAlign: "center",
  },
  body: {
    fontFamily: "Typo",
    fontSize: 16,
  },
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    fontFamily: "Typo",
    fontSize: 24,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 40,
  },
});
