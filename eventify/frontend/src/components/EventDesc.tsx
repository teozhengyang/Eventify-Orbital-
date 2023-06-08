import { Button } from "react-bootstrap";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import NewEventModalContext from "../context/NewEventModalContext";
import AuthContext from "../context/AuthContext";
import axios from "axios";

// Might consider changing to dayjs idk
export default function EventDesc({info}={info: Object}) {
  const { setShowModal, setSelectedEvent } = useContext(NewEventModalContext)
  const { authTokens } = useContext(AuthContext)

  // Delete event
  const remove = async() => {
    const response = await axios.delete(`http://127.0.0.1:8000/events/${info.id}/`, {
      headers:{
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
    console.log(response)
    setShowModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    setTimeout(() => {
      setSelectedEvent(null)
    }, 120)
  }

  // Go to edit event page
  const navigate = useNavigate()
  const edit = () => {
    navigate('/EditEvent', {state:{evt:info}})
    setShowModal(false)
  }

  return (
    <>
      <p>{info.description}</p>
      <p>{new Date(info.start).toLocaleString()} - {new Date(info.end).toLocaleString()}</p>
      <Button onClick={remove}>Delete Event (temp)</Button>
      <Button onClick={edit}>Edit (temp)</Button>
    </>
  )
}