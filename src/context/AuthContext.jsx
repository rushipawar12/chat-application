import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const demoUsers = [
  {
    id: 1,
    email: "admin@demo.com",
    password: "admin123",
    name: "Admin User",
    role: "Admin",
    online: true,
  },
  {
    id: 2,
    email: "staff@demo.com",
    password: "staff123",
    name: "Staff Member",
    role: "Staff",
    online: true,
  },
  {
    id: 3,
    email: "agent@demo.com",
    password: "agent123",
    name: "Agent User",
    role: "Agent",
    online: true,
  },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("chatAppUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      online: true,
    };
    setCurrentUser(userData);
    localStorage.setItem("chatAppUser", JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingUser = demoUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const newUser = {
      id: Date.now(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role,
      online: true,
    };
    demoUsers.push(newUser);
    const userToStore = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      online: true,
    };
    setCurrentUser(userToStore);
    localStorage.setItem("chatAppUser", JSON.stringify(userToStore));
    return userToStore;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("chatAppUser");
  };

  const updateUser = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem("chatAppUser", JSON.stringify(updatedUser));
  };

  const value = useMemo(
    () => ({
      currentUser,
      login,
      register,
      logout,
      updateUser,
      loading,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
