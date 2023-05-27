import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import { Form, Button } from "react-bootstrap"
import "/static/css/login.css";

export default function Login() {
  
  const {loginUser} = useContext(AuthContext)
  
  return (
    <div id="login-form">

      <Form onSubmit={loginUser}>

        <Form.Group className="form-item">
          <Form.Label>Username: </Form.Label>
          <Form.Control type="text" name="username" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="form-item">
          <Form.Label>Password: </Form.Label>
          <Form.Control type="password" name="password" placeholder="Enter password" />
        </Form.Group>

        <Button variant="primary" type="submit" className="form-item">
          Login
        </Button>

      </Form>

    </div>
  ) 
}