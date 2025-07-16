import axios from "axios";

export async function login(user) {
    const { email, password } = user;
    return await axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password
    })
    .then(response => response)
    .catch(err => err);
}


export async function signUp(user){
  const {name, email, password} = user;

  return await axios.post("http://localhost:5000/auth/signup", {
        email: email,
        password: password,
        name: name
    })
    .then(response => response)
    .catch(err => err);
}

export function validateInput(field, value){
    if(field === "name"){
    return value.length >= 3 &&/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
    }else if(field === "email"){
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }else if(fielid === "password"){
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
    }else if(field === "confirmPassword"){
        return value.password === value.confirmPassword;
    }
}