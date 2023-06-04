import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetEvent from "./PageGetEvent";
import Header from "./Header";
import NoPage from "./PageNone"
import Login from "./PageLogin";
import Home from "./PageHome";
import PrivateRoute from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import { MonthProvider } from "../context/MonthContext";
import { ModalProvider } from "../context/NewEventModalContext";
import Profile from "./PageProfile";
import Register from "./PageRegister";
import NewEventPage from "./PageNewEvent";

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