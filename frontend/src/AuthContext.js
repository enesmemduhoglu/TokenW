import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    if (data && data.username && data.role) {
      setUser({ username: data.username, role: data.role });
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, role: data.role })
      );
    } else {
      console.error("Login failed: Invalid data", data);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
