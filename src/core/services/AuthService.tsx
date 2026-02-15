import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------- Types --------------------
export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  registerInMongo: (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<User>;
  pictureVersion: number;          // ✅ added
  refreshPicture: () => void;      // ✅ added
}

// -------------------- Context --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------- Provider --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiUrl = "http://62.73.121.31:5000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ Picture version state for refreshing profile images
  const [pictureVersion, setPictureVersion] = useState(0);
  const refreshPicture = () => setPictureVersion((prev) => prev + 1);

  // Load saved auth state
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem("currentUser");
        const savedLoggedIn = await AsyncStorage.getItem("isLoggedIn");

        if (savedUser && savedLoggedIn === "true") {
          setCurrentUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.warn("Failed to load auth state:", err);
      }
    })();
  }, []);

  // -------------------- Auth Functions --------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<User>(`${apiUrl}/loginin`, { email, password });
      const user = response.data;

      setCurrentUser(user);
      setIsLoggedIn(true);

      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const registerInMongo = async (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ) => {
    return axios.post(`${apiUrl}/registerin`, { username, email, password, rePassword });
  };

  const logout = async () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("currentUser");
    await AsyncStorage.removeItem("isLoggedIn");
    setPictureVersion(0); // reset picture version
  };

  const updateUser = async (user: User): Promise<User> => {
    if (!user.id && !user._id) throw new Error("User ID is required");
    const userId = user.id || user._id;

    try {
      const response = await axios.put<User>(`${apiUrl}/users/${userId}`, {
        username: user.username,
        email: user.email,
      });

      const updatedUser = response.data;

      setCurrentUser(updatedUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  // -------------------- Provide Context --------------------
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        registerInMongo,
        logout,
        updateUser,
        pictureVersion,     // ✅ provide
        refreshPicture,     // ✅ provide
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -------------------- Hook --------------------
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};