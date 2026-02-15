import React, { useRef, useState } from "react";
import { View, Text, Button, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../core/services/AuthService"; // adjust path

export default function CameraScreen() {
  const { currentUser, refreshPicture, pictureVersion } = useAuth();
  const userId = currentUser?._id || currentUser?.id;

  const [face, setFace] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);

  const SERVER_URL = "http://62.73.121.31:5000";

  if (!userId) {
    return (
      <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text>No user logged in.</Text>
      </View>
    );
  }

  const handleUpload = async (uri) => {
    if (!uri) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("picture", { uri, name: "photo.jpg", type: "image/jpeg" });

      const res = await fetch(`${SERVER_URL}/users/${userId}/picture`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Upload failed:", text);
        Alert.alert("Error", "Upload failed");
        return;
      }

      Alert.alert("Success", "Photo uploaded!");
      refreshPicture(); // ✅ increment pictureVersion to refresh server image
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!permission) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Camera Demo</Text>

      {!permission.granted ? (
        <Button title="Grant Permission" onPress={requestPermission} />
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={{ width: 300, height: 400, marginBottom: 10 }}
            facing={face}
          />

          <Button
            title="Take Picture"
            onPress={async () => {
              const photoData = await cameraRef.current.takePictureAsync({ quality: 0.6 });
              setPhoto(photoData.uri);
            }}
          />

          <Button
            title="Flip Camera"
            onPress={() => setFace(face === "back" ? "front" : "back")}
          />

          {photo && (
            <>
              <Text>Preview:</Text>
              <Image source={{ uri: photo }} style={{ width: 200, height: 300, marginTop: 10 }} />
              <Button
                title={uploading ? "Uploading..." : "Upload"}
                onPress={() => handleUpload(photo)}
                disabled={uploading}
              />
            </>
          )}

          <Text style={{ marginTop: 30 }}>Photo from server:</Text>
          <Image
            key={pictureVersion} // ✅ changing key triggers re-render
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