"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  isSessionExpired: boolean;
  setUser: (user: User | null) => void;
  setSessionId: (sessionId: string | null) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session cookie name
const SESSION_COOKIE_NAME = "session";
const SESSION_STORAGE_KEY = "session_id";
const USER_STORAGE_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Function to get session cookie
  const getSessionCookie = useCallback((): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (sessionCookie) {
      return sessionCookie.split("=")[1];
    }
    return null;
  }, []);

  // Function to delete session cookie
  const deleteSessionCookie = useCallback(() => {
    if (typeof document === "undefined") return;
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }, []);

  // Initialize user from localStorage on mount
  // (middleware validates JWT on each request)
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    const cookieSessionId = getSessionCookie();

    // Use cookie session ID if available, otherwise use stored one
    const currentSessionId = cookieSessionId || storedSessionId;

    if (storedUser && currentSessionId) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
        setSessionIdState(currentSessionId);
      } catch {
        // Invalid stored data
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, [getSessionCookie]);

  // Derive isLoggedIn from user state
  const isLoggedIn = !!user;

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const setSessionId = (newSessionId: string | null) => {
    setSessionIdState(newSessionId);
    if (newSessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const logout = async () => {
    // Call logout API
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "logout",
          sessionId: sessionId,
        }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear local state
    setUserState(null);
    setSessionIdState(null);
    setIsSessionExpired(false);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    deleteSessionCookie();
  };

  const refreshSession = async () => {
    // JWT validation is handled by middleware on each request
    // This function is kept for compatibility but does nothing
    // The middleware automatically validates and refreshes the JWT
  };

  // Show loading state until we've checked session
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        isLoggedIn: !!user,
        isLoaded,
        isSessionExpired,
        setUser,
        setSessionId,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
