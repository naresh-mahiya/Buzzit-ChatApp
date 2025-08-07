import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route 
          path="/" 
          element={
            authUser ? (
              authUser.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <HomePage />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route 
          path="/profile" 
          element={
            authUser ? (
              authUser.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <ProfilePage />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            authUser && authUser.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
