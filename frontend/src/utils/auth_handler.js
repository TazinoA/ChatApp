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
  const {name, email, password, confirmPassword} = user;

  return await axios.post("http://localhost:5000/auth/signup", {
        email: email,
        password: password,
        name: name,
        confirmPassword:confirmPassword,
    })
    .then(response => response)
    .catch(err => err);
}

export function validateInput(field, value, relatedValue = ""){
    if(field === "name"){
         if(value.length < 3){
            return "Name must be at least 3 characters long";
         }else if (! /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value)){
            return "Please enter a valid name"
         }
         else{
            return "valid";
         }
         
    }else if(field === "email"){
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)){
            return "Please enter a valid email address";
        }
        else{
            return "valid";
        }

    }else if(field === "password"){
        if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)){
            return "Password must be at least 8 characters and contain 1 number"
        }else{
            return "valid";
        }
    }else if(field === "confirm"){
        if(value !== relatedValue){
            return "Passwords must match";
        }else{
            return "valid";
        }
    }
}