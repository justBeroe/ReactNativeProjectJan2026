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
  const { login } = useAuth();

  const [email, setEmail] = useState("dobromirtt@gmail.com");
  const [password, setPassword] = useState("123");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // =========================
  // Validation Logic
  // =========================

  // ✅ NEW: Trimmed values (prevents spaces-only input)
  const emailTrimmed = email.trim();
  const passwordTrimmed = password.trim();

  // ✅ NEW: Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ NEW: Actual validation checks (NOT dependent on touched)
  const isEmailEmpty = emailTrimmed.length === 0;
  const isEmailInvalid = !emailRegex.test(emailTrimmed);

  const isPasswordEmpty = passwordTrimmed.length === 0;

  // ✅ Error display (depends on touched)
  const emailError = touchedEmail && (isEmailEmpty || isEmailInvalid);

  const passwordError = touchedPassword && isPasswordEmpty;

  // ✅ IMPORTANT: Form validity must NOT depend on touched
  const isFormValid = !isEmailEmpty && !isEmailInvalid && !isPasswordEmpty;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    //   const success = await login(emailTrimmed, passwordTrimmed); // ✅ Use trimmed values

    //   if (success) {
    //     navigation.navigate("Home" as never);
    //   } else {
    //     alert("Login failed - 401 Unauthorized");
    //   }

    try {
      const success = await login(emailTrimmed, passwordTrimmed);

      if (success) {
        navigation.navigate("Home" as never);
      } else {
        alert("Login failed - Invalid email or password");
      }
    } catch (error: any) {
      if (error.message === "Network Error") {
        alert(
          "Cannot connect to server. Check your backend or internet connection.",
        );
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email */}
      <TextInput
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="Email"
        keyboardType="email-address" // ✅ Better UX
        autoCapitalize="none" // ✅ Prevent capital letters
        value={email}
        onChangeText={setEmail}
        onBlur={() => setTouchedEmail(true)}
      />

      {emailError && (
        <Text style={styles.errorText}>
          {isEmailEmpty ? "Email is required!" : "Enter a valid email address!"}
        </Text>
      )}

      {/* Password */}
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

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
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
