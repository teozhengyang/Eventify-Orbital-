import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from "axios";
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';

export default function Profile() {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState([])
  const [organisedEvents, setOrganisedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])

  type Event = {
    id?: number;
    name?: string;
    description?: string;
    start?: Date;
    end?: Date;
    location?: string;
    budget?: number;
    organizers?: Array<number>;
    participants?: Array<number>;
  }

  // For routing page to edit event page
  const navigate = useNavigate()

  useEffect(() => {
    getCurrUser()
  },[])

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getCurrUser = async () => {
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/${user.user_id}`);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    const eventsResponse = await axios.get('http://127.0.0.1:8000/events/', config)
    const eventsData = eventsResponse.data
    console.log(eventsData)

    const filterOrganiseEvents = eventsData.filter(event => {
      return event.organizers.includes(user.user_id)
    })
    setOrganisedEvents(filterOrganiseEvents)

    const filterParticipateEvents = eventsData.filter(event => {
      return event.participants.includes(user.user_id)
    })
    setParticipatedEvents(filterParticipateEvents)
  };

  

  const organisedEventDiv = (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organisedEvents.map((event:Event, i) => (
              <tr key={i}>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{dayjs(event.start).format("DD/MM/YYYY HH:mm")}</td>
                <td>{dayjs(event.end).format("DD/MM/YYYY HH:mm")}</td>
                <td>{event.location}</td>
                <td>${event.budget}</td>
                <td>
                  <Button onClick={() => {
                    navigate('/EditEvent', {state:{evt:event}})
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={async() => {
                    const response = await axios.delete('http://127.0.0.1:8000/events/', {
                      headers:{
                        'Authorization': 'Bearer ' + String(authTokens.access)
                      },
                      data: event.id
                    })
                    console.log(response)
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )

  const participatedEventDiv = (
    <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participatedEvents.map((event:Event, i) => (
              <tr key={i}>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{dayjs(event.start).format("DD/MM/YYYY HH:mm")}</td>
                <td>{dayjs(event.end).format("DD/MM/YYYY HH:mm")}</td>
                <td>{event.location}</td>
                <td>${event.budget}</td>
                <td>
                  <Button>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )

  return (
    <div>
      <p>Name: {currUser.first_name} {currUser.last_name} | Email: {currUser.email}</p>
      <h4> Organised Events </h4>
      <hr />
      {organisedEvents && organisedEventDiv}
      <br/>
      <h4> Participated Events </h4>
      <hr/>
      {participatedEvents && participatedEventDiv}
    </div>
  )
}