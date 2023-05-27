import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";

export default function Profile() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  let [profile, setProfile] = useState([])

  useEffect(() => {
    getProfile()
  },[])

    const getProfile = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/profile', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
    
          const data = response.data;
          console.log(data);
          if (response.status === 200) {
            setProfile(data);
          } else if (response.status === 401) {
            logoutUser();
          }
        } catch (error) {
          console.error('Error getting profile:', error);
        }
      };

  return (
    <div>
      <p>Name: {profile.first_name} {profile.last_name}</p>
      <p>Email: {profile.email}</p>
    </div>
  )
}