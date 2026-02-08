import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { ThemeItem } from "./ThemeItem";
import type { Song } from "../models/song.model";
import { useSongs } from "../core/services/useSongs";

export const ThemeBoard: React.FC = () => {
  const route = useRoute();
  const artistId = route.params?.artistId;
  const numericId = artistId ? Number(artistId) : undefined;

  const { songs: initialSongs, loading } = useSongs(numericId);
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  const handleSongUpdated = (updatedSong: Song) => {
    setSongs(prev =>
      prev.map(s => (s._id === updatedSong._id ? updatedSong : s))
    );
  };

  const handleSongDeleted = (songId: number) => {
    setSongs(prev => prev.filter(s => s._id !== songId));
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={{ color: "red" }}>{error}</Text>;

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={songs}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <ThemeItem
          song={item}
          variant="compact"
          onSongUpdated={handleSongUpdated}
          onSongDeleted={handleSongDeleted}
        />
      )}
      initialNumToRender={5}          // Render first 5 items initially
      maxToRenderPerBatch={5}         // Render 5 items per batch while scrolling
      windowSize={10}                 // Number of items outside viewport to keep mounted
      removeClippedSubviews={true}    // Unmount items outside viewport
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerText}>Songs</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>No songs found.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  empty: {
    marginTop: 50,
    alignItems: "center",
  },
});
