"use client";

import { useState } from "react";
import { useAdmin } from "./AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use the async login function
      const success = await login(username, password);

      if (!success) {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-lg shadow-md p-4 sm:p-6 border border-[var(--card-border)]">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
        Admin Login
      </h2>
      <p className="text-[var(--text-secondary)] mb-4">
        Login required to add match results
      </p>

      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[var(--card-bg)] text-[var(--text-primary)] w-full px-3 py-2 text-sm sm:text-base border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[var(--card-bg)] text-[var(--text-primary)] w-full px-3 py-2 text-sm sm:text-base border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username || !password}
          className="w-full bg-[var(--accent-blue)] text-white py-2 px-4 rounded-md hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
