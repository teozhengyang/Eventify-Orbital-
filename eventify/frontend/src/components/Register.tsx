import { useContext} from 'react';
import AuthContext from '../context/AuthContext';

export default function Register() {
  const { registerUser } = useContext(AuthContext)

  return (
    <form onSubmit={registerUser}>
      <div>
        <input type="text" name="username" placeholder="enter username" />
      </div>
      <div>
        <input type="password" name="password" placeholder="enter password" />
      </div>
      <div>
        <input type="password" name="password2" placeholder="enter password again" />
      </div>
      <div>
        <input type="email" name="email" placeholder="enter email" />
      </div>
      <div>
        <input type="text" name="first_name" placeholder="enter first name" />
      </div>
      <div>
        <input type="text" name="last_name" placeholder="enter last name" />
      </div>
      <div>
        <input type="submit" value='Register' />
      </div>        
    </form>
  );
}