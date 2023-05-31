import { Nav, Navbar} from "react-bootstrap";
import{ useContext } from "react";
import AuthContext from "../context/AuthContext";
import "/static/css/header.css";

export default function Headers() {
  const { user, logoutUser } = useContext(AuthContext)

  return (
    <div className="header-display">
      <Navbar className="header">
        <Nav.Item>
          {user ? <Navbar.Brand className="own-nav-brand">Hello {user.username}</Navbar.Brand> : <Navbar.Brand className="own-nav-brand">Eventify</Navbar.Brand>}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/">Home</Nav.Link> : <Nav.Link className="own-nav-link" href="/register">Register</Nav.Link>} 
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" onClick={logoutUser}>Log out</Nav.Link> : <Nav.Link className="own-nav-link"  href="/login">Login</Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/SearchEvent">Search Event</Nav.Link> : null}
        </Nav.Item>
        <Nav.Item>
          {user ? <Nav.Link className="own-nav-link" href="/Profile">My Profile</Nav.Link> : null}
        </Nav.Item>
      </Navbar> 
    </div>
  )
  
}

