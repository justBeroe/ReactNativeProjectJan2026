import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { RadioItem, RadioStation } from "./RadioItem";

export const RadioBoard: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<RadioStation[]>("http://62.73.121.31:4000/api/top-radio-stations")
      .then(response => setStations(response.data))
      .catch(err => {
        console.error("Error fetching radio stations", err);
        setError("Failed to load radio stations");
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      {stations.length === 0 && !error && (
        <ActivityIndicator size="large" color="#000" />
      )}

      {stations.map((station, index) => (
        <RadioItem
          key={`${station.stationuuid || station.name}-${index}`}
          station={station}
        />
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
    marginBottom: 10,
  },
});
