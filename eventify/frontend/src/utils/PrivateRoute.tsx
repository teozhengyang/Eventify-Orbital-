import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { AuthUser } from "./Types";

export default function PrivateRoute({children, ...rest}) {
    const { user } = useContext(AuthContext) as {user: AuthUser}
    return !user ? <Navigate to="/login"/> : children
}