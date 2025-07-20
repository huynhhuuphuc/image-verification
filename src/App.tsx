import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import LoginScreen from "./screens/LoginScreen";
import Sidebar from "./components/Sidebar";
import { User } from "./types";
import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import AddProductScreen from "./screens/AddProductScreen";
import EmployeeManagementScreen from "./screens/EmployeeManagementScreen";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./src/firebase/firebase";
import { getCookie, removeCookie, setCookie } from "./src/utils/cookie";
import {
  ACCESS_TOKEN,
  CURRENT_USER,
  REFRESH_TOKEN,
} from "./src/constants/cookie";

const App: React.FC = () => {
  // Initialize authentication state from cookie - check both token and user
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getCookie(ACCESS_TOKEN);
    const user = getCookie(CURRENT_USER);
    return !!(token && user);
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data from cookie
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = getCookie(CURRENT_USER);
    console.log("Current user:", savedUser);
    return savedUser || null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = getCookie(ACCESS_TOKEN);
      const user = getCookie(CURRENT_USER);
      const shouldBeAuthenticated = !!(token && user);

      if (shouldBeAuthenticated !== isAuthenticated) {
        setIsAuthenticated(shouldBeAuthenticated);

        if (!shouldBeAuthenticated) {
          setCurrentUser(null);
        } else if (user && !currentUser) {
          setCurrentUser(user);
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

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user as unknown as User;
      setCurrentUser(user as unknown as User);
      setIsAuthenticated(true);
      toast.success("Đăng nhập thành công");

      setCookie(ACCESS_TOKEN, user.accessToken);
      setCookie(REFRESH_TOKEN, user.stsTokenManager.refreshToken);
      setCookie(CURRENT_USER, user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);

    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    removeCookie(CURRENT_USER);
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
    <Router>
      <Routes>
        {/* Login route - redirect to dashboard if authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen onLogin={handleLogin} />
            )
          }
        />

        {/* Protected routes - redirect to login if not authenticated */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="main-layout bg-gray-50">
                {/* Mobile overlay */}
                {isSidebarOpen && (
                  <div
                    className="mobile-overlay sm:hidden"
                    onClick={closeSidebar}
                  />
                )}

                {/* Sidebar */}
                <div
                  className={`
                  mobile-sidebar sm:relative sm:translate-x-0 sm:w-64 sm:flex-shrink-0
                  ${isSidebarOpen ? "translate-x-0" : "closed"}
                `}
                >
                  <Sidebar
                    user={currentUser}
                    onLogout={handleLogout}
                    onToggle={toggleSidebar}
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                  />
                </div>

                {/* Main content */}
                <main className="main-content">
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <HomeScreen
                          user={currentUser}
                          onToggleSidebar={toggleSidebar}
                        />
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <ProductListScreen onToggleSidebar={toggleSidebar} />
                      }
                    />
                    <Route
                      path="/products/add"
                      element={
                        <AddProductScreen onToggleSidebar={toggleSidebar} />
                      }
                    />
                    <Route
                      path="/products/:id"
                      element={
                        <ProductDetailScreen onToggleSidebar={toggleSidebar} />
                      }
                    />
                    <Route
                      path="/employees"
                      element={
                        <EmployeeManagementScreen
                          onToggleSidebar={toggleSidebar}
                        />
                      }
                    />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            border: "1px solid #e1e5e9",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
