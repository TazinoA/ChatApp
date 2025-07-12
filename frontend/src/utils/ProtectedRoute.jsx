import {Outlet, Navigate} from "react-router-dom"

export default function ProtectedRoute(){
    const user = null;
    return user ? <Outlet/> : <Navigate to = "/login"/>
}