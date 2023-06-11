import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import NoPage from "./PageNone"
import Login from "./PageLogin";
import Home from "./PageHome";
import Profile from "./PageProfile";
import Register from "./PageRegister";
import NewEventPage from "./PageNewEvent";
import EditEvent from "./PageEditEvent";
import PrivateRoute from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import { MonthProvider } from "../context/MonthContext";
import { ModalProvider } from "../context/NewEventModalContext";
import Event from "./PageEvent";
import NewActivityPage from "./PageNewActivity";

/**
 * Main page, route to different pages
 * path="*" takes care of any undefined URLs
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
                <Route path="Profile" element={<Profile />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NoPage />} />
                <Route path="NewEvent" element={<NewEventPage />} />
                <Route path="EditEvent" element={<EditEvent />}/>
                <Route path="Event/:id" element={<Event />} />
                <Route path="NewActivity" element={<NewActivityPage />} />
              </Routes>
          </MonthProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}