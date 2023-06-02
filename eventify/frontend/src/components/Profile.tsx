import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";

export default function Profile() {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState("")
  const [organisedEvents, setOrganisedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])

  useEffect(() => {
    getCurrUser()
  },[])

  const getCurrUser = async () => {
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/${user.user_id}`);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    const eventsResponse = await axios.get('http://127.0.0.1:8000/api/events/')
    const eventsData = eventsResponse.data
    console.log(eventsData)
    eventsData.forEach((event) => {
      if (event.organizers.includes(user.user_id)) {
        setOrganisedEvents(event)
        console.log(event)
      } 
      if (event.participants.includes(user.user_id)) {
        setParticipatedEvents(event)
        console.log(event)
      } else {
        // do nothing
      }
    })
  };

  const organisedEventDiv = (
      <div>
        <h2>{organisedEvents.name}</h2>
      </div>
  )

  const participatedEventDiv = (
    <div>
      <h2>{participatedEvents.name}</h2>
    </div>
  )

  return (
    <div>
      <p>Name: {currUser.first_name} {currUser.last_name}</p>
      <p>Email: {currUser.email}</p>
      {organisedEvents && organisedEventDiv}
      <br/>
      {participatedEvents && participatedEventDiv}
    </div>
  )
}