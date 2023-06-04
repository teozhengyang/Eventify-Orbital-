import { useState, useContext, useEffect } from "react";
import { getMonthMatrix } from "../utils/Calendar";
import MonthDisplay from "./MonthDisplay";
import CalendarHeader from "./CalendarHeader";
import NewEventModal from "./NewEventModal";
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

  useEffect(() => {
    getdata()
  }, [showModal])

  // Headers for authorization @ backend => Allos Get/Post request for event data
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
      <NewEventModal />
      <MonthDisplay data={monthData} events={events}/>
    </div>
  )
}