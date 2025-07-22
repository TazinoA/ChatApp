import { useState, useContext, useEffect } from "react";
import { login } from "../utils/auth_handler";
import { useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import { validateInput } from "../utils/auth_handler";
import Loading from "../components/Loading";
import "../styles/login.css";

function LoginPage(){
    const { loggedIn,setLoggedIn, checkingAuth} = useContext(AuthContext);
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

 useEffect(() => {
            setLoading(checkingAuth);
        } ,[checkingAuth])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(emailError){
            setSubmitError("Please fix all errors before submitting");
            return;
        }

        setLoading(true);

        const result = await handleClick(email, password);

        setLoading(false);

        if(result.success){
            setLoggedIn(true);
            navigate("/chat");
        }else{
            setSubmitError(result.message);
        }
    }

    return <>
        {loading ?(<Loading variant="dots" text="Signing you in..." />): (
       <div className = "sign-in-container">
           <div className = "sign-in-board">

                <img src = "https://cdn-icons-png.flaticon.com/128/8794/8794966.png"/>
                <h3>Welcome to ChatApp</h3>
                <p className = "description">Log in to your account to continue</p>

                <p className = {`error-msg ${submitError ? "" : "hidden"}`}>{submitError}</p>

               <form onSubmit={handleSubmit}>
                <label htmlFor = "email">Email</label>
                <input 
                    type = "email"
                    placeholder="name@example.com"
                    name = "email" className={`login-input ${emailError ? "error" : ""}`}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        const error = validateInput(e.target.name, e.target.value);
                        if(error === "valid"){
                            setEmailError("")
                        }
                    }}
                    value = {email}
                    onBlur = {
                        (e) => {
                            const error = validateInput(e.target.name, e.target.value)
                            if(error !== "valid"){
                                setEmailError("Please enter a valid email address")
                            }
                        }
                    }
                    required
                />
                <p className = {`error-msg ${emailError ? "" : "hidden"}`}>{emailError}</p>
               
                <div className = "password">
                    <label htmlFor = "password">Password</label>
                    <a className = "forgot-password" href = "/forgot-password">Forgot Password?</a>
                </div>

                <div className="password-input-container">
                    <input
                        type={showPassword ? "text": "password"}
                        name = "password"
                        className="login-input password-input"
                        onChange={e => setPassword(e.target.value)}
                        value = {password}
                        required
                    />
                    <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <img src = {showPassword ? "https://cdn-icons-png.flaticon.com/128/709/709612.png": "https://cdn-icons-png.flaticon.com/128/10898/10898993.png"}/>
                    </button>
                </div>

                <button className = "sign-in-btn">Sign in</button>
               </form>

                <div className="continue-with">
                    <span></span>
                    <p>OR CONTINUE WITH</p>
                    <span></span>
                </div>

                <div className="alt-sign-in">
                    <button className="google"> <img src = "https://www.gstatic.com/marketing-cms/assets/images/ef/8c/be724dfe44f88ea9f229c060dd0d/chrome-dino.webp=n-w96-h103-fcrop64=1,00000980fffff700-rw"/>  Google</button>
                </div>

                <p className="has-account">Don't have an account? <a href = "/">Sign up</a></p>
            </div>
       </div>
    )}
       
       </>
}

async function handleClick(email, password) {
  const user = { email, password };
  const response = await login(user);
  if (response.status === 200) {
    return { success: true };
  } else {
    const message = response.response?.data?.message || "Login failed";
    return { success: false, message };
  }
}

export default LoginPage;