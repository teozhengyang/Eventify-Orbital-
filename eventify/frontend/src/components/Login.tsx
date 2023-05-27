import { useContext } from "react"
import AuthContext from "../context/AuthContext"

export default function Login() {
  
  const {loginUser} = useContext(AuthContext)
  
  return (
    <div>
      <form onSubmit={loginUser}>
        <div>
          <input type="text" name="username" placeholder="Enter username"/>
        </div>
        <div>
          <input type="password" name="password" placeholder="enter password"/>
        </div>
        <div>
          <input type="submit"/>
        </div>
      </form>
    </div>
  ) 
}