import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp, validateInput, googleSignupOrLogin, verifyToken } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";
import Loading from "../components/Loading";
import { GoogleLogin } from "@react-oauth/google";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import "../styles/signup.css";

function SignUpPage() {
  const { setLoggedIn, setAuthUser, checkingAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(checkingAuth);
  }, [checkingAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setSubmitError("Please fix all errors before submitting");
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError("Passwords must match");
      return;
    }

    setLoading(true);

    try {
      const response = await signUp({
        name,
        email,
        password,
        confirmPassword,
      });

      setLoading(false);

      if (response.status === 200 || response.status === 201) {
        const session = await verifyToken();
        if (!session.isValid) {
          setSubmitError("We couldn't start your session. Please try signing up again.");
          return;
        }

        setAuthUser(session.user);
        setLoggedIn(true);
        navigate("/chat");
      } else {
        const msg = response.response?.data?.message || "Signup failed";
        setSubmitError(msg);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);
      setSubmitError("Signup failed. Please try again.");
    }
  };

  const handleGoogleOauth = async (credentialsResponse) => {
    setLoading(true);

    const result = await googleSignupOrLogin(credentialsResponse);

    setLoading(false);

    if (result.status === 200) {
      const session = await verifyToken();
      if (!session.isValid) {
        setSubmitError("We couldn't start your session. Please try signing up again.");
        return;
      }

      setAuthUser(session.user);
      setLoggedIn(true);
      navigate("/chat");
    } else {
      setSubmitError(result.response?.data?.message || result.data?.message || "Google signup failed");
    }
  };

  return (
    <>
      {loading ? (
        <Loading variant="dots" text="Signing you up..." />
      ) : (
        <div className="sign-up-container">
          <div className="sign-up-board">
            <div className="app-logo-badge">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3>Welcome to ChatApp</h3>
            <p className="description">Sign up to create your account and continue</p>
            {submitError && <div className="error-msg-box">{submitError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-data">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) {
                      const error = validateInput(e.target.name, e.target.value);
                      setNameError(error === "valid" ? "" : error);
                    }
                  }}
                  required
                  minLength={3}
                  className={nameError ? "error" : ""}
                  onBlur={(e) => {
                    const error = validateInput(e.target.name, name);
                    if (error !== "valid") {
                      setNameError(error);
                    } else {
                      setNameError("");
                    }
                  }}
                />
                {nameError && <p className="field-error-text">{nameError}</p>}
              </div>

              <div className="form-data">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) {
                      const error = validateInput(e.target.name, e.target.value);
                      setEmailError(error === "valid" ? "" : error);
                    }
                  }}
                  className={emailError ? "error" : ""}
                  required
                  onBlur={(e) => {
                    const error = validateInput(e.target.name, email);
                    if (error !== "valid") {
                      setEmailError(error);
                    } else {
                      setEmailError("");
                    }
                  }}
                />
                {emailError && <p className="field-error-text">{emailError}</p>}
              </div>

              <div className="form-data">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) {
                        const error = validateInput(e.target.name, e.target.value);
                        setPasswordError(error === "valid" ? "" : error);
                      }
                    }}
                    required
                    autoComplete="off"
                    minLength={8}
                    className={`password-input ${passwordError ? "error" : ""}`}
                    onBlur={(e) => {
                      const error = validateInput(e.target.name, password);
                      if (error !== "valid") {
                        setPasswordError(error);
                      } else {
                        setPasswordError("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="field-error-text">{passwordError}</p>}
              </div>

              <div className="form-data">
                <label htmlFor="confirm">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm"
                    name="confirm"
                    value={confirmPassword}
                    autoComplete="off"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      const error = validateInput(e.target.name, e.target.value, password);
                      setConfirmPasswordError(error === "valid" ? "" : error);
                    }}
                    required
                    className={`password-input ${confirmPasswordError ? "error" : ""}`}
                    onBlur={(e) => {
                      const error = validateInput(e.target.name, e.target.value, password);
                      if (error !== "valid") {
                        setConfirmPasswordError(error);
                      } else {
                        setConfirmPasswordError("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="field-error-text">{confirmPasswordError}</p>}
              </div>

              <button type="submit" className="sign-up-btn">
                Sign Up
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
                  setSubmitError("Google sign-up failed");
                }}
              />
            </div>

            <p className="has-account">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpPage;
