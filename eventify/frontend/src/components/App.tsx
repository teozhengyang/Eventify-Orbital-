import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetEvent from "./GetEvent";
import Links from "./Links";
import Event from "./Event";
import NoPage from "./NoPage";

/**
 * Main page, might be used for main calendar view? or to simply route to different pages
 * path="*" takes care of any undefined URLs
 * 
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Links />}>
          <Route index element={<GetEvent />} />
          <Route path="CreateEvent" element={<Event />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}