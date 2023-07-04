import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { AuthUser, emptyAuthUser } from "./Types";

const PrivateRoute = () => {
    const { user } = useContext(AuthContext) as {user: AuthUser}
    return user == emptyAuthUser ? <Navigate to="/login"/> : <Outlet />
}

export default PrivateRoute