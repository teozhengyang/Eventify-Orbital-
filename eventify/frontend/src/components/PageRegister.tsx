import { useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Button, Form } from 'react-bootstrap';
import "/static/css/register.css";

export default function Register() {
  const { registerUser } = useContext(AuthContext)

  return (
    <div className="register-form">
      <Form onSubmit={registerUser}>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Username: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="username" placeholder="Enter username" /></div>
        </Form.Group>  
        
        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Password: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="password" name="password" placeholder="Enter password" /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Confirm password: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="password" name="password2" placeholder="Enter password again" /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Email Address: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="email" name="email" placeholder="Enter email address" /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>First name: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="first_name" placeholder="Enter first name" /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Last name: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="last_name" placeholder="Enter last name" /></div>
        </Form.Group>

        <Button variant="primary" className="own-form-button" type="submit">Register</Button>
        
      </Form>
    </div>
  );
}