import { useContext } from "react";
import { signUp } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";

function SignUpPage(){
    const {setLoggedIn} = useContext(AuthContext);
    const user = {
        email: "afiemotazino3@gmail.com", password:"generichash", name: "Tazino" }
    return <>
    <div className = "sign-up-container">
        <div className = "sign-up-board">
       <img src = "https://picsum.photos/200/300"/>
        <h3>Welcome to ChatApp</h3>
        <p className = "description">Sign up or log in to your account to continue</p>
        <label for = "name">Name</label>
        <input type = "text"  name = "name"></input>
        <label for = "email">Email</label>
        <input type = "email" placeholder="name@example.com" name = "email"></input>
        <label for = "password">Password</label>
        <input type="password" name = "password"></input>
         <button onClick = {() => { setLoggedIn(signUp(user)) }} className = "sign-up-btn">Sign Up</button>
        <div className="continue-with">
            <span></span>
            <p>OR CONTINUE WITH</p>
            <span></span>
        </div>
        <div className="alt-sign-in">
            <button className="github"> <img src = "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"/> Github</button>
            <button className="google"> <img src = "https://www.gstatic.com/marketing-cms/assets/images/ef/8c/be724dfe44f88ea9f229c060dd0d/chrome-dino.webp=n-w96-h103-fcrop64=1,00000980fffff700-rw"/>  Google</button>
        </div>
        <p className="has-account">Already have an account? <a>Sign in</a></p>
    </div>
    </div>
    </>
}


export default SignUpPage;