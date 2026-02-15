// AuthService.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  pictureUpdatedAt?: number;
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
  pictureVersion: number;
  refreshPicture: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiUrl = "http://62.73.121.31:5000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pictureVersion, setPictureVersion] = useState(0);

  // ⭐ Load user from MongoDB on startup
  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem("userId");
      const savedLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (savedId && savedLoggedIn === "true") {
        try {
          const res = await axios.get<User>(`${apiUrl}/users/${savedId}`);
          const user = res.data;

          setCurrentUser(user);
          setIsLoggedIn(true);
          setPictureVersion(user.pictureUpdatedAt || 0);
        } catch (err) {
          console.error("Failed to load user from MongoDB:", err);
        }
      }
    })();
  }, []);

  // ⭐ Login: save only userId, fetch full user from MongoDB
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<User>(`${apiUrl}/loginin`, {
        email,
        password,
      });

      const user = response.data;

      await AsyncStorage.setItem("userId", user._id || user.id || "");
      await AsyncStorage.setItem("isLoggedIn", "true");

      setCurrentUser(user);
      setIsLoggedIn(true);
      setPictureVersion(user.pictureUpdatedAt || 0);

      return true;
    } catch {
      return false;
    }
  };

  const registerInMongo = async (username, email, password, rePassword) => {
    return axios.post(`${apiUrl}/registerin`, {
      username,
      email,
      password,
      rePassword,
    });
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPictureVersion(0);
  };

  // ⭐ Update user: fetch fresh user from MongoDB
  const updateUser = async (user: User): Promise<User> => {
    const userId = user.id || user._id;

    await axios.put(`${apiUrl}/users/${userId}`, {
      username: user.username,
      email: user.email,
    });

    const refreshed = await axios.get<User>(`${apiUrl}/users/${userId}`);

    setCurrentUser(refreshed.data);
    return refreshed.data;
  };

  const refreshPicture = () => {
    setPictureVersion((prev) => prev + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        registerInMongo,
        logout,
        updateUser,
        pictureVersion,
        refreshPicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
