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

function App(){
     const [loggedIn, setLoggedIn] = useState(false);
     const [checkingAuth, setCheckingAuth] = useState(true);
     const [authUser, setAuthUser] = useState(null);

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


  return <>
        <AuthContext.Provider value = {{loggedIn, setLoggedIn, checkingAuth, authUser}}>
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