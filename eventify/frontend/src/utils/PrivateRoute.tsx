import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({children, ...rest}) {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    return !user ? <Navigate to="/login"/> : children
}