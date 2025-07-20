import {Route, Routes} from "react-router-dom";
import SignupPage from "../pages/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import NotFoundPage from "../pages/NotFound.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import { useState, useEffect } from "react";
import AuthContext from "../utils/AuthContext.js";
import { verifyToken } from "../utils/auth_handler.js";

function App(){
     const [loggedIn, setLoggedIn] = useState(false);

     useEffect(() => {
  const checkToken = async () => {
    try {
      const result = await verifyToken();
      console.log(result);

      if (result.isValid) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Token verification failed:", err.error);
      setLoggedIn(false);
    }
  };

  checkToken();
}, []);


  return <>
        <AuthContext.Provider value = {{loggedIn, setLoggedIn}}>
            <Routes>
            <Route path = "/" element = {<SignupPage />}></Route>
            <Route path = "/login" element = {<LoginPage />}></Route>
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