import { Outlet, Link } from "react-router-dom";

export default function Links() {
  return (
    <>
      <h3>Nav bar for testing</h3>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/CreateEvent">Create Event</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}