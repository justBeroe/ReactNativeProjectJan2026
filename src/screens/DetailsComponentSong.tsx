import React from "react";
import { View, Text, Image, StyleSheet, Button, Linking } from "react-native";
import type { Song } from "../models/song.model";
import type { Song2 } from "../models/song2.model";

interface DetailsProps {
  route: {
    params: {
      song?: Song;
      song2?: Song2;
    };
  };
}

// Type guard to check if data is Song
const isSongType = (data: Song | Song2): data is Song => {
  return (data as Song).album !== undefined && typeof (data as Song).album !== "string";
};

export const DetailsComponentSong: React.FC<DetailsProps> = ({ route }) => {
  const { song, song2 } = route.params;

  if (!song && !song2) return <Text>No song data</Text>;

  const data: Song | Song2 = song || song2!;

  const title = data.title;
  const artistName = data.artist?.name || "Unknown Artist";

  // Use type guard
  let albumTitle: string;
  let cover: string | null;

  if (isSongType(data)) {
    // Song: album is object
    albumTitle = data.album?.title || "Unknown Album";
    cover = data.album?.cover || data.artist?.picture || null;
  } else {
    // Song2: album is string
    albumTitle = data.album || "Unknown Album";
    cover = data.artist?.picture || null;
  }

  const preview = data.preview;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text>Artist: {artistName}</Text>
      <Text>Album: {albumTitle}</Text>
      {cover && <Image source={{ uri: cover }} style={styles.cover} />}
      {preview && (
        <Button title="Play Preview" onPress={() => Linking.openURL(preview)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  cover: { width: 150, height: 150, marginVertical: 10 },
});