import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArtistStackParamList } from "../navigation/ArtistStackNavigator";

// ✅ Navigation type for ArtistScreen
type ArtistScreenNavigationProp = NativeStackNavigationProp<
  ArtistStackParamList,
  "ArtistList"
>;

// ✅ Artist type (from Deezer/Jamendo API)
interface Artist {
  id: number;
  name: string;
}

export default function ArtistScreen() {
  const navigation = useNavigation<ArtistScreenNavigationProp>();
  const [deezerArtists, setDeezerArtists] = useState<Artist[]>([]);
  const [jamendoArtists, setJamendoArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔥 Loading state for fetch/delete actions
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://62.73.121.31:4000";

  useEffect(() => {
    loadArtists();
  }, []);

  // 🔄 Load artists from backend
  const loadArtists = async () => {
    try {
      const d = await axios.get(`${backendUrl}/api/deezer-artists`);
      const j = await axios.get(`${backendUrl}/api/jamendo-artists`);
      setDeezerArtists(d.data);
      setJamendoArtists(j.data);
    } catch (err) {
      console.error("Failed to load artists:", err);
      Alert.alert("Error", "Failed to load artists");
    }
  };

  // 🔄 Fetch all Deezer artists
  const fetchDeezerAll = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/fetch-deezer-all?start=1&end=100`
      );
      Alert.alert(
        "Success",
        `${res.data.message}\nTotal: ${res.data.totalTracks}`
      );
      loadArtists();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch Deezer artists");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete all songs
  const deleteAllSongs = async () => {
    Alert.alert("Confirm", "Delete all songs?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (loading) return; // Prevent multiple deletes
          setLoading(true);
          try {
            const res = await axios.delete(`${backendUrl}/api/delete-songs`);
            Alert.alert("Deleted", `${res.data.message}`);
            loadArtists();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete songs");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // ✅ Filtered lists for search
  const filteredDeezer = deezerArtists.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredJamendo = jamendoArtists.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Render each artist as clickable
  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() =>
        navigation.navigate("Song", {
          artistId: item.id,
          artistName: item.name,
        })
      }
    >
      <Text style={styles.artistName}>{item.name}</Text>
    </TouchableOpacity>
  );


// ✅ Jamendo artist
const renderArtist2 = ({ item }: { item: Artist }) => (
  <TouchableOpacity
    style={styles.artistItem}
    onPress={() =>
      navigation.navigate("Song2", {
        artistId: item.id,
        artistName: item.name,
      })
    }
  >
    <Text style={styles.artistName}>{item.name}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      {/* Fetch/Delete Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.fetchBtn, { opacity: loading ? 0.6 : 1 }]} // show disabled state visually
          onPress={fetchDeezerAll}
          disabled={loading}
        >
          <Text style={styles.btnText}>Fetch Deezer Artists</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, { opacity: loading ? 0.6 : 1 }]}
          onPress={deleteAllSongs}
          disabled={loading}
        >
          <Text style={styles.btnText}>Delete All Songs</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search artists..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#000" style={{ marginBottom: 10 }} />
      )}

      {/* Deezer Artists */}
      <Text style={styles.header}>Deezer Artists</Text>
      <FlatList
        data={filteredDeezer}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} // ✅ safe key
        renderItem={renderArtist}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginVertical: 10 }}>
            No Deezer artists found.
          </Text>
        }
      />

      {/* Jamendo Artists */}
      <Text style={styles.header}>Jamendo Artists</Text>
      <FlatList
        data={filteredJamendo}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} // ✅ safe key
        renderItem={renderArtist2}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginVertical: 10 }}>
            No Jamendo artists found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  buttonRow: { flexDirection: "row", marginBottom: 20 }, // ❌ removed gap, using marginRight instead
  fetchBtn: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 6, marginRight: 10 },
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
  artistItem: { padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  artistName: { fontSize: 16, color: "#007AFF" },
});