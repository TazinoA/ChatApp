import {Link} from "react-router-dom";

function NavBar(){
    return <>
    <header>
        <div className="header-left-section">
            <img src = "https://cdn-icons-png.flaticon.com/128/8794/8794966.png"/>
            <h2>ChatApp</h2>
        </div>
        <div className="header-right-section">
                <Link to ="/settings" className="nav-link"><img src = "https://cdn-icons-png.flaticon.com/128/2040/2040504.png"/> Settings</Link>
                <Link to ="/profile" className="nav-link"><img src = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"/>Profile</Link>
                <Link className="nav-link"><img src = "https://cdn-icons-png.flaticon.com/128/15604/15604005.png"/>Logout</Link>
        </div>
    </header>
    </>
}

export default NavBar;