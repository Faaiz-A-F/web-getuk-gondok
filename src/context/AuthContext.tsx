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

// Session cookie name (must match the one in session.ts)
const SESSION_COOKIE_NAME = "session";
const SESSION_STORAGE_KEY = "session_id";
const USER_STORAGE_KEY = "user";
// Session refresh interval in milliseconds (30 minutes)
const SESSION_REFRESH_INTERVAL = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

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

  // Function to set session cookie
  const setSessionCookie = useCallback((id: string) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${SESSION_COOKIE_NAME}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  }, []);

  // Function to delete session cookie
  const deleteSessionCookie = useCallback(() => {
    if (typeof document === "undefined") return;
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }, []);

  // Refresh session from server
  const refreshSessionFromServer = useCallback(async () => {
    const currentSessionId = sessionId || getSessionCookie();
    if (!currentSessionId) return;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "validate",
          sessionId: currentSessionId,
        }),
      });

      const data = await response.json();

      if (data.valid && data.user) {
        setUserState(data.user);
        setSessionIdState(currentSessionId);
        setIsSessionExpired(false);
        // Update cookie with fresh expiration
        setSessionCookie(currentSessionId);
      } else {
        // Session invalid or expired
        setUserState(null);
        setSessionIdState(null);
        setIsSessionExpired(true);
        deleteSessionCookie();
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  }, [sessionId, getSessionCookie, setSessionCookie, deleteSessionCookie]);

  // Validate session on mount
  useEffect(() => {
    const validateSessionOnLoad = async () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      const cookieSessionId = getSessionCookie();

      // Use cookie session ID if available, otherwise use stored one
      const currentSessionId = cookieSessionId || storedSessionId;

      if (currentSessionId) {
        setSessionIdState(currentSessionId);
        await refreshSessionFromServer();
      } else if (storedUser) {
        // No valid session but has stored user - clear it
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }

      setIsLoaded(true);
    };

    validateSessionOnLoad();
  }, [getSessionCookie, refreshSessionFromServer]);

  // Derive isLoggedIn from user state
  const isLoggedIn = !!user;

  // Set up periodic session refresh
  useEffect(() => {
    if (isLoggedIn && sessionId) {
      // Refresh session every 30 minutes
      refreshIntervalRef.current = setInterval(() => {
        refreshSessionFromServer();
      }, SESSION_REFRESH_INTERVAL);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [isLoggedIn, sessionId, refreshSessionFromServer]);

  // Track user activity to refresh session
  useEffect(() => {
    if (!isLoggedIn) return;

    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      const now = Date.now();
      // Only refresh if more than 5 minutes since last activity
      if (now - lastActivityRef.current > 5 * 60 * 1000) {
        lastActivityRef.current = now;
        refreshSessionFromServer();
      }
    };

    // Add activity listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, refreshSessionFromServer]);

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
      setSessionCookie(newSessionId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      deleteSessionCookie();
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

    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };

  const refreshSession = async () => {
    await refreshSessionFromServer();
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
