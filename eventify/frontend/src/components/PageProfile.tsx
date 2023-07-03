import { useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { format } from 'date-fns';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Pagination from '../utils/Pagination';
import "/static/css/display.css";
import { AuthToken, AuthUser, LogoutUser, Event, emptyUser } from "../utils/Types";


export default function Profile() {
  const { authTokens, user, logoutUser } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser, logoutUser: LogoutUser};
  const [currUser, setCurrUser] = useState(emptyUser)
  const [eventList, setEventList] = useState([])      // The full list of user events
  const [displayList, setDisplayList] = useState([])  // A filtered list based on display preference to show the user

  const [currPage, setCurrPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(5)

  const [showAlert, setShowAlert] = useState(false)   // Alert for leaving event as single organiser


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
    // Somehow changing this to /api (proxy set in vite.config.ts) instead of the full address breaks the profile page
    const userResponse = await axios.get(`https://eventify-n2c5.onrender.com/user/${user.user_id}`, config);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    
    const eventsResponse = await axios.get('https://eventify-n2c5.onrender.com/events/', config)
    setEventList(eventsResponse.data)
    setDisplayList(eventsResponse.data)
  };

  const setDisplay = (e:number) => {
    if (e == 0) {
      setDisplayList(eventList)
    } else {
      const filteredEvents = eventList.filter((event:Event) => new Date(event.end) > new Date())
                                      .sort((event1:Event, event2:Event) => new Date(event2.start).valueOf() - new Date(event1.start).valueOf())
      setDisplayList(filteredEvents)
    }
  }

  // If user is deleted, first delete events where said user is the only organiser
  const deleteEventUser = async (event:Event) => {
    const response = await axios.delete(`https://eventify-n2c5.onrender.com/events/${event.id}/`, config)
    console.log(response)
  }
  const deleteUser = () => {
    eventList.filter((event:Event) => (event.organizers.length == 1) && (event.organizers[0] == user.user_id))
             .map((event:Event) => deleteEventUser(event))

    const response = axios.delete(`https://eventify-n2c5.onrender.com/user/${user.user_id}/`, config)
    console.log(response)
    alert('User deleted')
    logoutUser()
  }

  const indexOfLastRecord = currPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = displayList.slice(indexOfFirstRecord, indexOfLastRecord);
  const nOrganisedPages = Math.ceil(displayList.length / recordsPerPage)

  const eventDiv = (
    <div>
      <table>
        <thead>
          <tr className="table-head">
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
            <tr key={i} className="table-row">
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{format(new Date(event.start), "dd/MM/yyyy, p")}</td>
              <td>{format(new Date(event.end), "dd/MM/yyyy, p")}</td>
              <td>{event.location}</td>
              <td className="data-align-left">${event.budget}</td>
              <td className="data-align-left">
                <ButtonGroup>
                  <Button onClick={() => {
                    navigate(`/Event/${event.id}`, {state:{evt:event}})
                  }}>
                    View
                  </Button>

                  <Button onClick={async() => {
                    try {
                      const response = await axios.put(`https://eventify-n2c5.onrender.com/events/${event.id}/`, {
                        organizers: event.organizers.filter(organiser => organiser != user.user_id),
                        participants: event.participants.filter(participant => participant != user.user_id)
                      }, config);
                      console.log(response.data)
                      // Only organiser cannot leave event
                      if (response.data.organizers[0] == "This list may not be empty.") {
                        setShowAlert(true)
                      }
                      getCurrUser()
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
                        const response = await axios.delete(`https://eventify-n2c5.onrender.com/events/${event.id}/`, config)
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

      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header closeButton style={{color:"#664D03", backgroundColor:"#FFF3CD", borderRadius:"5px"}}>
          Cannot leave event as User is the only organiser
          <br />
          Delete the event or promote a participant to organiser
        </Modal.Header>
      </Modal>

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
      <p>
        Actions: 
        <Button className="margin-button" onClick={deleteUser}>Delete Profile</Button>|
        <Button className="margin-button" onClick={() => {
          navigate('/ResetPassword')
        }}>
          Reset Password
        </Button>|
        <Button className="margin-button" onClick={() => {
            navigate(`/UpdateUser`, {state:{evt:user}})
        }}>
          Update Profile
        </Button>
      </p>

      <header className="display-header">
        <h4 id="display-title">Events</h4>
        <form>
          <select style={{width:"7em"}} className="profile-display-selector" onChange={e => {setDisplay(parseInt(e.target.value))}}>
            <option value="0">All</option>
            <option value="1">Upcoming</option>
          </select>
          <select style={{width:"3em"}} className="profile-display-selector" value={recordsPerPage} onChange={e => setRecordsPerPage(parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </form>
      </header>

      <hr />
      {eventList && eventDiv}
    </div>
  )
}