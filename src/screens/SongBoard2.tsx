import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import type { Song2 } from "../models/song2.model";
import { SongItem2 } from "./SongItem2";

export const SongBoard2: React.FC = () => {
  console.log("SongBoard2 is rendering");

  const [songs, setSongs] = useState<Song2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // 🔥 KEEPING YOUR FETCH LOGIC
        await axios.get("https://deezerapi2.onrender.com/api/fetch-jamendo");

        const res = await axios.get<Song2[]>(
          "https://deezerapi2.onrender.com/api/songs2"
        );

        if (!res.data || res.data.length === 0) {
          setError("No songs found");
        } else {
          setSongs(res.data);
        }
      } catch (err) {
        console.error("Error fetching songs2", err);
        setError("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []); // 👈 no artistId dependency

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {songs.map((song) => (
        <SongItem2 key={song._id} song2={song} variant="compact" />
      ))}
    </ScrollView>
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
