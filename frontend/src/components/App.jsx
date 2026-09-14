import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignupPage from "../pages/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import { useState, useEffect } from "react";
import AuthContext from "../utils/AuthContext.js";
import { verifyToken } from "../utils/auth_handler.js";
import socket from "../utils/socket.js";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(() => {
    try {
      const stored = localStorage.getItem("selectedChat");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && !parsed.placeholder && parsed.contactId) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading stored chat:", e);
    }
    return null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await verifyToken();
        if (result && result.isValid) {
          setLoggedIn(true);
          setAuthUser(result.user);
        } else {
          setLoggedIn(false);
          setAuthUser(null);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        setLoggedIn(false);
        setAuthUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!authUser) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetOnlineUsers(userMapOrArray) {
      if (Array.isArray(userMapOrArray)) {
        setOnlineUserIds(userMapOrArray);
      } else if (userMapOrArray && typeof userMapOrArray === "object") {
        setOnlineUserIds(Object.keys(userMapOrArray).map(Number));
      } else {
        setOnlineUserIds([]);
      }
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("getOnlineUsers", onGetOnlineUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("getOnlineUsers", onGetOnlineUsers);
    };
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        checkingAuth,
        authUser,
        setAuthUser,
        selectedChat,
        setSelectedChat,
        socket,
        isConnected,
        onlineUserIds,
        theme,
        toggleTheme,
      }}
    >
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/chat" /> : <SignupPage />} />
        <Route path="/login" element={loggedIn ? <Navigate to="/chat" /> : <LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage key={location.pathname} />} />
          <Route path="/profile" element={<ProfilePage key={location.pathname} />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
