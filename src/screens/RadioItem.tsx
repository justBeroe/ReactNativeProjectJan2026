import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

export interface RadioStation {
  stationuuid?: string;
  name: string;
  url: string;
  country: string;
  favicon?: string;
}

interface RadioItemProps {
  station: RadioStation;
  variant?: "compact" | "full";
}

export const RadioItem: React.FC<RadioItemProps> = ({ station, variant = "full" }) => {
  const openStream = () => {
    if (station.url) {
      Linking.openURL(station.url);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openStream}>
        <Text style={styles.title}>{station.name}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Country: {station.country}</Text>

      {station.favicon && (
        <Image
          source={{ uri: station.favicon }}
          style={styles.favicon}
          resizeMode="contain"
        />
      )}

      <View style={styles.audioSection}>
        <Text style={styles.label}>Listen:</Text>
        <TouchableOpacity style={styles.listenButton} onPress={openStream}>
          <Text style={styles.listenText}>Open Stream</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  favicon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 6,
  },
  audioSection: {
    marginTop: 10,
  },
  listenButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  listenText: {
    color: "white",
    fontWeight: "bold",
  },
});
