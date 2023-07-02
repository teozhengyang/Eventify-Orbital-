import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import "/static/css/register.css";

export default function Register() {
  const navigate = useNavigate()

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const target = e.target as typeof e.target & {
        username: {value: string}
        password: {value: string}
        password2: {value: string}
        email: {value: string}
        first_name: {value: string}
        last_name: {value: string}
      }
      const response = await axios.post('https://eventify-n2c5.onrender.com/register/', {
        username: target.username.value,
        password: target.password.value,
        password2: target.password2.value,
        email: target.email.value,
        first_name: target.first_name.value,
        last_name: target.last_name.value,
      });

      const { data } = response;

      if (data.success) {
        // User registration successful
        console.log(data.success);
        // Additional logic or redirect to another page
        alert(data.success)
        navigate('/login')
      } else if (data.error) {
        // User registration unsuccessful
        console.log(data.error)
        alert(data.error)
        navigate('/register')
      }

    } catch (error) {
      // Handle error in making the API request
      console.error(error);
      alert('Please try again!');
      navigate('/register');
    }
  }

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