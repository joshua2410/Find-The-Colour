import { Alert, Pressable, Text, View, StyleSheet, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      marginHorizontal: 16,
    },
    text: {
      justifyContent: "center",
    },
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.text}>Guess The Colour</Text>
          <Button
            title="Yo Mama"
            onPress={() => Alert.alert("successful button press")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
