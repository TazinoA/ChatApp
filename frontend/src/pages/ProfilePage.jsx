import NavBar from "../components/NavBar.jsx";
import "../styles/profile.css";

export default function ProfilePage(){

    return <>
    
    <NavBar/>
    <div className="profile-container">
        <div className="profile-board">

            <h3>Profile</h3>
            <p>Your profile information</p>
            <img src = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png" className="profile-img"/>
            <p>Click the camera icon to update your photo</p>

            <div className="label">
                <img src = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"/>
                <label htmlFor = "full-name">Full Name</label>
            </div>

            <input name = "full-name" type = "text" value = "Tazino Afiemo" disabled></input>

            <div className="label">
                <img src = "https://cdn-icons-png.flaticon.com/128/646/646094.png"/>
                <label htmlFor = "email">Email</label>
            </div>

            <input name = "email" type = "email" value = "afiemotazino3@gmail.com" disabled></input>

            <div className="account-info">
                <h4>Account information</h4>
                <p>Member since: <span>1st february 2002</span></p>
                <hr/>
                <p>Account status: <span>Active</span></p>
            </div>
            
        </div>
    </div>

    </>
}