import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetEvent from "./GetEvent";
import Header from "./Header";
import Event from "./Event";
import NoPage from "./NoPage"
import Login from "./Login";
import Home from "./Home";
import PrivateRoute from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import Profile from "./Profile";
import Register from "./Register";

/**
 * Main page, might be used for main calendar view? or to simply route to different pages
 * path="*" takes care of any undefined URLs
 * 
 */
export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="login" element={<Login />} />
        <Route path='SearchEvent' element={<GetEvent />} />
        <Route path="CreateEvent" element={<Event />} />
        <Route path="*" element={<NoPage />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}