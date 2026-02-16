import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import type { Song2 } from "../models/song2.model";
import { SongItem2 } from "./SongItem2";
import { JamendoAdminPanel } from "./JamendoAdminPanel";

export const SongBoard2: React.FC = () => {
  const [songs, setSongs] = useState<Song2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const loadSongs = async () => {
    try {
      const res = await axios.get<Song2[]>(
        "http://62.73.121.31:4000/api/songs2"
      );

      // ⭐ FILTER OUT INVALID ITEMS
      const cleaned = res.data.filter(
        (s) => s && typeof s === "object" && s._id
      );

      setSongs(cleaned);
      setError(null);
    } catch (err) {
      console.error("Error loading songs", err);
      setError("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, [refreshFlag]);

  const refreshSongs = () => {
    setLoading(true);
    setRefreshFlag((n) => n + 1);
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  // ⭐ HANDLE EMPTY LIST SAFELY
  if (songs.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <JamendoAdminPanel onRefresh={refreshSongs} />
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No songs available
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <JamendoAdminPanel onRefresh={refreshSongs} />

      <FlatList
        data={songs}
        keyExtractor={(item, index) => String(item._id || index)} // ⭐ SAFE KEY
        renderItem={({ item }) => <SongItem2 song2={item} variant="compact" />}
        contentContainerStyle={styles.container}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  error: {
    color: "red",
    padding: 16,
  },
});
