import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import type { Song } from "../models/song.model";
import {
  updateSong,
  deleteSong,
  getSongsWithIDMongoDB,
} from "../core/services/useSongs";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { ArtistStackParamList } from "../navigation/ArtistStackNavigator";

interface ThemeItemProps {
  song: Song;
  variant?: "compact" | "full";
  onSongUpdated?: (song: Song) => void;
  onSongDeleted?: (songId: number) => void;
}

export const SongItem: React.FC<ThemeItemProps> = ({
  song,
  variant = "full",
  onSongUpdated,
  onSongDeleted,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [artistName, setArtistName] = useState(song.artist.name);
  const [albumTitle, setAlbumTitle] = useState(song.album.title);

  const navigation = useNavigation<NavigationProp<ArtistStackParamList>>();

  // Navigate to DetailsComponentSong
  const handlePress = () => {
    navigation.navigate("DetailsSong", { song });
  };

  const openPreviewStream = () => {
    if (song.preview) {
      Linking.openURL(song.preview);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        artist: { ...song.artist, name: artistName },
        album: { ...song.album, title: albumTitle },
      };

      await updateSong(song._id, updatedData);

      const freshSongs = await getSongsWithIDMongoDB(song.artist.id);
      const freshSong = freshSongs.find((s) => s._id === song._id);

      setIsEditMode(false);
      if (freshSong) onSongUpdated?.(freshSong);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this song?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSong(song._id);
            onSongDeleted?.(song._id);
          } catch (err) {
            console.error("Delete failed", err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {!isEditMode ? (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.title}>{song.title}</Text>
          <Text>Artist: {song.artist.name}</Text>
          <Text>Album: {song.album.title}</Text>

          {song.preview && (
            <View style={{ marginVertical: 10 }}>
              <Button title="Open Preview Stream" onPress={openPreviewStream} />
            </View>
          )}

          {song.album.cover && (
            <Image
              source={{ uri: song.album.cover }}
              style={{ width: 100, height: 100, marginVertical: 10 }}
            />
          )}

          <Text>Artist ID: {song.artist.id}</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <Text>Artist Name:</Text>
          <TextInput
            value={artistName}
            onChangeText={setArtistName}
            style={styles.input}
          />
          <Text>Album Title:</Text>
          <TextInput
            value={albumTitle}
            onChangeText={setAlbumTitle}
            style={styles.input}
          />

          <View style={styles.buttons}>
            <Button title="Cancel" onPress={() => setIsEditMode(false)} />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      )}

      {!isEditMode && (
        <View style={styles.buttons}>
          <Button title="Edit" onPress={() => setIsEditMode(true)} />
          <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, marginBottom: 16, backgroundColor: "#f8f8f8", borderRadius: 8 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 6, borderRadius: 4 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  infoWrapper: {},
});