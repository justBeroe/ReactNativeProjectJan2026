import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useAuth } from "../core/services/AuthService";

export function ProfileScreen() {
  const { currentUser, updateUser, pictureVersion } = useAuth();
  const [formValues, setFormValues] = useState({ username: "", email: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [serverPhoto, setServerPhoto] = useState<string | null>(null);

  const SERVER_URL = "http://62.73.121.31:5000";

  useEffect(() => {
    if (!currentUser) return;
    setFormValues({
      username: currentUser.username || "",
      email: currentUser.email || "",
    });
    setServerPhoto(
      `${SERVER_URL}/users/${currentUser._id || currentUser.id}/picture?time=${pictureVersion}`
    );
  }, [currentUser, pictureVersion]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      await updateUser({ id: currentUser.id || currentUser._id, ...formValues });
      setIsEditMode(false);
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Update failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {serverPhoto && (
        <Image
          source={{ uri: serverPhoto }}
          style={styles.profileImage}
        />
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={[styles.input]}
          value={formValues.username}
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, username: text }))
          }
          editable={isEditMode}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.input]}
          value={formValues.email}
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, email: text }))
          }
          editable={isEditMode}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonRow}>
        {isEditMode ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditMode(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditMode(true)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  formGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    minWidth: 100,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});