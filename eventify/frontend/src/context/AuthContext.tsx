import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AuthUser, emptyAuthUser } from '../utils/Types';

const AuthContext = createContext({})

export default AuthContext;

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [user, setUser] = useState<AuthUser>(() => {
      const storedTokens = localStorage.getItem('authTokens');
      return storedTokens ? jwtDecode(storedTokens) : emptyAuthUser;
    });

    const [authTokens, setAuthTokens] = useState(() => {
      const storedTokens = localStorage.getItem('authTokens');
      return storedTokens ? JSON.parse(storedTokens) : { access: '', refresh: '' };
    });

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const target = e.target as typeof e.target & {
          username: {value: string}
          password: {value: string}
        }
        const response = await axios.post('/api/token/', {
          username: target.username.value,
          password: target.password.value,
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
        setUser(emptyAuthUser)
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