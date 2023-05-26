import { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [budget, setBudget] = useState("")
  const navigate = useNavigate()

  let RegisterNewUser = async () => {
    let formField = new FormData()
    formField.append('username', username)
    formField.append('password', password)
    formField.append('email', email)
    formField.append('first_name', first_name)
    formField.append('last_name', last_name)
    formField.append('budget', budget)

    await axios({
      method: 'POST',
      url: '/api/users/',
      data: formField
    }).then((response) => {
      console.log(response.data)
      navigate('/login')
    }).catch((error) => {
      console.log(error)
      alert('Something is wrong with your registration')
      navigate('/Register')
    })
  }

  return (
    <div>
      <div>
        <input type="text" name="username" placeholder="enter username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="password" name="password" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <input type="email" name="email" placeholder="enter email" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <input type="text" name="first_name" placeholder="enter first name" onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <input type="text" name="last_name" placeholder="enter last name" onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <input type="text" name="budget" placeholder="enter budget" onChange={(e) => setBudget(e.target.value)} />
      </div>
      <div>
       <button onClick={RegisterNewUser}>Register</button> 
      </div>        
    </div>
  );
}