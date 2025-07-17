import {Route, Routes} from "react-router-dom";
import SignupPage from "../pages/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import NotFoundPage from "../pages/NotFound.jsx";
import { useState } from "react";
import AuthContext from "../utils/AuthContext.js";

function App(){
     const [loggedIn, setLoggedIn] = useState(true);
  return <>
        <AuthContext.Provider value = {{loggedIn, setLoggedIn}}>
            <Routes>
            <Route path = "/" element = {<SignupPage />}></Route>
            <Route path = "/login" element = {<LoginPage />}></Route>
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