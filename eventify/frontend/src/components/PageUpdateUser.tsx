import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "/static/css/register.css";

export default function UpdateUser() {

  const [currUser, setCurrUser] = useState([])

  const { user, authTokens } = useContext(AuthContext)

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
    const userResponse = await axios.get(`http://127.0.0.1:8000/user/${user.user_id}`, config);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
  }

  // For redirect after form submit
  const navigate = useNavigate()

  // Update event
  const updateUserInfo = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/user/${currUser.id}/`, {
        username: e.target.username.value,
        email: e.target.email.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        budget: e.target.budget.value,
      }, config);
      console.log(response.data)
      alert('User information updated successfully!')
      navigate('/Profile')
    } catch (error) {
      console.error(error.response)
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