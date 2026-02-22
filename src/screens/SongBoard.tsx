import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { SongItem } from "./SongItem";
import type { Song } from "../models/song.model";
import { useSongs } from "../core/services/useSongs";
import { ArtistStackParamList  } from "../navigation/ArtistStackNavigator";

// ✅ Typed route props
type SongBoardRouteProp = RouteProp<ArtistStackParamList, "Song">;

export const SongBoard: React.FC = () => {
  const route = useRoute<SongBoardRouteProp>();
  const artistId = route.params?.artistId;
  const artistName = route.params?.artistName || "Unknown Artist";

  // Use numericId for your useSongs hook
  const numericId = artistId ? Number(artistId) : undefined;

  const { songs: fetchedSongs, loading, error: hookError, refetch } =
    useSongs(numericId);

  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Re-run API every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      if (hookError) {
        setError("Failed to load songs. Please try again.");
        return;
      }

      if (!fetchedSongs || fetchedSongs.length === 0) {
        setError("No songs found.");
        return;
      }

      setError(null);
      setSongs(fetchedSongs);
    }, [fetchedSongs, hookError])
  );

  // 🔄 Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (e) {
      setError("Failed to refresh songs.");
    }
    setRefreshing(false);
  };

  const handleSongUpdated = (updatedSong: Song) => {
    setSongs((prev) =>
      prev.map((s) => (s._id === updatedSong._id ? updatedSong : s))
    );
  };

  const handleSongDeleted = (songId: number) => {
    setSongs((prev) => prev.filter((s) => s._id !== songId));
  };

  if (loading && !refreshing)
    return <ActivityIndicator size="large" color="#000" />;

  if (error)
    return (
      <View style={styles.empty}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Artist Name Header */}
      <Text style={styles.artistHeader}>Songs by {artistName}</Text>

      <FlatList
        contentContainerStyle={styles.container}
        data={songs}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <SongItem
            song={item}
            variant="compact"
            onSongUpdated={handleSongUpdated}
            onSongDeleted={handleSongDeleted}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No songs found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  empty: {
    marginTop: 50,
    alignItems: "center",
  },
  artistHeader: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
});