import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../core/services/AuthService";
import axios from "axios";

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login, currentUser } = useAuth();

  const [email, setEmail] = useState("dobromirtt@gmail.com");
  const [password, setPassword] = useState("123");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const [isWarmingUp, setIsWarmingUp] = useState(false);

  const emailError = touchedEmail && !email;
  const passwordError = touchedPassword && !password;
  const isFormValid = email && password;

  // ⭐ Ping Render API to wake it up
  const wakeUpServer = async () => {
    try {
      setIsWarmingUp(true);
      await axios.get("https://userloginapi.onrender.com/health"); 
      // If you don't have /health, use any lightweight endpoint
    } catch (err) {
      console.log("Server waking up...");
    } finally {
      setIsWarmingUp(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // ⭐ Wake up Render API before login
    await wakeUpServer();

    const success = await login(email, password);

    

    if (success) {
      navigation.navigate("Home" as never);
    } else {
      alert("Login failed - 401 Unauthorized");
    }
  };

  return (
    <View style={styles.container}>
      {isWarmingUp && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Waking up server...</Text>
        </View>
      )}

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setTouchedEmail(true)}
      />
      {emailError && <Text style={styles.errorText}>Email is required!</Text>}

      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={() => setTouchedPassword(true)}
      />
      {passwordError && (
        <Text style={styles.errorText}>Password is required!</Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!isFormValid || isWarmingUp) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid || isWarmingUp}
      >
        <Text style={styles.buttonText}>
          {isWarmingUp ? "Please wait..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#8bbcff" },
  buttonText: { color: "white", fontSize: 16 },
  link: { marginTop: 20, color: "#007bff", textAlign: "center" },

  // ⭐ Overlay for server wake-up
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  overlayText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
});
