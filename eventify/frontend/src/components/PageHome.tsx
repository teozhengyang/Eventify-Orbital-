import { useState, useContext, useEffect } from "react";
import { getMonthMatrix, getWeekArray } from "../utils/Calendar";
import DisplayMonth from "./DisplayMonth";
import DisplayWeek from "./DisplayWeek";
import DisplayDay from "./DisplayDay";
import CalendarHeader from "./CalendarHeader";
import ModalEvent from "./ModalEvent";
import MonthContext from "../context/MonthContext";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";
import { AuthToken } from "src/utils/Types";

export default function Home() {
  const [monthData, setMonthData] = useState(getMonthMatrix());
  const [weekData, setWeekData] = useState(getWeekArray());

  const [events, setEvents] = useState([])
  const { showModal } = useContext(NewEventModalContext)
  const { displayDate, displayType } = useContext(MonthContext);
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken };

  // Update Calendar display whenever prev/next buttons are pressed
  useEffect(() => {
    setMonthData(getMonthMatrix(displayDate));
    setWeekData(getWeekArray(displayDate))
  }, [displayDate]);

  // Update calendar event display when new event is created (ie. when modal is opened/closed or page is rendered)
  useEffect(() => {
    getdata()
  }, [showModal])

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getdata = async () => {
    const eventsResponse = await axios.get('/api/events/', config)
    const eventsData = eventsResponse.data
    console.log(eventsData)
    setEvents(eventsData)
  };

  const calendar = displayType === "month"
    ? <DisplayMonth data={monthData} eventlist={events}/> 
    : displayType === "week" 
      ? <DisplayWeek data={weekData} eventlist={events}/>
      : <DisplayDay eventlist={events}/>

  return (
    <div className="flex-container" style={{marginTop:"5px"}}>
      <CalendarHeader />
      <ModalEvent />
      {calendar}
    </div>
  )
}