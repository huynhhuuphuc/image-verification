import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import Sidebar from './components/Sidebar';
import { mockUser } from './data/mockData';
import { User } from './types';
import HomeScreen from './screens/HomeScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import EmployeeManagementScreen from './screens/EmployeeManagementScreen';

function App() {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  // Initialize user data from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser(mockUser);

    // Persist authentication state to localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Clear authentication state from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Add a loading state to prevent flash of login screen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to prevent flash of login screen while checking localStorage
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
          <p className="text-gray-600 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="main-layout bg-gray-50">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="mobile-overlay sm:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          mobile-sidebar sm:relative sm:translate-x-0 sm:w-64 sm:flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : 'closed'}
        `}>
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<HomeScreen user={currentUser} onToggleSidebar={toggleSidebar} />} />
            <Route path="/products" element={<ProductListScreen onToggleSidebar={toggleSidebar} />} />
            <Route path="/products/:id" element={<ProductDetailScreen onToggleSidebar={toggleSidebar} />} />
            <Route path="/employees" element={<EmployeeManagementScreen onToggleSidebar={toggleSidebar} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 