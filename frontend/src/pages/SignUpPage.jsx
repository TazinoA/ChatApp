import { useState, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, validateInput } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";
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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (await handleClick(name, email, password, confirmPassword)) {
            setLoggedIn(true);
            navigate("/chat");
        } else {
            setLoggedIn(false);
        }
    };

    return (
        <div className="sign-up-container">
            <div className="sign-up-board">
                <img src="https://cdn-icons-png.flaticon.com/128/8794/8794966.png" alt="Logo" />
                <h3>Welcome to ChatApp</h3>
                <p className="description">Sign up or log in to your account to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-data">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={"3"}
                            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$"
                            title="Name must be at least 3 characters and be letters only"
                        />
                    </div>

                    <div className="form-data">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Enter a valid email"
                            required
                        />
                    </div>
                    <p className="error-msg hidden">Enter a valid email</p>

                    <div className="form-data">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={"8"}
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Passwords must be at least 8 characters long and contain at least 1 number"
                        />
                    </div>
                    <p className="error-msg hidden">Enter a valid password</p>

                    <div className="form-data">
                        <label htmlFor="confirm">Confirm Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Passwords must be at least 8 characters long and contain at least 1 number"
                        />
                    </div>
                    <p className="error-msg hidden">Passwords must match</p>

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
    console.log(response.status);

    return response.status === 200;
}

export default SignUpPage;
