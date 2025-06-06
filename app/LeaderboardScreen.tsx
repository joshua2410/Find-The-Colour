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
      <Text style={styles.rank}>{item.id}</Text>
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

  const LeaderboardHeader = () => (
    <View>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.labelRow}>
        <View style={styles.labelBox}>
          <View style={[styles.legendColor, { backgroundColor: "#999" }]} />
          <Text style={styles.labelText}>Target</Text>
        </View>
        <View style={styles.labelBox}>
          <View style={[styles.legendColor, { backgroundColor: "#ccc" }]} />
          <Text style={styles.labelText}>Guessed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.labelText}>Back</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={<LeaderboardHeader />}
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
    fontFamily: "Typo",
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
  rank: { width: 30, fontFamily: "Typo" },
  name: { flex: 1, fontFamily: "Typo" },
  score: { width: 60, textAlign: "right", fontFamily: "Typo" },
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 20,
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontFamily: "Typo",
    fontSize: 14,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#666",
  },
});
