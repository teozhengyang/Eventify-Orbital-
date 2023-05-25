import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function PrivateRoute({children, ...rest}) {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    return !user ? navigate('/login') : children
}