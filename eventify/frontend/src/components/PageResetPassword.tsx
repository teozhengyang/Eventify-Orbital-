import { useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {

  const { authTokens, user, logoutUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const resetPassword = async(e) => {
    if (e.target.password.value !== e.target.password2.value) {
      alert("Passwords do not match")
      navigate('/ResetPassword')
    }
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/reset_password/${user.user_id}/`, {
        password: e.target.password.value,
      }, config);
      console.log(response.data)
      alert('Password reset successfully!')
      logoutUser();
      navigate('/login')
    } catch (error) {
      console.error(error.response)
    }
  }

  return (
    <div>
      <Form onSubmit={resetPassword}>
        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Password: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="password" name="password" placeholder="Enter new password" /></div>
        </Form.Group>
        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Confirm password: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="password" name="password2" placeholder="Enter new password again" /></div>
        </Form.Group>
        <Button type='submit'>Reset Password</Button>
      </Form>
    </div>
  )
}