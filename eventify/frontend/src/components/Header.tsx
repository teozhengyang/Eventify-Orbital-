import{ useContext } from "react";
import AuthContext from "../context/AuthContext";
import "/static/css/header.css";
import { Nav, Navbar} from "react-bootstrap";

export default function Headers() {
  const { user, logoutUser } = useContext(AuthContext)
  console.log(user)
  return (
    <div className="header-display">
      <Navbar className="header">
        <Nav.Item>
          {user ? <Navbar.Brand id="own-nav-brand">Hello {user.username}</Navbar.Brand> : <Navbar.Brand id="own-nav-brand">Eventify</Navbar.Brand>}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/">Home</Nav.Link> : <Nav.Link className="own-nav-link" href="/register">Register</Nav.Link>} 
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" onClick={logoutUser}>Log out</Nav.Link> : <Nav.Link className="own-nav-link"  href="/login">Login</Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/NewEvent">Create New Event</Nav.Link> : null}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/Profile">My Profile</Nav.Link> : null}
        </Nav.Item>
      </Navbar> 
    </div>
  )
  
}

