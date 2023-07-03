import { useContext} from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthToken, AuthUser, LogoutUser } from 'src/utils/Types';

export default function ResetPassword() {

  const { authTokens, user, logoutUser } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser, logoutUser: LogoutUser}

  const navigate = useNavigate()

  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const resetPassword = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      password: {value: string}
      password2: {value: string}
    }
    if (target.password.value !== target.password2.value) {
      alert("Passwords do not match")
      navigate('/ResetPassword')
      return
    }

    try {
      const response = await axios.post(`https://eventify-n2c5.onrender.com/reset_password/${user.user_id}/`, {
        password: target.password.value,
      }, config);
      console.log(response.data)
      logoutUser();
      navigate('/login')
    } catch (error) {
      console.error(error)
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
        <Button className="own-form-button" type='submit'>Reset Password</Button>
      </Form>
    </div>
  )
}