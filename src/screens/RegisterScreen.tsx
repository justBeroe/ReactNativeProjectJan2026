import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../core/services/AuthService";

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { registerInMongo } = useAuth();

  // Form state
  const [username, setUsername] = useState("justberoe");
  const [email, setEmail] = useState("dobromirtt@gmail.com");
  const [password, setPassword] = useState("123");
  const [rePassword, setRePassword] = useState("123");

  // Touched flags
  const [touchedUsername, setTouchedUsername] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedRePassword, setTouchedRePassword] = useState(false);

  // Validation helpers
  const noWhitespace = (value: string) => value.trim().length > 0;

  // Always validate actual values
  const isPasswordEmpty = !password || !noWhitespace(password);
  const isPasswordTooShort = password.trim().length < 6;

  const isRePasswordEmpty = !rePassword || !noWhitespace(rePassword);
  const passwordsMismatch = password !== rePassword;

  // Show errors only after touch
  const usernameError =
    touchedUsername && (!username || !noWhitespace(username));

  const emailError = touchedEmail && !email;

  const passwordError =
    touchedPassword && (isPasswordEmpty || isPasswordTooShort);

  const rePasswordError = touchedRePassword && isRePasswordEmpty;

  const passwordMismatchError = touchedRePassword && passwordsMismatch;

  // ✅ IMPORTANT: Form validity must NOT depend on touched
  const isFormValid =
    username &&
    email &&
    !isPasswordEmpty &&
    !isPasswordTooShort &&
    !isRePasswordEmpty &&
    !passwordsMismatch;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await registerInMongo(username, email, password, rePassword);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login" as never);
    } catch (err) {
      console.error("Registration failed:", err);
      Alert.alert("Error", "Registration failed. Email may already exist.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Username */}
      <TextInput
        style={[styles.input, usernameError && styles.errorInput]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        onBlur={() => setTouchedUsername(true)}
      />
      {usernameError && (
        <Text style={styles.errorText}>Username is required!</Text>
      )}

      {/* Email */}
      <TextInput
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setTouchedEmail(true)}
      />
      {emailError && <Text style={styles.errorText}>Email is required!</Text>}

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
        <Text style={styles.errorText}>
          {isPasswordEmpty
            ? "Password is required!"
            : isPasswordTooShort
              ? "Password must be at least 6 characters!"
              : ""}
        </Text>
      )}

      {/* Re-password */}
      <TextInput
        style={[styles.input, rePasswordError && styles.errorInput]}
        placeholder="Confirm Password"
        secureTextEntry
        value={rePassword}
        onChangeText={setRePassword}
        onBlur={() => setTouchedRePassword(true)}
      />

      {passwordMismatchError && (
        <Text style={styles.errorText}>Passwords do not match!</Text>
      )}

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#8bbcff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
  },
});
