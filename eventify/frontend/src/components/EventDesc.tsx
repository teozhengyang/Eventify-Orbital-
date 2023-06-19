import { Button, ButtonGroup } from "react-bootstrap";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import NewEventModalContext from "../context/NewEventModalContext";
import AuthContext from "../context/AuthContext";
import axios from "axios";

export default function EventDesc({event}={event: Object}) {
  const { setShowModal, setSelectedEvent } = useContext(NewEventModalContext)
  const { authTokens, user } = useContext(AuthContext)

  // Headers for authorization @ backend => Allows Get/Post request for activity data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    setTimeout(() => {
      setSelectedEvent(null)
    }, 120)
  }

  // Delete event
  const remove = async() => {
    const response = await axios.delete(`http://127.0.0.1:8000/events/${event.id}/`, config)
    console.log(response)
    closeModal()
  }

  // Go to edit event page
  const navigate = useNavigate()
  const edit = () => {
    navigate('/EditEvent', {state:{evt:event}})
  }

  // Go to individual event page
  const view = () => {
    navigate(`/Event/${event.id}`, {state:{evt:event}})
  }

  // Leave event if participant (removes user from participant array)
  const leave = async() => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/events/${info.id}/`, {
        organizers: event.organizers.filter(organiser => organiser != user.user_id),
        participants: event.participants.filter(participant => participant != user.user_id)
      }, config);
      console.log(response.data)
      closeModal()
    } catch (error) {
      console.error(error.response)
    }
  }

  const organiserButtons = (
    <>
      <Button variant="secondary" onClick={remove}>Delete</Button>
      <Button variant="secondary" onClick={edit}>Edit</Button>
    </>
  )

  return (
    <>
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>{event.description}</p>
      <ButtonGroup>
        <Button variant="secondary" onClick={view}>View</Button>
        <Button variant="secondary" onClick={leave}>Leave</Button>
        {event.organizers.includes(user.user_id) && organiserButtons}
      </ButtonGroup>
    </>
  )
}