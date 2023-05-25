import { Nav, Navbar } from "react-bootstrap";
import{ useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Headers() {
    const { user, logoutUser } = useContext(AuthContext)
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Eventify</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/">Home</Nav.Link> 
                </Nav>  
                <Nav>
                   {user ? <Nav.Link onClick={logoutUser}>Log out</Nav.Link> : 
                        <Nav.Link href="/login">Login</Nav.Link>}  
                </Nav>
                <Nav>
                    {user ? <Nav.Link href="/SearchEvent">Search Event</Nav.Link> : null}
                </Nav>
                <Nav>
                    {user ? <Nav.Link href="/CreateEvent">Create Event</Nav.Link> : null}
                </Nav>
                <Nav>
                    {user ? <Nav.Link href="/Profile">My Profile</Nav.Link> : null}
                </Nav>
            </Navbar>
            {user && <p>Hello {user.username}!</p>}
        </div>
    )
  
}

        