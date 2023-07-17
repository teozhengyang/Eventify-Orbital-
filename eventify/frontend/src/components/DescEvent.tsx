import { Alert, Button, ButtonGroup } from "react-bootstrap";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import NewEventModalContext from "../context/NewEventModalContext";
import AuthContext from "../context/AuthContext";
import { Event, AuthUser, AuthToken, emptyEvent } from "../utils/Types";
import axios from "axios";


export default function DescEvent({event}: {event: Event}) {
  const { setShowModal, setSelectedEvent } = useContext(NewEventModalContext)
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser }
  const [showAlert, setShowAlert] = useState(false)

  // Headers for authorization @ backend => Allows Get/Post request for activity data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    const time = setTimeout(() => {
      setSelectedEvent(emptyEvent)
    }, 140)
    return () => {
      clearTimeout(time)
    }
  }

  // Delete event
  const remove = async() => {
    const response = await axios.delete(`/api/events/${event.id}/`, config)
    console.log(response)
    closeModal()
  }

  // Go to edit event page
  const navigate = useNavigate()
  const edit = () => {
    navigate('/EditEvent', {state:{evt:event}})
    closeModal()
  }

  // Go to individual event page
  const view = () => {
    navigate(`/Event/${event.id}`, {state:{evt:event}})
    closeModal()
  }

  // Leave event if participant (removes user from participant array)
  const leave = async() => {
    try {
      const response = await axios.put(`/api/events/${event.id}/`, {
        organizers: event.organizers.filter(organiser => organiser != user.user_id),
        participants: event.participants.filter(participant => participant != user.user_id)
      }, config);
      console.log(response.data)
      // Cannot leave if user is the only organizer
      if (response.data.organizers[0] == "This list may not be empty.") {
        setShowAlert(true)
      } else {
        closeModal()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const organiserButtons = (
    <>
      <Button variant="secondary" onClick={edit}>Edit</Button>
      <Button variant="secondary" onClick={remove}>Delete</Button>
    </>
  )

  return (
    <>
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>{event.description}</p>
      <ButtonGroup>
        <Button variant="secondary" onClick={view}>View</Button>
        {event.organizers.includes(user.user_id) && organiserButtons}
        <Button variant="secondary" onClick={leave}>Leave</Button>
      </ButtonGroup>
      <Alert style={{marginTop:"10px"}} variant="warning" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        <p>Cannot leave event as User is the only Organiser</p>
        <p>Delete the event or promote a participant to organiser</p>
      </Alert>
    </>
  )
}