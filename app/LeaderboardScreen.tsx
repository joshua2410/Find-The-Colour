import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

type ScoreEntry = {
  id: number;
  rone: number;
  gone: number;
  bone: number;
  rtwo: number;
  gtwo: number;
  btwo: number;
  player: string;
  score: number;
};

type OriginalEntry = {
  rone: number;
  gone: number;
  bone: number;
  rtwo: number;
  gtwo: number;
  btwo: number;
  player: string;
  score: number;
};

export default function LeaderboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    axios
      .get("https://colourleaderboard-lk72.onrender.com/api/top")
      .then((unordered) => {
        const ordered = unordered.data.list.map(
          (obj: OriginalEntry, index: number) => ({
            ...obj,
            id: index + 1,
          })
        );
        return ordered;
      })
      .then((ordered) => {
        setScores(ordered);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item, index }: { item: ScoreEntry; index: number }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{item.id}.</Text>
      <Text style={styles.name}>{item.player}</Text>
      <Text style={styles.score}>{item.score}%</Text>
      <View style={styles.colors}>
        <View
          style={[
            styles.colorBox,
            {
              backgroundColor: `rgb(${item.rone}, ${item.gone}, ${item.bone})`,
            },
          ]}
        />
        <View
          style={[
            styles.colorBox,
            {
              backgroundColor: `rgb(${item.rtwo}, ${item.gtwo}, ${item.btwo})`,
            },
          ]}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        {" "}
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Leaderboard</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rank: { width: 30, fontWeight: "bold" },
  name: { flex: 1 },
  score: { width: 60, textAlign: "right", fontWeight: "600" },
  colors: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
});
