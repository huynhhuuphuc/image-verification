import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import toast from "react-hot-toast";
import { UserFirebase } from "./types";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./src/firebase/firebase";
// import { getCookie, removeCookie, setCookie } from "./src/utils/cookie";
import {
  ACCESS_TOKEN,
  CURRENT_USER,
  REFRESH_TOKEN,
} from "./src/constants/cookie";
import { currentUser as currentUserApi } from "./src/api/apiServer/apiUser";
import { useIsAdmin } from "./hooks/useIsAdmin";
import { eventBus } from "./src/utils/eventBus";
import AppRoutes from "./AppRoutes.tsx";
import GlobalToastProvider from "./GlobalToastProvider.tsx";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const user = localStorage.getItem(CURRENT_USER);
    return !!(token && user);
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data from cookie
  const [currentUser, setCurrentUser] = useState<UserFirebase | null>(() => {
    const savedUser = localStorage.getItem(CURRENT_USER);
    console.log("Current user:", JSON.parse(savedUser || "{}"));
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const isAdmin = useIsAdmin(currentUser);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const user = localStorage.getItem(CURRENT_USER);

      const shouldBeAuthenticated = !!(token && user);

      if (shouldBeAuthenticated !== isAuthenticated) {
        setIsAuthenticated(shouldBeAuthenticated);

        if (!shouldBeAuthenticated) {
          setCurrentUser(null);
        } else if (user && !currentUser) {
          setCurrentUser(JSON.parse(user));
        }
      }

      if (shouldBeAuthenticated && token && user) {
        try {
          const response = await currentUserApi();

          const updatedUser = {
            ...JSON.parse(user),
            apiUserData: response,
          };
          setCurrentUser(updatedUser);
          localStorage.setItem(CURRENT_USER, JSON.stringify(updatedUser));
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
    };

    checkAuthentication();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthentication();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => setIsSessionExpired(true);
    eventBus.on("sessionExpired", handleSessionExpired);

    return () => {
      eventBus.off("sessionExpired", handleSessionExpired);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user as unknown as UserFirebase;

      localStorage.setItem(ACCESS_TOKEN, user.accessToken);
      localStorage.setItem(REFRESH_TOKEN, user.stsTokenManager.refreshToken);

      const response = await currentUserApi();

      const streamlinedUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        accessToken: user.accessToken,
        stsTokenManager: {
          accessToken: user.stsTokenManager.accessToken,
          refreshToken: user.stsTokenManager.refreshToken,
          expirationTime: user.stsTokenManager.expirationTime,
        },
        apiUserData: response,
      };
      setCurrentUser(streamlinedUser as UserFirebase);
      localStorage.setItem(CURRENT_USER, JSON.stringify(streamlinedUser));

      toast.success("Đăng nhập thành công");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);

    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(CURRENT_USER);
  };

  const handleResetSessionExpired = () => {
    setIsSessionExpired(false);
    handleLogout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    // Small delay to prevent flash of login screen while checking cookie
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen briefly to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalToastProvider />
      <Router>
        <AppRoutes
          onLogin={handleLogin}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          onCloseSidebar={closeSidebar}
          onResetSessionExpired={handleResetSessionExpired}
          isSessionExpired={isSessionExpired}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          isAdmin={isAdmin}
          isSidebarOpen={isSidebarOpen}
        />
      </Router>
    </>
  );
};

export default App;
