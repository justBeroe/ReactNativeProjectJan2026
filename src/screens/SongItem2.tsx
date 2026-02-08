import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import type { Song2 } from "../models/song2.model";

interface SongItem2Props {
  song2: Song2;
  variant?: "compact" | "full";
}

export const SongItem2: React.FC<SongItem2Props> = ({ song2 }) => {
  const openPreview = () => {
    if (song2.preview) Linking.openURL(song2.preview);
  };

  const openArtistLink = () => {
    if (song2.artist.name) Linking.openURL(song2.artist.name);
  };

  return (
    <View style={styles.card}>
      {/* LEFT: Album Cover */}
      <TouchableOpacity onPress={openArtistLink}>
        <Image
          source={{ uri: song2.artist.picture }}
          style={styles.cover}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* RIGHT: Song Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{song2.title}</Text>

        <Text style={styles.meta}>
          {song2.artist.name} • {song2.album}
        </Text>

        <Text style={styles.trackId}>Track ID: {song2.id}</Text>

        {song2.preview && (
          <TouchableOpacity onPress={openPreview}>
            <Text style={styles.previewLink}>▶ Preview</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    elevation: 2,
  },
  cover: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  trackId: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },
  previewLink: {
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 4,
  },
});
