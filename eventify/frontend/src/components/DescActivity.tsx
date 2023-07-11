import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import format from "date-fns/format";
import { Button, ButtonGroup } from "react-bootstrap";
import { Activity, Event, AuthToken, AuthUser, emptyActivity } from "../utils/Types";

export default function DescActivity({activity, event}: {activity:Activity; event:Event}) {
  
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser }
  const { setActivityModal, setSelectedActivity } = useContext(NewEventModalContext)

  const closeModal = () => {
    setActivityModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    setTimeout(() => {
      setSelectedActivity(emptyActivity)
    }, 140)
  }

  const navigate = useNavigate()
  const editActivity = () => {
    navigate('/EditActivity', {state:{act:activity, evt:event}})
    closeModal()
  }

  const deleteActivity = async() => {
    const response = await axios.delete(`/api/activities/${activity.id}/`, {headers:{'Authorization': 'Bearer ' + String(authTokens.access)}})
    console.log(response)
    closeModal()
  }

  const organiserButtons = (
    <ButtonGroup>
      <Button variant="secondary" onClick={editActivity}>Edit</Button>
      <Button variant="secondary" onClick={deleteActivity}>Delete</Button>
    </ButtonGroup>
  )

  return (
    <>
      <p>{format(new Date(activity.start), "dd/MM/yyyy, p")} - {format(new Date(activity.end), "dd/MM/yyyy, p")}</p>
      <p>Location: {activity.location}</p>
      <p>{activity.description}</p>
      {event.organizers?.includes(user.user_id) && organiserButtons}
    </>
  )
}