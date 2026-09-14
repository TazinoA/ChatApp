import NavBar from "../components/NavBar.jsx";
import "../styles/profile.css";
import { Camera, Loader2, User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { useState, useContext } from "react";
import AuthContext from "../utils/AuthContext.js";
import { updateProfilePic } from "../utils/api.js";

export default function ProfilePage() {
  const { authUser, setAuthUser, isConnected } = useContext(AuthContext);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMessage("");
    setSuccessMessage("");

    // 1. Client-side validation: MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    // 2. Client-side validation: Size limit (<= 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image file size must be less than 2MB.");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          const result = await updateProfilePic({ profilePic: base64Image });

          if (result && result.user) {
            setAuthUser((prev) => ({ ...prev, ...result.user }));
            setSuccessMessage("Profile photo updated successfully!");
          } else {
            setSuccessMessage("Profile photo updated successfully!");
          }
        } catch (err) {
          console.error("Profile update error:", err);
          setErrorMessage(err.response?.data?.message || "Failed to update profile photo.");
        } finally {
          setIsUpdatingProfile(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage("Failed to read image file.");
        setIsUpdatingProfile(false);
      };
    } catch (err) {
      console.error("File upload error:", err);
      setErrorMessage("Failed to upload image.");
      setIsUpdatingProfile(false);
    }
  };

  const formattedDate = authUser?.date_joined
    ? new Date(authUser.date_joined).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="app-page-layout">
      <NavBar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Your Profile</h2>
            <p>Manage your account settings and picture</p>
          </div>

          {errorMessage && <div className="alert-banner error">{errorMessage}</div>}
          {successMessage && <div className="alert-banner success">{successMessage}</div>}

          <div className="profile-img-section">
            <div className="profile-img-wrapper">
              <img
                src={authUser?.profile_pic || "/avatar.png"}
                className="profile-img"
                alt="Profile"
              />
              <label htmlFor="avatar-upload" className="camera-icon-btn" role="button" tabIndex={0}>
                {isUpdatingProfile ? (
                  <Loader2 className="animate-spin w-5 h-5 text-white" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </label>
              <input
                type="file"
                name="avatar-upload"
                id="avatar-upload"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </div>
            <p className="img-upload-hint">
              {isUpdatingProfile
                ? "Uploading your new avatar..."
                : "Click the camera icon to upload a photo (Max 2MB)"}
            </p>
          </div>

          <div className="profile-fields">
            <div className="field-group">
              <label>
                <User className="field-icon" /> Full Name
              </label>
              <input type="text" value={authUser?.name || ""} disabled readOnly />
            </div>

            <div className="field-group">
              <label>
                <Mail className="field-icon" /> Email Address
              </label>
              <input type="email" value={authUser?.email || ""} disabled readOnly />
            </div>

            <div className="account-meta">
              <h3>Account Metadata</h3>
              <div className="meta-row">
                <span>
                  <Calendar className="meta-icon" /> Member Since:
                </span>
                <span className="meta-val">{formattedDate}</span>
              </div>
              <div className="meta-row">
                <span>
                  <ShieldCheck className="meta-icon" /> Socket Connection:
                </span>
                <span className={`status-badge ${isConnected ? "connected" : "disconnected"}`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
