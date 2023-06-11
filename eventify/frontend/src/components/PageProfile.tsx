import { useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { format } from 'date-fns';
import "/static/css/profile.css";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Pagination from '../utils/Pagination';

export default function Profile() {
  const { authTokens, user } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState([])
  const [organisedEvents, setOrganisedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])
  const [currOrganisedPage, setCurrOrganisedPage] = useState(1)
  const [organisedRecordsPerPage] = useState(1)
  const [currParticipatedPage, setCurrParticipatedPage] = useState(1)
  const [participatedRecordsPerPage] = useState(2)

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

  // Headers for authorization @ backend => Allows request to django
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

  const indexOfOrganisedLastRecord = currOrganisedPage * organisedRecordsPerPage;
  const indexOfOrganisedFirstRecord = indexOfOrganisedLastRecord - organisedRecordsPerPage;
  const currentOrganisedRecords = organisedEvents.slice(indexOfOrganisedFirstRecord, indexOfOrganisedLastRecord);
  const nOrganisedPages = Math.ceil(organisedEvents.length / organisedRecordsPerPage)

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
          {currentOrganisedRecords.map((event:Event, i) => (
            <tr key={i}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{format(new Date(event.start), "Pp")}</td>
              <td>{format(new Date(event.end), "Pp")}</td>
              <td>{event.location}</td>
              <td>${event.budget}</td>
              <td>
                <Button onClick={() => {
                  navigate('/EditEvent', {state:{evt:event}})
                }}>
                  Edit
                </Button>
                <Button onClick={async() => {
                  const response = await axios.delete(`http://127.0.0.1:8000/events/${event.id}/`, config)
                  console.log(response)
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        nPages={nOrganisedPages}
        currentPage={currOrganisedPage}
        setCurrentPage={setCurrOrganisedPage}
      />
    </div>
  )
  
  const indexOfParticipatedLastRecord = currParticipatedPage * participatedRecordsPerPage;
  const indexOfParticipatedFirstRecord = indexOfParticipatedLastRecord - participatedRecordsPerPage;
  const currentParticipatedRecords = participatedEvents.slice(indexOfParticipatedFirstRecord, indexOfParticipatedLastRecord);
  const nParticipatedPages = Math.ceil(participatedEvents.length / participatedRecordsPerPage)

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
          {currentParticipatedRecords.map((event:Event, i) => (
            <tr key={i}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{format(new Date(event.start), "Pp")}</td>
              <td>{format(new Date(event.end), "Pp")}</td>
              <td>{event.location}</td>
              <td>${event.budget}</td>
              <td>
                <Button onClick={() => {
                  navigate(`/Event/${event.id}`)
                }}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        nPages={nParticipatedPages}
        currentPage={currParticipatedPage}
        setCurrentPage={setCurrParticipatedPage}
      />
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