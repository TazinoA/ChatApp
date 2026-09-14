import { useState, useContext, useEffect } from "react";
import { login, verifyToken, validateInput, googleSignupOrLogin } from "../utils/auth_handler";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import Loading from "../components/Loading";
import { GoogleLogin } from "@react-oauth/google";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import "../styles/login.css";

function LoginPage() {
  const { setLoggedIn, setAuthUser, checkingAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(checkingAuth);
  }, [checkingAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      setSubmitError("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });
      setLoading(false);

      if (response.status === 200) {
        const session = await verifyToken();
        if (!session.isValid) {
          setSubmitError("We couldn't start your session. Please try signing in again.");
          return;
        }

        setAuthUser(session.user);
        setLoggedIn(true);
        navigate("/chat");
      } else {
        const msg = response.response?.data?.message || "Invalid email or password";
        setSubmitError(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setSubmitError("Login failed. Please try again.");
    }
  };

  const handleGoogleOauth = async (credentialsResponse) => {
    setLoading(true);

    const result = await googleSignupOrLogin(credentialsResponse);

    setLoading(false);

    if (result.status === 200) {
      const session = await verifyToken();
      if (!session.isValid) {
        setSubmitError("We couldn't start your session. Please try signing in again.");
        return;
      }

      setAuthUser(session.user);
      setLoggedIn(true);
      navigate("/chat");
    } else {
      setSubmitError(result.response?.data?.message || result.data?.message || "Google login failed");
    }
  };

  return (
    <>
      {loading ? (
        <Loading variant="dots" text="Signing you in..." />
      ) : (
        <div className="sign-in-container">
          <div className="sign-in-board">
            <div className="app-logo-badge">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3>Welcome to ChatApp</h3>
            <p className="description">Log in to your account to continue</p>

            {submitError && <div className="error-msg-box">{submitError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  className={`login-input ${emailError ? "error" : ""}`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    const error = validateInput(e.target.name, e.target.value);
                    if (error === "valid") {
                      setEmailError("");
                    }
                  }}
                  value={email}
                  onBlur={(e) => {
                    const error = validateInput(e.target.name, e.target.value);
                    if (error !== "valid") {
                      setEmailError("Please enter a valid email address");
                    }
                  }}
                  required
                />
                {emailError && <p className="field-error-text">{emailError}</p>}
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>
                </div>

                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="login-input password-input"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle login"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="sign-in-btn">
                Sign in
              </button>
            </form>

            <div className="continue-with">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>

            <div className="alt-sign-in">
              <GoogleLogin
                onSuccess={handleGoogleOauth}
                onError={() => {
                  console.log("Login Failed");
                  setSubmitError("Google sign-in failed");
                }}
              />
            </div>

            <p className="has-account">
              Don't have an account? <Link to="/">Sign up</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
