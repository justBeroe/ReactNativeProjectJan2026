import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import type { Song2 } from "../models/song2.model";
import type { ArtistStackParamList } from "../navigation/ArtistStackNavigator";
import { useNavigation, NavigationProp } from "@react-navigation/native";
interface SongItem2Props {
  song2: Song2;
  variant?: "compact" | "full";
}

export const SongItem2: React.FC<SongItem2Props> = ({ song2, variant = "compact" }) => {
  const navigation = useNavigation<NavigationProp<ArtistStackParamList>>();

  const handlePress = () => {
    navigation.navigate("DetailsSong", { song2 });
  };

  const openPreview = () => {
    if (song2?.preview) Linking.openURL(String(song2.preview));
  };

  const picture = song2?.artist?.picture || "https://via.placeholder.com/90";
  const title = song2?.title || "Untitled";
  const artist = song2?.artist?.name || "Unknown Artist";
  const album = song2?.album || "Unknown Album";

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <Image source={{ uri: picture }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{artist} • {album}</Text>
        {variant === "full" && <Text style={styles.trackId}>Track ID: {song2.id}</Text>}
        {song2?.preview && (
          <TouchableOpacity onPress={openPreview}>
            <Text style={styles.previewLink}>▶ Preview</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 12, marginBottom: 14, borderRadius: 10, elevation: 2 },
  cover: { width: 90, height: 90, borderRadius: 8, backgroundColor: "#ddd" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 14, color: "#555", marginBottom: 6 },
  trackId: { fontSize: 12, color: "#777", marginBottom: 6 },
  previewLink: { color: "#007AFF", fontWeight: "600", marginTop: 4 },
});