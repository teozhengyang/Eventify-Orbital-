import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetEvent from "./GetEvent";
import Header from "./Header";
import NewEvent from "./NewEvent";
import NoPage from "./NoPage"
import Login from "./Login";
import Home from "./Home";
import PrivateRoute from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import { MonthProvider } from "../context/MonthContext";
import { ModalProvider } from "../context/NewEventModalContext";
import Profile from "./Profile";
import Register from "./Register";
import NewEventPage from "./NewEventPage";

/**
 * Main page, might be used for main calendar view? or to simply route to different pages
 * path="*" takes care of any undefined URLs
 * 
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <MonthProvider>
            <Header />
              <Routes>
                <Route path="" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="login" element={<Login />} />
                <Route path='SearchEvent' element={<GetEvent />} />
                <Route path="Profile" element={<Profile />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NoPage />} />
                <Route path="NewEvent" element={<NewEventPage />} /> 
              </Routes>
          </MonthProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}