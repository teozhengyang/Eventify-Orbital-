import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import { Form, Button } from "react-bootstrap"
import "/static/css/login.css";

export default function Login() {
  
  const {loginUser} = useContext(AuthContext)
  
  return (
    <div className="login-form">
      <Form onSubmit={loginUser}>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Username: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="username" placeholder="Enter username" /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Password: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="password" name="password" placeholder="Enter password" /></div>
        </Form.Group>

        <Button variant="primary" className="own-form-button" type="submit">Login</Button>
        
      </Form>
    </div>
  ) 
}