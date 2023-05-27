import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({children, ...rest}) {
    const { user } = useContext(AuthContext)
    return !user ? <Navigate to="/login"/> : children
}