import { useState, useContext, useEffect } from "react";
import { getMonthMatrix } from "../utils/Calendar";
import MonthDisplay from "./MonthDisplay";
import CalendarHeader from "./CalendarHeader";
import EventModal from "./EventModal";
import MonthContext from "../context/MonthContext";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";

export default function Home() {
  const [monthData, setMonthData] = useState(getMonthMatrix());
  const [events, setEvents] = useState([])
  const { showModal } = useContext(NewEventModalContext)
  const { monthIndex } = useContext(MonthContext);
  const { authTokens } = useContext(AuthContext);

  // Grabs a date from center of matrix, convert to string, split words by spaces (to get Month-Year header)
  const month = monthData[2][3].toString().split(" ");

  // Update MonthDisplay whenever calendar is swapped to another
  useEffect(() => {
    setMonthData(getMonthMatrix(monthIndex));
  }, [monthIndex]);

  // Update calendar event display when new event is created (ie. when modal is opened/closed or page is rendered)
  useEffect(() => {
    getdata()
  }, [showModal])

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getdata = async () => {
    const eventsResponse = await axios.get('http://127.0.0.1:8000/events/', config)
    const eventsData = eventsResponse.data
    console.log(eventsData)
    setEvents(eventsData)
  };

  return (
    <div className="flex-container">
      <CalendarHeader month={month[1] + " " + month[3]}/>
      <EventModal />
      <MonthDisplay data={monthData} eventlist={events}/>
    </div>
  )
}