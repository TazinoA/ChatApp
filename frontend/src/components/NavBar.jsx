import {Link, useNavigate} from "react-router-dom";
import { logOut } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";
import { useContext } from "react";

function NavBar(){
    const {setLoggedIn, setSelectedChat, setShowPlaceholder, socket} = useContext(AuthContext);
    const navigate = useNavigate()
    return <>
    <header>
        <div className="header-left-section">
            <img src = "https://cdn-icons-png.flaticon.com/128/8794/8794966.png"/>
            <h2>ChatApp</h2>
        </div>
        <div className="header-right-section">
                <Link to ="/chat" className="nav-link"><img src = "https://cdn-icons-png.flaticon.com/128/1370/1370907.png"/> Chat</Link>
                <Link to ="/profile" className="nav-link"><img src = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"/>Profile</Link>
                <Link className="nav-link" onClick={async () => {
                    await logOut();
                    setLoggedIn(false);
                    socket.disconnect();
                    setSelectedChat(null);
                    setShowPlaceholder(true);
                    navigate("/login");
                }}><img src = "https://cdn-icons-png.flaticon.com/128/15604/15604005.png"/>Logout</Link>
        </div>
    </header>
    </>
}

export default NavBar;