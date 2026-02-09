import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../core/services/AuthService";

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

// ⭐ FIX: include currentUser so you can log it 
  const { login, currentUser } = useAuth();

  const [email, setEmail] = useState("dobromirtt@gmail.com");
  const [password, setPassword] = useState("123");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const emailError = touchedEmail && !email;
  const passwordError = touchedPassword && !password;
  const isFormValid = email && password;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const success = await login(email, password);

    // ⭐ DEBUG LOG HERE
    console.log("Logged in user:", currentUser);
    if (success) {
      navigation.navigate("Home" as never);
    } else {
      alert("Login failed - 401 Unauthorized");
    }
  };

  return (
    <View style={styles.container}>
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
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Login</Text>
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
});
