// AuthService.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id?: string;
  _id?: string; // MongoDB id
  username: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ) => boolean;
  registerInMongo: (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ) => Promise<any>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiUrl = "http://localhost:5000";

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;
    try {
      const response = await axios.post<User>(`${apiUrl}/loginin`, {
        email,
        password,
      });
      const user = response.data;
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const register = (
    username: string,
    email: string,
    password: string,
    rePassword: string
  ): boolean => {
    if (username && email && password && rePassword) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return true;
    }
    return false;
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

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
  };

  const getAllUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(apiUrl);
    return response.data.map((user) => ({ ...user, id: user._id }));
  };

  const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get<User>(`${apiUrl}/${id}`);
    return response.data;
  };

  const updateUser = async (user: User): Promise<User> => {
    if (!user.id) throw new Error("User ID is required for update");
    const payload = { username: user.username, email: user.email };

    // const response = await axios.put<User>(`${apiUrl}/users/${user.id}`, payload);
    // ✅ Ensure user.id is a string, not an object
    const response = await axios.put<User>(
      `${apiUrl}/users/${String(user.id)}`,
      payload
    );

    const updatedUser = response.data;
    setCurrentUser(updatedUser);

    // FIXED: persist updated user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser)); // ✅ FIXED LINE

    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        register,
        registerInMongo,
        logout,
        getAllUsers,
        getUserById,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
