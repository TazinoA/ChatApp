import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { signUp, validateInput } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";
import Loading from "../components/Loading";
import "../styles/signup.css";

function SignUpPage() {
    const { setLoggedIn } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [submitError, setSubmitError] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(nameError || emailError || passwordError || confirmPasswordError){
            setSubmitError("Please fix all errors before submitting");
            return
        }

        if (await handleClick(name, email, password, confirmPassword)) {
            setLoggedIn(true);
            navigate("/chat");
        } else {
            setSubmitError("User already exists, go to the login page")
        }
    };

    return (
        <>
        <div className="sign-up-container">
            <div className="sign-up-board">
                <img src="https://cdn-icons-png.flaticon.com/128/8794/8794966.png" alt="Logo" />
                <h3>Welcome to ChatApp</h3>
                <p className="description">Sign up or log in to your account to continue</p>
                <p className = {`error-msg ${submitError ? "" : "hidden"}`}>{submitError}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-data">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if(nameError){
                                    const error = validateInput(e.target.name, e.target.value);
                                    setNameError(error === "valid"?  "" : error)
                                }
                            }}
                            required
                            minLength={"3"}
                            title="Name must be at least 3 characters and be letters only"
                            className={nameError ? "error" : ""}
                            onBlur = {(e) => {
                                const error = validateInput(e.target.name, name);
                                if(error !== "valid"){
                                    setNameError(error);
                                }else{
                                    setNameError("");
                                }
                            }}
                        />
                    </div>
                    <p className = {`error-msg ${nameError ? "" : "hidden"}`}>{nameError}</p>

                    <div className="form-data">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={email}
                             onChange={(e) => {
                                setEmail(e.target.value);
                                if(emailError){
                                    const error = validateInput(e.target.name, e.target.value);
                                    setEmailError(error === "valid"?  "" : error)
                                }
                            }}
                            title="Enter a valid email"
                            className={emailError ? "error" : ""}
                            required
                            onBlur = {(e) => {
                                const error = validateInput(e.target.name, email);
                                if(error !== "valid"){
                                    setEmailError(error);
                                }else{
                                    setEmailError("");
                                }
                            }}
                        />
                    </div>
                    <p className = {`error-msg ${emailError ? "" : "hidden"}`}>{emailError}</p>

                    <div className="form-data">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                             onChange={(e) => {
                                setPassword(e.target.value);
                                if(passwordError){
                                    const error = validateInput(e.target.name, e.target.value);
                                    setPasswordError(error === "valid"?  "" : error)
                                }
                            }}
                            required
                            autoComplete="off"
                            minLength={"8"}
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Passwords must be at least 8 characters long and contain at least 1 number"
                            className={passwordError ? "error" : ""}
                            onBlur = {(e) => {
                                const error = validateInput(e.target.name, password);
                                if(error !== "valid"){
                                    setPasswordError(error);
                                }else{
                                    setPasswordError("");
                                }
                            }}
                        />
                    </div>
                    <p className = {`error-msg ${passwordError ? "" : "hidden"}`}>{passwordError}</p>

                    <div className="form-data">
                        <label htmlFor="confirm">Confirm Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={confirmPassword}
                            autoComplete="off"
                             onChange={(e) => {
                                setConfirmPassword(e.target.value);

                                const error = validateInput(e.target.name,e.target.value, password);
                                setConfirmPasswordError(error === "valid"?  "" : error)
                            }}
                            required
                            title="Passwords must be at least 8 characters long and contain at least 1 number"
                            className={confirmPasswordError ? "error" : ""}
                            onBlur = {(e) => {
                                const error = validateInput(e.target.name, e.target.value, password);
                                if(error !== "valid"){
                                    setConfirmPasswordError(error);
                                }else{
                                    setConfirmPasswordError("");
                                }
                            }}
                        />
                    </div>
                    <p className = {`error-msg ${confirmPasswordError ? "" : "hidden"}`}>{confirmPasswordError}</p>

                    <button type="submit" className="sign-up-btn">Sign Up</button>
                </form>

                <div className="continue-with">
                    <span></span>
                    <p>OR CONTINUE WITH</p>
                    <span></span>
                </div>

                <div className="alt-sign-in">
                    <button className="github">
                        <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub logo" /> Github
                    </button>
                    <button className="google">
                        <img src="https://www.gstatic.com/marketing-cms/assets/images/ef/8c/be724dfe44f88ea9f229c060dd0d/chrome-dino.webp=n-w96-h103-fcrop64=1,00000980fffff700-rw" alt="Google logo" /> Google
                    </button>
                </div>

                <p className="has-account">Already have an account? <a href="/login">Sign in</a></p>
            </div>
        </div>
    </>
    );
}

async function handleClick(fullName, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        return false;
    }

    const user = {
        email: email,
        password: password,
        name: fullName,
    };

    const response = await signUp(user);
    console.log(response);

    return response.status === 200;
}


export default SignUpPage;
