import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";

export const JamendoAdminPanel = ({ onRefresh }) => {
  const backend = "http://62.73.121.31:4000";

  const fetchAll = async () => {
    Alert.alert("Fetching…", "This may take 20–40 seconds.");

    try {
      const res = await axios.get(`${backend}/api/fetch-jamendo-range?start=1&end=100`);
      Alert.alert("Success", res.data.message);
      onRefresh(); // ⭐ refresh UI
    } catch (err) {
      Alert.alert("Error", "Failed to fetch Jamendo songs");
    }
  };

  const deleteAll = async () => {
    Alert.alert("Confirm", "Delete ALL Jamendo songs?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const res = await axios.delete(`${backend}/api/jamendo/delete-all`);
            Alert.alert("Deleted", res.data.message);
            onRefresh(); // ⭐ refresh UI
          } catch (err) {
            Alert.alert("Error", "Failed to delete Jamendo songs");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fetchBtn} onPress={fetchAll}>
        <Text style={styles.text}>Fetch ALL Jamendo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteAll}>
        <Text style={styles.text}>Delete ALL Jamendo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  fetchBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
