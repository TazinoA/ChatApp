import axios from "axios";

export function login(user) {
    const { email, password } = user;
    return axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password
    })
    .then(response => console.log(response))
    .catch(err => console.log(err));
}


export function signUp(user){
  const {name, email, password} = user;

  return axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password,
        name: name
    })
    .then(response => console.log(response))
    .catch(err => console.log(err));
}