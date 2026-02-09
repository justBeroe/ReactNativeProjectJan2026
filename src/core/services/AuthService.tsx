import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiUrl = "https://userloginapi.onrender.com";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load saved auth state
  useEffect(() => {
    (async () => {
      const savedUser = await AsyncStorage.getItem("currentUser");
      const savedLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (savedUser && savedLoggedIn === "true") {
        setCurrentUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<User>(`${apiUrl}/loginin`, {
        email,
        password,
      });

      const user = response.data;

      setCurrentUser(user);
      console.log("AuthService set user:", user); // ⭐ correct place
      setIsLoggedIn(true);

      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const registerInMongo = async (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ) => {
    return axios.post(`${apiUrl}/registerin`, {
      username,
      email,
      password,
      rePassword,
    });
  };

  const logout = async () => {
    console.log("Running logout...");
    setCurrentUser(null);
    setIsLoggedIn(false);

    await AsyncStorage.removeItem("currentUser");
    await AsyncStorage.removeItem("isLoggedIn");
    console.log("Logout complete");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        registerInMongo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
