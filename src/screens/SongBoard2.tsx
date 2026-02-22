import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { SongItem2 } from "./SongItem2";
import { JamendoAdminPanel } from "./JamendoAdminPanel";
import { ArtistStackParamList } from "../navigation/ArtistStackNavigator";
import type { Song2 } from "../models/song2.model";

// ✅ Typed route props
type SongBoard2RouteProp = RouteProp<ArtistStackParamList, "Song2">;

export const SongBoard2: React.FC = () => {
  const route = useRoute<SongBoard2RouteProp>();
  const artistId = route.params?.artistId; 
  const artistName = route.params?.artistName || "All Artists";

  const [songs, setSongs] = useState<Song2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const loadSongs = async () => {
    setLoading(true);
    try {
      const url = `http://62.73.121.31:4000/api/songs2`;
      const res = await axios.get<Song2[]>(url);

      // FILTER OUT INVALID ITEMS
      let cleaned = res.data.filter((s) => s && typeof s === "object" && s._id);

      // 🔹 FILTER BY ARTIST LOCALLY using 'artist.id'
      if (artistId) {
        cleaned = cleaned.filter((s) => s.artist?.id === artistId);
      }

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
  }, [refreshFlag, artistId]);

  const refreshSongs = () => setRefreshFlag((n) => n + 1);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <JamendoAdminPanel onRefresh={refreshSongs} />
      <Text style={styles.header}>Songs by {artistName}</Text>

      {songs.length === 0 ? (
        <View style={styles.center}>
          <Text>No songs found</Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item, index) => String(item._id || index)}
          renderItem={({ item }) => <SongItem2 song2={item} variant="compact" />}
          contentContainerStyle={styles.container}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { marginTop: 50, alignItems: "center" },
  error: { color: "red", fontSize: 16, padding: 16, textAlign: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
});