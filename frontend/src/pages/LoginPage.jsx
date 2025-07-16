import { useState,useContext } from "react";
import { login } from "../utils/auth_handler";
import { useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import "../styles/login.css"
function LoginPage(){

    const {loggedIn, setLoggedIn} = useContext(AuthContext);
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return <>

       <div className = "sign-in-container">
           <div className = "sign-in-board">

                <img src = "https://cdn-icons-png.flaticon.com/128/8794/8794966.png"/>
                <h3>Welcome to ChatApp</h3>
                <p className = "description">Log in to your account to continue</p>
                <label htmlFor = "email">Email</label>
                <input type = "email" placeholder="name@example.com" name = "email" className="login-input" onChange={e => setEmail(e.target.value)} value = {email}/>

                <div className = "password">
                    <label htmlFor = "password">Password</label>
                    <a className = "forgot-password">Forgot Password?</a>
                </div>

                <input type="password" name = "password" className="login-input" onChange={e => setPassword(e.target.value)} value = {password}/>
                <button onClick = {async () => {
                    if(await handleClick(email, password)){
                        setLoggedIn(true);
                        navigate("/chat");
                    }else{
                        setLoggedIn(false);
                        setPassword("");
                    }
                }} className = "sign-in-btn">Sign in</button>

                <div className="continue-with">
                    <span></span>
                    <p>OR CONTINUE WITH</p>
                    <span></span>
                </div>

                <div className="alt-sign-in">
                    <button className="github"> <img src = "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"/> Github</button>
                    <button className="google"> <img src = "https://www.gstatic.com/marketing-cms/assets/images/ef/8c/be724dfe44f88ea9f229c060dd0d/chrome-dino.webp=n-w96-h103-fcrop64=1,00000980fffff700-rw"/>  Google</button>
                </div>

                <p className="has-account">Dont't have an account? <a href = "/">Sign up</a></p>
            </div>
       </div>
       
       </>
}

async function handleClick(email, password){
    const user = {
        email:email,
        password:password
    }
    let response = await login(user);
    console.log(response.status);
    if(response.status === 200){
        return true;
    }else{
        return false;
    }        
}


export default LoginPage;