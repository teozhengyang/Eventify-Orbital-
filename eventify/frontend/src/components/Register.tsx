import { useContext } from 'react';
import AuthContext from "../context/AuthContext"

export default function Register() {

  return (
    <form>
        <input type="text" name="username" placeholder="enter username"/>
        <input type="password" name="password" placeholder="enter password"/>
        <input type="email" name="password" placeholder="enter email"/>
        <input type="text" name="first_name" placeholder="enter first name"/>
        <input type="text" name="last_name" placeholder="enter last name"/>
        <input type="submit"/>
    </form>
  );
}