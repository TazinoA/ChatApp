import NavBar from "../components/NavBar.jsx";
import "../styles/profile.css";
import { Camera } from 'lucide-react';
import {useState, useContext} from "react";
import AuthContext from "../utils/AuthContext.js";
import { updateProfilePic } from "../utils/utils.js";

export default function ProfilePage(){
    const {authUser} = useContext(AuthContext);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdatingProfile(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePic: base64Image });
    };
    setIsUpdatingProfile(false);
  };

    return <>
    
    <NavBar/>
    <div className="profile-container">
        <div className="profile-board">

            <h3>Profile</h3>
            <p>Your profile information</p>

            <div className="profile-img-container">
                <img src= {selectedImg || authUser.profile_pic || "/avatar.png"} className="profile-img" alt="Profile" />
                <label htmlFor="avatar-upload" className="camera-icon" role="button" tabIndex={0}>
                    <Camera />
                </label>
                <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange = {handleImageUpload}
                />
            </div>
            <p>{isUpdatingProfile ? "Uploading...": "Click the camera icon to update your photo"}</p>

            <div className="label">
                <img src = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"/>
                <label htmlFor = "full-name">Full Name</label>
            </div>

            <input name = "full-name" type = "text" value = {authUser.name} disabled></input>

            <div className="label">
                <img src = "https://cdn-icons-png.flaticon.com/128/646/646094.png"/>
                <label htmlFor = "email">Email</label>
            </div>

            <input name = "email" type = "email" value = {authUser.email} disabled></input>

            <div className="account-info">
                <h4>Account information</h4>
                <p>Member since: <span>{authUser.date_joined.split("T")[0]}</span></p>
                <hr/>
                <p>Account status: <span>Active</span></p>
            </div>
            
        </div>
    </div>

    </>
}