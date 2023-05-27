import { Nav, Navbar } from "react-bootstrap";
import{ useContext } from "react";
import AuthContext from "../context/AuthContext";
import "/static/css/header.css";

export default function Headers() {
  const { user, logoutUser } = useContext(AuthContext)
  
  return (
    
    <div className="header-display">
      <Navbar className="header" bg="dark" variant="dark">
        {user ? <Navbar.Brand className="title">Hello {user.username}</Navbar.Brand> : <Navbar.Brand className="title">Eventify</Navbar.Brand> }
        <Nav className="nav-link">
        {user ? <Nav.Link href="/">Home</Nav.Link> : <Nav.Link href="/register">Register</Nav.Link>}
        </Nav>  
        <Nav className="nav-link">
          {user ? <Nav.Link onClick={logoutUser}>Log out</Nav.Link> : 
          <Nav.Link href="/login">Login</Nav.Link>}  
        </Nav>
        <Nav className="nav-link">
          {user ? <Nav.Link href="/SearchEvent">Search Event</Nav.Link> : null}
        </Nav>
        <Nav className="nav-link">
          {user ? <Nav.Link href="/CreateEvent">Create Event</Nav.Link> : null}
        </Nav>
        <Nav className="nav-link">
          {user ? <Nav.Link href="/Profile">My Profile</Nav.Link> : null}
        </Nav>
      </Navbar>
    </div>
  )
  
}

        