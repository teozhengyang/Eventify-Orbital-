import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/token/', {
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
              alert('Something went wrong while logging in the user!');
            }
          } catch (error) {
            console.error('Error logging in:', error);
          }
    }

    let logoutUser = () => {
        // e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }

    const updateToken = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
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

    let contextData = {
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
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}