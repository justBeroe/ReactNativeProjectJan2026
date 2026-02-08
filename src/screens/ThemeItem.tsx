import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import type { Song } from "../models/song.model";
import {
  updateSong,
  deleteSong,
  getSongsWithIDMongoDB,
} from "../core/services/useSongs";

interface ThemeItemProps {
  song: Song;
  variant?: "compact" | "full";
  onSongUpdated?: (song: Song) => void;
  onSongDeleted?: (songId: number) => void;
}

export const ThemeItem: React.FC<ThemeItemProps> = ({
  song,
  variant = "full",
  onSongUpdated,
  onSongDeleted,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [artistName, setArtistName] = useState(song.artist.name);
  const [albumTitle, setAlbumTitle] = useState(song.album.title);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔊 Audio controls
  const playPreview = async () => {
    if (!song.preview) return;

    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.preview },
        { shouldPlay: true },
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if ("didJustFinish" in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pausePreview = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        artist: { ...song.artist, name: artistName },
        album: { ...song.album, title: albumTitle },
      };

      const updatedSong = await updateSong(song._id, updatedData);

      const freshSongs = await getSongsWithIDMongoDB(song.artist.id);
      const freshSong = freshSongs.find((s) => s._id === song._id);

      setIsEditMode(false);
      if (freshSong) onSongUpdated?.(freshSong);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this song?",
      [
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
      ],
    );
  };

  return (
    <View style={styles.container}>
      {!isEditMode ? (
        <View style={styles.infoWrapper}>
          <Text style={styles.title}>{song.title}</Text>
          <Text>Artist: {song.artist.name}</Text>
          <Text>Album: {song.album.title}</Text>

          {/* Audio Preview */}
          {song.preview && (
            <View style={{ marginVertical: 10 }}>
              <Button
                title={isPlaying ? "Pause" : "Play"}
                onPress={isPlaying ? pausePreview : playPreview}
              />
            </View>
          )}

          {/* Album Cover */}
          {song.album.cover && (
            <Image
              source={{ uri: song.album.cover }}
              style={{ width: 100, height: 100, marginVertical: 10 }}
            />
          )}

          <Text>Artist ID: {song.artist.id}</Text>

          <View style={styles.buttons}>
            <Button title="Edit" onPress={() => setIsEditMode(true)} />
            <Button title="Delete" onPress={handleDelete} color="red" />
          </View>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  infoWrapper: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 6,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
