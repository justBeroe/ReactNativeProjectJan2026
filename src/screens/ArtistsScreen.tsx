import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function ArtistScreen() {
  const [deezerArtists, setDeezerArtists] = useState([]);
  const [jamendoArtists, setJamendoArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = "http://62.73.121.31:4000";

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const d = await axios.get(`${backendUrl}/api/deezer-artists`);
      const j = await axios.get(`${backendUrl}/api/jamendo-artists`); // FIXED

      console.log("Deezer artists:", d.data);
      console.log("Jamendo artists:", j.data);

      setDeezerArtists(d.data);
      setJamendoArtists(j.data);
    } catch (err) {
      console.error("Failed to load artists:", err);
    }
  };

  const filteredDeezer = deezerArtists.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJamendo = jamendoArtists.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDeezerAll = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/fetch-deezer-all?start=1&end=100`
      );

      Alert.alert("Success", `${res.data.message}\nTotal: ${res.data.totalTracks}`);
      loadArtists();
    } catch (err) {
      Alert.alert("Error", "Failed to fetch Deezer artists");
    }
  };

  const deleteAllSongs = async () => {
    Alert.alert("Confirm", "Delete all songs?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const res = await axios.delete(`${backendUrl}/api/delete-songs`);
            Alert.alert("Deleted", `${res.data.message}`);
            loadArtists();
          } catch (err) {
            Alert.alert("Error", "Failed to delete songs");
          }
        },
      },
    ]);
  };

  const renderArtist = ({ item }) => (
    <View style={styles.artistItem}>
      <Text style={styles.artistName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.fetchBtn} onPress={fetchDeezerAll}>
          <Text style={styles.btnText}>Fetch Deezer Artists</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteAllSongs}>
          <Text style={styles.btnText}>Delete All Songs</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search artists..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text style={styles.header}>Deezer Artists</Text>
      <FlatList
        style={{ flex: 1 }}
        data={filteredDeezer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArtist}
      />

      <Text style={styles.header}>Jamendo Artists</Text>
      <FlatList
        style={{ flex: 1 }}
        data={filteredJamendo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArtist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }, // FIXED
  buttonRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  fetchBtn: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 6 },
  deleteBtn: { backgroundColor: "#E53935", padding: 10, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "bold" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  header: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  artistItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  artistName: { fontSize: 16 },
});
