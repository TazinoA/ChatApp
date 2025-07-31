import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import SignupPage from "../pages/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
// import NotFoundPage from "../pages/NotFound.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import { useState, useEffect } from "react";
import AuthContext from "../utils/AuthContext.js";
import { verifyToken } from "../utils/auth_handler.js";
import socket from "../utils/socket.js";

function App(){
     const [isConnected, setIsConnected] = useState(socket.connected);
     const [userSocketMap, setUserSocketMap] = useState(null);
     const [loggedIn, setLoggedIn] = useState(false);
     const [checkingAuth, setCheckingAuth] = useState(true);
     const [authUser, setAuthUser] = useState(null);
     const [showPlaceholder, setShowPlaceholder] = useState(true);
     const [selectedChat, setSelectedChat] = useState({placeholder:true});
     const location = useLocation();


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
      socket.emit("register", authUser.id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function fetchOnlineUsers(socketMap){
        setUserSocketMap(socketMap);
    }

  socket.connect();
  
  socket.on("connect", onConnect);
  socket.on("getOnlineUsers", fetchOnlineUsers);
  socket.on("disconnect",onDisconnect);

  return () =>{
    socket.off('connect', onConnect);
    socket.off("getOnlineUsers", fetchOnlineUsers);
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
        <AuthContext.Provider value = {{loggedIn, setLoggedIn, checkingAuth, authUser, showPlaceholder, setShowPlaceholder, selectedChat, setSelectedChat, socket, isConnected, userSocketMap}}>
            <Routes>
            <Route path = "/" element = {loggedIn ? <Navigate to = "/chat"/> : <SignupPage />}></Route>
            <Route path = "/login" element = {loggedIn ? <Navigate to = "/chat"/> : <LoginPage />}></Route>
            <Route path = "/forgot-password" element = {<ForgotPassword/>}></Route>
            {/* <Route path = "*" element = {<NotFoundPage/>}/> */}
            <Route element = {<ProtectedRoute/>}>
                    {/* add key so component remounts on navigation, to update socket map */}
                  <Route path="/chat" element={<ChatPage key={location.pathname} />} />
                  <Route path="/profile" element={<ProfilePage key={location.pathname} />} />
            </Route>
        </Routes>
        </AuthContext.Provider>
      </>
}

export default App;