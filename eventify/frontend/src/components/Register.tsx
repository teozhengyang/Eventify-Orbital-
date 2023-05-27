import { useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Button, Form } from 'react-bootstrap';
import "/static/css/register.css";

export default function Register() {
  const { registerUser } = useContext(AuthContext)

  return (
    <div id="register-form">

    <Form onSubmit={registerUser}>

      <Form.Group className="form-item" >
        <Form.Label>Username: </Form.Label>
        <Form.Control type="text" name="username" placeholder="Enter username" />
      </Form.Group>

      <Form.Group className="form-item">
        <Form.Label>Password: </Form.Label>
        <Form.Control type="password" name="password" placeholder="Enter password" />
      </Form.Group>

      <Form.Group className="form-item">
        <Form.Label>Password: </Form.Label>
        <Form.Control type="password" name="password2" placeholder="Enter password again" />
      </Form.Group>

      <Form.Group className="form-item">
        <Form.Label>Email: </Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="form-item">
        <Form.Label>First name: </Form.Label>
        <Form.Control type="text" name="first_name" placeholder="Enter first name" />
      </Form.Group>

      <Form.Group className="form-item">
        <Form.Label>Last name: </Form.Label>
        <Form.Control type="text" name="last_name" placeholder="Enter last name" />
      </Form.Group>

      <Button variant="primary" type="submit" className="form-item">
        Register
      </Button>

    </Form>

  </div>
  );
}