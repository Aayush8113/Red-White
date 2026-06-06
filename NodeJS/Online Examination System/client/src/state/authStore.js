import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("auth-user")) || null,
  isAuthenticated: !!localStorage.getItem("auth-token"),
  token: localStorage.getItem("auth-token") || null,
  isLoading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      
      const userData = { ...data.user, role: data.user.role.toLowerCase() };
      set({ user: userData, token: data.token, isAuthenticated: true, isLoading: false });
      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(userData));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      const userData = { ...data.user, role: data.user.role.toLowerCase() };
      set({ user: userData, token: data.token, isAuthenticated: true, isLoading: false });
      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(userData));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    set({ user: null, isAuthenticated: false, token: null });
  },

  updateUser: (userData) => set((s) => {
    const newUser = { ...s.user, ...userData };
    localStorage.setItem("auth-user", JSON.stringify(newUser));
    return { user: newUser };
  }),
}));

