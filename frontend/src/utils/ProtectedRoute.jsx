import {Outlet, Navigate} from "react-router-dom"
import { useContext } from "react";
import AuthContext from "./AuthContext";
import Loading from "../components/Loading";

export default function ProtectedRoute(){
    const {loggedIn, checkingAuth} = useContext(AuthContext);

    if(checkingAuth){
        return <Loading variant="dots" text=""/>
    }

    return loggedIn ? <Outlet/> : <Navigate to = "/login"/>
}