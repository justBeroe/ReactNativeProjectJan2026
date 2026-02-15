// CameraScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useAuth } from "../core/services/AuthService";
import axios from "axios";

export default function CameraScreen() {
  const { currentUser, refreshPicture, pictureVersion } = useAuth();
  const userId = currentUser?._id || currentUser?.id;

  console.log("Current user:", currentUser); 
  console.log("Using userId:", userId);

  // ✅ CameraType is a TYPE, not a value → use string literals
  const [face, setFace] = useState<CameraType>("back");

  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const SERVER_URL = "http://62.73.121.31:5000";

  if (!userId)
    return (
      <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text>No user logged in.</Text>
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

      console.log("Uploading:", uri);

      const res = await fetch(`${SERVER_URL}/users/${userId}/picture`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const serverResponse = await res.text();
      console.log("Server response:", serverResponse);

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
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!permission)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Camera Demo
      </Text>

      {!permission.granted ? (
        <Button title="Grant Permission" onPress={requestPermission} />
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={{ width: 300, height: 400, marginBottom: 10 }}
            facing={face} // ✅ string literal, type-safe
          />

          <Button
            title="Take Picture"
            onPress={async () => {
              const photoData = await cameraRef.current?.takePictureAsync({
                quality: 0.6,
              });
              if (photoData?.uri) setPhoto(photoData.uri);
            }}
          />

          <Button
            title="Flip Camera"
            onPress={() =>
              setFace(face === "back" ? "front" : "back") // ✅ correct flip logic
            }
          />

          {photo && (
            <>
              <Text>Preview:</Text>
              <Image
                source={{ uri: photo }}
                style={{ width: 200, height: 300, marginTop: 10 }}
              />
              <Button
                title={uploading ? "Uploading..." : "Upload"}
                onPress={() => handleUpload(photo)}
                disabled={uploading}
              />
            </>
          )}

          <Text style={{ marginTop: 30 }}>Photo from server:</Text>
          <Image
            key={pictureVersion}
            source={{
              uri: `${SERVER_URL}/users/${userId}/picture?time=${pictureVersion}`,
            }}
            style={{ width: 200, height: 300, marginTop: 10 }}
          />
        </>
      )}
    </ScrollView>
  );
}
