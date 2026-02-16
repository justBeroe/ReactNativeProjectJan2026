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

export const SongItem2: React.FC<SongItem2Props> = ({
  song2,
  variant = "compact",
}) => {
  const openPreview = () => {
    if (song2?.preview) Linking.openURL(String(song2.preview));
  };

  const picture = String(song2?.artist?.picture || "https://via.placeholder.com/90");
  const title = String(song2?.title || "Untitled");
  const artist = String(song2?.artist?.name || "Unknown Artist");
  const album = String(song2?.album || "Unknown Album");
  const trackId = String(song2?.id || "");

  return (
    <View style={styles.card}>
      <Image source={{ uri: picture }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.meta}>
          {artist} • {album}
        </Text>

        {variant === "full" && (
          <Text style={styles.trackId}>Track ID: {trackId}</Text>
        )}

        {song2?.preview ? (
          <TouchableOpacity onPress={openPreview}>
            <Text style={styles.previewLink}>▶ Preview</Text>
          </TouchableOpacity>
        ) : null}
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
