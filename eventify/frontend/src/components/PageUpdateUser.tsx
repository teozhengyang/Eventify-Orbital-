import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "/static/css/register.css";
import { AuthToken, AuthUser, emptyUser } from "../utils/Types";

export default function UpdateUser() {

  const [currUser, setCurrUser] = useState(emptyUser)
  const { user, authTokens } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser }

  useEffect(() => {
    getCurrUser()
  }, [])

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }
    
  const getCurrUser = async () => {
    // Somehow changing this to /api (proxy set in vite.config.ts) instead of the full address breaks the profile page
    const userResponse = await axios.get(`https://eventify-n2c5.onrender.com/user/${user.user_id}`, config);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
  }

  // For redirect after form submit
  const navigate = useNavigate()

  // Update user
  const updateUserInfo = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        username: {value: string}
        email: {value: string}
        first_name: {value: string}
        last_name: {value: string}
        budget: {value: number}
      }
      const response = await axios.put(`https://eventify-n2c5.onrender.com/user/${currUser.id}/`, {
        username: target.username.value,
        email: target.email.value,
        first_name: target.first_name.value,
        last_name: target.last_name.value,
        budget: target.budget.value,
      }, config);
      console.log(response.data)
      alert('User information updated successfully!')
      navigate('/Profile')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="register-form">
      <Form onSubmit={updateUserInfo}>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Username: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="username" placeholder="Enter new username" defaultValue={currUser.username} /></div>
        </Form.Group>  
        
        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Email Address: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="email" name="email" placeholder="Enter new email address" defaultValue={currUser.email} /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>First name: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="first_name" placeholder="Enter new first name" defaultValue={currUser.first_name} /></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Last name: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="text" name="last_name" placeholder="Enter new last name" defaultValue={currUser.last_name}/></div>
        </Form.Group>

        <Form.Group className="own-form-item">
          <div><Form.Label className='own-form-label'>Budget: </Form.Label></div>
          <div><Form.Control className='own-form-field' type="number" step="0.01" name="budget" placeholder="Enter new budget" defaultValue={currUser.budget}/></div>
        </Form.Group>

        <Button variant="primary" className="own-form-button" type="submit">Update</Button>
        
      </Form>
    </div>
  )
}