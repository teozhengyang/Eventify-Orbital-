import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    const [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const registerUser = async (e) => {
      e.preventDefault()

      try {
        const response = await axios.post('/api/register/', {
          username: e.target.username.value,
          password: e.target.password.value,
          password2: e.target.password2.value,
          email: e.target.email.value,
          first_name: e.target.first_name.value,
          last_name: e.target.last_name.value,
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

    const loginUser = async (e) => {
      e.preventDefault()

      try {
        const response = await axios.post('/api/token/', {
          username: e.target.username.value,
          password: e.target.password.value,
        });

        const data = response.data;

        if (data) {
          localStorage.setItem('authTokens', JSON.stringify(data));
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          navigate('/');
        } else {
          alert('Please try again');
          navigate('/login');
        }

      } catch (error) {
        console.error('Error logging in:', error);
        alert('Wrong username or password');
        navigate('/login');
      }
    }

    const logoutUser = () => {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }

    const updateToken = async () => {
      try {
        const response = await axios.post('/api/token/refresh/', {
        refresh: authTokens?.refresh,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;

        if (response.status === 200) {
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
          logoutUser();
        }

        if (loading) {
          setLoading(false);
        }

      } catch (error) {
        console.error('Error updating token:', error);
      }
    }


    const contextData = {
      user:user,
      authTokens:authTokens,
      loginUser:loginUser,
      logoutUser:logoutUser,
      registerUser:registerUser,
    }

    useEffect(()=>{
      if(loading){
        updateToken()
      }

      const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
      const interval = setInterval(()=>{
        if(authTokens){
          updateToken()
        }
      }, REFRESH_INTERVAL)

      return () => clearInterval(interval)

    },[authTokens, loading])

    return (
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    )
    
}