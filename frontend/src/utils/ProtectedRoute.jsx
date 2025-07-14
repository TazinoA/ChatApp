import {Outlet, Navigate} from "react-router-dom"
import { useContext } from "react";
import AuthContext from "./AuthContext";
export default function ProtectedRoute(){
    const {loggedIn} = useContext(AuthContext);
    return loggedIn ? <Outlet/> : <Navigate to = "/"/>
}