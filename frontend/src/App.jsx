import NavBar from "./components/NavBar.jsx";
import {Link,Route, Routes} from "react-router-dom";
import SignupPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
function App(){
  return <div>
        <NavBar/>
        <ul>
        <li> <Link to = "/settings">Settings</Link></li>
        <li><Link to = "/login">Login</Link></li>
        <li><Link to = "/">Home</Link></li>
        <li><Link to = "/profile">Profile</Link></li>
        <li><Link to = "/chat">chat</Link></li>
        </ul>
        <Routes>
            <Route path = "/" element = {<SignupPage />}></Route>
            <Route path = "/login" element = {<LoginPage />}></Route>
            <Route path = "/settings" element = {<SettingsPage />}></Route>

            <Route element = {<ProtectedRoute/>}>
                  <Route path = "/chat" element = {<ChatPage />}></Route>
                  <Route path = "/profile" element = {<ProfilePage />}></Route>
            </Route>
        </Routes>
      </div>
}

export default App;