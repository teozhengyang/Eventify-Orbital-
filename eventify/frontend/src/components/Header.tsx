import{ useContext } from "react";
import AuthContext from "../context/AuthContext";
import "/static/css/header.css";
import { Nav, Navbar } from "react-bootstrap";
import { AuthUser, LogoutUser, emptyAuthUser } from "../utils/Types";

export default function Headers() {
  const { user, logoutUser } = useContext(AuthContext) as { user: AuthUser, logoutUser: LogoutUser}
  const isAuthenticated = (user != emptyAuthUser)

  const loginBar = (      
    <Navbar className="header">
      <Nav.Item>
        <Navbar.Brand id="own-nav-brand">Hello {user.username}</Navbar.Brand>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/Profile">My Profile</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/NewEvent">Create New Event</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/Marketplace">Marketplace</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/WeatherApp">Weather</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" onClick={logoutUser}>Logout</Nav.Link>
      </Nav.Item>
    </Navbar>)

  const logoutBar = (
    <Navbar className="header">
      <Nav.Item>
        <Navbar.Brand id="own-nav-brand">Eventify</Navbar.Brand>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/register">Register</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="own-nav-link" href="/login">Login</Nav.Link>
      </Nav.Item>
    </Navbar>
  )

  return (
    <div className="header-display">
      {isAuthenticated ? loginBar : logoutBar}
    </div>
  )
  
}

