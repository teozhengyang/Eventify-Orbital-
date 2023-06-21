import { useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { format } from 'date-fns';
import "/static/css/profile.css";
import { Button, ButtonGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Pagination from '../utils/Pagination';

type Event = {
  id?: number;
  name?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  budget?: number;
  organizers?: Array<number>;
  participants?: Array<number>;
}

export default function Profile() {
  const { authTokens, user, logoutUser } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState([])
  const [eventList, setEventList] = useState([])

  const [currPage, setCurrPage] = useState(1)
  const [recordsPerPage] = useState(2)


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
    const userResponse = await axios.get(`http://127.0.0.1:8000/user/${user.user_id}`, config);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    
    const eventsResponse = await axios.get('http://127.0.0.1:8000/events/', config)
    const filteredEventsResponse = eventsResponse.data.filter(event => new Date(event.end) > new Date()).sort((event1, event2) => new Date(event2.start) - new Date(event1.start))
    console.log(filteredEventsResponse)
    setEventList(filteredEventsResponse)
  };

  const deleteUser = () => {
    const response = axios.delete(`http://127.0.0.1:8000/user/${user.user_id}/`, config)
    console.log(response)
    alert('User deleted')
    logoutUser()
  }

  const indexOfLastRecord = currPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = eventList.slice(indexOfFirstRecord, indexOfLastRecord);
  const nOrganisedPages = Math.ceil(eventList.length / recordsPerPage)

  const eventDiv = (
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
          {currentRecords.map((event:Event, i) => (
            <tr key={i}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{format(new Date(event.start), "dd/MM/yyyy, p")}</td>
              <td>{format(new Date(event.end), "dd/MM/yyyy, p")}</td>
              <td>{event.location}</td>
              <td>${event.budget}</td>
              <td>
                <ButtonGroup>
                  <Button onClick={() => {
                    navigate(`/Event/${event.id}`, {state:{evt:event}})
                  }}>
                    View
                  </Button>

                  <Button onClick={async() => {
                    try {
                      const response = await axios.put(`http://127.0.0.1:8000/events/${event.id}/`, {
                        organizers: event.organizers.filter(organiser => organiser != user.user_id),
                        participants: event.participants.filter(participant => participant != user.user_id)
                      }, config);
                      console.log(response.data)
                    } catch (error) {
                      console.error(error)
                    }
                  }}>
                    Leave
                  </Button>
                  {event.organizers?.includes(user.user_id) && (
                    <>
                      <Button onClick={() => {
                        navigate('/EditEvent', {state:{evt:event}})
                      }}>
                        Edit
                      </Button>

                      <Button onClick={async() => {
                        const response = await axios.delete(`http://127.0.0.1:8000/events/${event.id}/`, config)
                        getCurrUser()
                        console.log(response)
                      }}>
                        Delete
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        nPages={nOrganisedPages}
        currentPage={currPage}
        setCurrentPage={setCurrPage}
      />
    </div>
  )

  return (
    <div>
      <h4 className='header'>User Information</h4>
      <p>
        Name: {currUser.first_name} {currUser.last_name} | Email: {currUser.email} 
      </p>  
      <div>
        <p>Actions: 
          <Button onClick={deleteUser}>Delete Profile</Button> 
          <Button onClick={() => {
            navigate('/ResetPassword')
          }}>
            Reset Password
          </Button> 
          <Button onClick={() => {
            navigate(`/UpdateUser`, {state:{evt:user}})
          }}>
            Update Profile
          </Button>
        </p>
      </div>
      <h4 className='header'> Events </h4>
      <hr />
      {eventList && eventDiv}
    </div>
  )
}