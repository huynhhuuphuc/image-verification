import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginScreen from "./screens/LoginScreen";
import Sidebar from "./components/Sidebar";
import { UserFirebase } from "./types";
import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import AddProductScreen from "./screens/AddProductScreen";
import EmployeeManagementScreen from "./screens/EmployeeManagementScreen";
import { useNavigate } from "react-router-dom";

const AppRoutes: React.FC<{
  onLogin: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onResetSessionExpired: () => void;
  isSessionExpired: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: UserFirebase | null;
  isSidebarOpen: boolean;
}> = ({
  onLogin,
  onLogout,
  onToggleSidebar,
  onCloseSidebar,
  onResetSessionExpired,
  isSessionExpired,
  isAuthenticated,
  isAdmin,
  currentUser,
  isSidebarOpen,
}) => {
  const navigate = useNavigate();

  const handleOk = () => {
    onResetSessionExpired();
    navigate("/login");
  };

  return (
    <>
      {isSessionExpired && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Session Expired
              </h2>
              <p className="text-gray-600 mb-6">
                Your session has expired. Please log in again.
              </p>
              <div className="text-right">
                <button
                  onClick={handleOk}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <Routes>
        {/* Login route - redirect to dashboard if authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen onLogin={onLogin} />
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
                    onClick={onCloseSidebar}
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
                    onLogout={onLogout}
                    onToggle={onToggleSidebar}
                    isOpen={isSidebarOpen}
                    onClose={onCloseSidebar}
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
                          onToggleSidebar={onToggleSidebar}
                        />
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <ProductListScreen onToggleSidebar={onToggleSidebar} />
                      }
                    >
                      <Route
                        path="/products/:id"
                        element={
                          <ProductDetailScreen
                            onToggleSidebar={onToggleSidebar}
                          />
                        }
                      />
                    </Route>
                    <Route
                      path="/products/add"
                      element={
                        <AddProductScreen onToggleSidebar={onToggleSidebar} />
                      }
                    />
                    <Route
                      path="/employees"
                      element={
                        isAdmin ? (
                          <EmployeeManagementScreen
                            onToggleSidebar={onToggleSidebar}
                          />
                        ) : (
                          <Navigate to="/dashboard" replace />
                        )
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
    </>
  );
};

export default AppRoutes;
