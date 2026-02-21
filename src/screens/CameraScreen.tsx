import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider"; // ✅ slider for flip camera
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useAuth } from "../core/services/AuthService";
import axios from "axios";

export default function CameraScreen() {
  const { currentUser, refreshPicture, pictureVersion } = useAuth();
  const userId = currentUser?._id || currentUser?.id;

  // Camera state
  const [face, setFace] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const [showCamera, setShowCamera] = useState(false); // ✅ Switch state

  const SERVER_URL = "http://62.73.121.31:5000";

  if (!userId)
    return (
      <View style={styles.centered}>
        <Text style={styles.messageText}>No user logged in.</Text>
      </View>
    );

  const handleUpload = async (uri: string) => {
    if (!uri) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${SERVER_URL}/users/${userId}/picture`, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const serverResponse = await res.text();
      if (!res.ok) {
        Alert.alert("Upload failed", serverResponse);
        return;
      }

      await axios.put(`${SERVER_URL}/users/${userId}`, {
        pictureUpdatedAt: Date.now(),
      });

      refreshPicture();
      Alert.alert("Success", "Photo uploaded!");
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!permission)
    return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Camera for profile picture</Text>

      {/* ========================= */}
      {/* SWITCH TO SHOW CAMERA */}
      {/* ========================= */}
      <View style={styles.switchRow}>
        <Text>Show Camera</Text>
        <Switch
          value={showCamera}
          onValueChange={async (value) => {
            if (!permission.granted) await requestPermission();
            setShowCamera(value);
          }}
        />
      </View>

      {/* ========================= */}
      {/* CAMERA SECTION */}
      {/* ========================= */}
      {showCamera && permission.granted && (
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing={face} />

          {/* Slider to flip camera */}
          <Text style={styles.sliderLabel}>Camera Slider: {face.toUpperCase()}</Text>
          <Slider
            style={{ width: "100%", height: 60, marginVertical: 20 }}
            minimumValue={0}
            maximumValue={1}
            step={1}
            value={face === "back" ? 0 : 1}
            onValueChange={(val) => setFace(val === 0 ? "back" : "front")}
            minimumTrackTintColor="#2196F3" // color of the filled part
            maximumTrackTintColor="#ccc" // color of the empty part
            thumbTintColor="#007AFF" // color of the draggable thumb
          />

          {/* Take picture */}
          <TouchableOpacity
            style={[styles.button, styles.captureButton]}
            onPress={async () => {
              const photoData = await cameraRef.current?.takePictureAsync({
                quality: 0.6,
              });
              if (photoData?.uri) setPhoto(photoData.uri);
            }}
          >
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========================= */}
      {/* PREVIEW */}
      {/* ========================= */}
      {photo && (
        <View style={styles.previewSection}>
          <Text style={styles.subtitle}>Preview</Text>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <TouchableOpacity
            style={[
              styles.uploadButton,
              uploading && styles.uploadButtonDisabled,
            ]}
            onPress={() => handleUpload(photo)}
            disabled={uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Upload"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========================= */}
      {/* UPLOADED PHOTO */}
      {/* ========================= */}
      <View style={styles.serverSection}>
        <Text style={styles.subtitle}>Uploaded photo</Text>
        <Image
          key={pictureVersion}
          source={{
            uri: `${SERVER_URL}/users/${userId}/picture?time=${pictureVersion}`,
          }}
          style={styles.serverImage}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9", flexGrow: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loader: { marginTop: 50 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  messageText: { fontSize: 16, color: "#444" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cameraContainer: { width: "100%", marginBottom: 20 },
  camera: {
    width: "100%",
    height: 400,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  sliderLabel: { marginBottom: 10, fontWeight: "600" },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  captureButton: { backgroundColor: "#007AFF" },
  buttonText: { color: "#fff", fontWeight: "600" },
  previewSection: { alignItems: "center", marginBottom: 20 },
  previewImage: {
    width: 220,
    height: 320,
    borderRadius: 12,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  uploadButtonDisabled: { backgroundColor: "#9ec9ff" },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  serverSection: { alignItems: "center", marginTop: 30 },
  serverImage: { width: 220, height: 320, borderRadius: 12, marginTop: 10 },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
});
