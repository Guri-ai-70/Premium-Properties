import { ADMIN_CREDENTIALS } from "@/config";

const SESSION_KEY = "premium_properties::session_user";

// Mock auth that mimics the Base44 User entity API used in Layout.jsx, but
// gated behind a username + password (validated against src/config.js).
export const User = {
  async me() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) throw new Error("Not authenticated");
    return JSON.parse(raw);
  },

  // Validates credentials and starts a session. Throws on bad credentials.
  async login(username, password) {
    const u = (username || "").trim().toLowerCase();
    const ok =
      u === ADMIN_CREDENTIALS.username.trim().toLowerCase() &&
      password === ADMIN_CREDENTIALS.password;
    if (!ok) throw new Error("Invalid username or password");

    const user = {
      id: "USR_ADMIN",
      full_name: "Administrator",
      email: "admin@premiumproperties.com",
      role: "admin",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
