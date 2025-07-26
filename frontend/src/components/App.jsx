import {Route, Routes, Navigate} from "react-router-dom";
import SignupPage from "../pages/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import NotFoundPage from "../pages/NotFound.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import { useState, useEffect } from "react";
import AuthContext from "../utils/AuthContext.js";
import { verifyToken } from "../utils/auth_handler.js";
import socket from "../utils/socket.js";

function App(){
     const [isConnected, setIsConnected] = useState(socket.connected);
     const [loggedIn, setLoggedIn] = useState(false);
     const [checkingAuth, setCheckingAuth] = useState(true);
     const [authUser, setAuthUser] = useState(null);
     const [showPlaceholder, setShowPlaceholder] = useState(true);
     const [selectedChat, setSelectedChat] = useState(null);

 

     useEffect(() => {
    const checkToken = async () => {
    let result;
    try {
      result = await verifyToken();
      setLoggedIn(result.isValid);
    } catch (err) {
      console.error("Token verification failed:", err);
      setLoggedIn(false);
    }finally{
      setCheckingAuth(false);
      setAuthUser(result.user);
    }
  };
  checkToken();
}, []);

useEffect(() =>{
  if(!authUser) return;

  function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

  socket.connect();
  
  socket.on("connect", onConnect);
  socket.on("disconnect",onDisconnect);

  return () =>{
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
  }


}, [authUser]);

  

useEffect(() => {
  const storedChat = localStorage.getItem("selectedChat");
  if (storedChat) {
    setSelectedChat(JSON.parse(storedChat));
  }
}, []);


  return <>
        <AuthContext.Provider value = {{loggedIn, setLoggedIn, checkingAuth, authUser, showPlaceholder, setShowPlaceholder, selectedChat, setSelectedChat, socket}}>
            <Routes>
            <Route path = "/" element = {loggedIn ? <Navigate to = "/chat"/> : <SignupPage />}></Route>
            <Route path = "/login" element = {loggedIn ? <Navigate to = "/chat"/> : <LoginPage />}></Route>
            <Route path = "/forgot-password" element = {<ForgotPassword/>}></Route>
            <Route path = "*" element = {<NotFoundPage/>}/>
            <Route element = {<ProtectedRoute/>}>
                  <Route path = "/chat" element = {<ChatPage />}></Route>
                  <Route path = "/profile" element = {<ProfilePage />}></Route>
            </Route>
        </Routes>
        </AuthContext.Provider>
      </>
}

export default App;