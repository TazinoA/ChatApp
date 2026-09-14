import { Link, useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";
import { useContext } from "react";
import { MessageSquare, User, LogOut, Sun, Moon } from "lucide-react";

function NavBar() {
  const { setLoggedIn, setAuthUser, setSelectedChat, socket, theme, toggleTheme } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setLoggedIn(false);
      setAuthUser(null);
      setSelectedChat(null);
      localStorage.removeItem("selectedChat");
      if (socket && socket.connected) {
        socket.disconnect();
      }
      navigate("/login");
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-icon-wrapper">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <h1 className="brand-title">ChatApp</h1>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <nav className="nav-links">
          <Link
            to="/chat"
            className={`nav-link ${location.pathname === "/chat" ? "active" : ""}`}
          >
            <MessageSquare className="nav-icon" />
            <span>Chat</span>
          </Link>

          <Link
            to="/profile"
            className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <User className="nav-icon" />
            <span>Profile</span>
          </Link>

          <button type="button" className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
