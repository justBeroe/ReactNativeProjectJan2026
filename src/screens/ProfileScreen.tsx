import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../core/services/AuthService";

export function ProfileScreen() {
  const { currentUser, updateUser } = useAuth() as any;

  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
  });

  useEffect(() => {
    if (currentUser) {
      setFormValues({
        username: currentUser.username || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  const handleEdit = () => {
    // setIsEditMode(true);
    // setTouched({ username: false, email: false });
    console.log("Current user:", currentUser);

    // 🔹 Fix: populate the form from currentUser at edit time
    // setFormValues({
    //   username: currentUser?.username || "",
    //   email: currentUser?.email || "",
    // });

    if (!currentUser) {
      console.warn("Cannot enter edit mode: currentUser not set yet");
      return;
    }
    console.log("Editing user:", currentUser, "form before:", formValues);
    setFormValues({
      username: currentUser.username ?? "",
      email: currentUser.email ?? "",
    });

    setTouched({ username: false, email: false });
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormValues({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
    });
  };

  const handleBlur = (field: "username" | "email") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isUsernameInvalid = touched.username && !formValues.username.trim();
  const isEmailInvalid = touched.email && !formValues.email.trim();

  const handleSave = async () => {
    if (!formValues.username.trim() || !formValues.email.trim()) {
      return;
    }

    const storedUser = await AsyncStorage.getItem("currentUser");

    if (!storedUser) {
      Alert.alert("Error", "User not found");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    const updatedUser = {
      id: parsedUser.id || parsedUser._id,
      username: formValues.username,
      email: formValues.email,
    };

    try {
      await updateUser(updatedUser);
      setIsEditMode(false);
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
    console.error("Update failed:", err);  // 🔹 log actual error
      Alert.alert("Error", "Update failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>

      {!isEditMode ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <Text>{currentUser?.username || "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text>{currentUser?.email || "N/A"}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <View style={{ flex: 1 }}>
              <TextInput
                value={formValues.username}
                onChangeText={(text) =>
                  setFormValues((prev) => ({
                    ...prev,
                    username: text,
                  }))
                }
                onBlur={() => handleBlur("username")}
                style={[styles.input, isUsernameInvalid && styles.inputError]}
              />
              {isUsernameInvalid && (
                <Text style={styles.error}>Username is required!</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <View style={{ flex: 1 }}>
              <TextInput
                value={formValues.email}
                onChangeText={(text) =>
                  setFormValues((prev) => ({
                    ...prev,
                    email: text,
                  }))
                }
                onBlur={() => handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, isEmailInvalid && styles.inputError]}
              />
              {isEmailInvalid && (
                <Text style={styles.error}>Email is required!</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isUsernameInvalid || isEmailInvalid}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    marginBottom: 55,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,

    paddingHorizontal: 10,
    paddingVertical: 8, // smaller vertical padding
    fontSize: 16, // explicit font size
    height: 45, // ensures text fits

    marginBottom: 18, // ✅ adds space below input
    color: "#000", // ✅ ensures typed text is visible
    backgroundColor: "#fff", // optional but safe
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
