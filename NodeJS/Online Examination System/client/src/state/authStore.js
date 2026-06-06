import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to make authenticated API calls
async function authFetch(path, { token, method = "POST", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`);
  return data;
}

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("auth-user")) || null,
  isAuthenticated: !!localStorage.getItem("auth-token"),
  token: localStorage.getItem("auth-token") || null,
  isLoading: false,
  error: null,

  // ── signup ──────────────────────────────────────────────────────────────────
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authFetch("/api/auth/register", { body: { name, email, password } });
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

  // ── login ───────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authFetch("/api/auth/login", { body: { email, password } });
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

  // ── logout ──────────────────────────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    set({ user: null, isAuthenticated: false, token: null });
  },

  // ── forgotPassword ──────────────────────────────────────────────────────────
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authFetch("/api/auth/forgot-password", { body: { email } });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── resetPassword ───────────────────────────────────────────────────────────
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authFetch("/api/auth/reset-password", { body: { token, password } });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── changePassword (logged-in) ──────────────────────────────────────────────
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = get();
      const data = await authFetch("/api/auth/change-password", {
        token,
        body: { currentPassword, newPassword },
      });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── contactAdmin ────────────────────────────────────────────────────────────
  contactAdmin: async ({ name, email, subject, message }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authFetch("/api/auth/contact", { body: { name, email, subject, message } });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── updateUser (local only) ─────────────────────────────────────────────────
  updateUser: (userData) => set((s) => {
    const newUser = { ...s.user, ...userData };
    localStorage.setItem("auth-user", JSON.stringify(newUser));
    return { user: newUser };
  }),
}));
