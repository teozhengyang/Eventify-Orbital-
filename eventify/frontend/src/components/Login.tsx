import axios from "axios"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

export default function Login() {
    const {loginUser} = useContext(AuthContext)
    
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter username"/>
                <input type="password" name="password" placeholder="enter password"/>
                <input type="submit"/>
            </form>
        </div>
    ) 
}