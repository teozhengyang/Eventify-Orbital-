import { Button } from "react-bootstrap";
import { useContext } from "react";
import NewEventModalContext from "../context/NewEventModalContext";
import AuthContext from "../context/AuthContext";
import axios from "axios";

// Might consider changing to dayjs idk
export default function EventDesc({info}={info: Object}) {
  const { setShowModal } = useContext(NewEventModalContext)
  const { authTokens } = useContext(AuthContext)


  const remove = async() => {
    const response = await axios.delete('http://127.0.0.1:8000/events/', {
      headers:{
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      data: info
    })
    console.log(response)
    setShowModal(false)
  }

  return (
    <>
      <p>{info.description}</p>
      <p>{new Date(info.start).toLocaleString()} - {new Date(info.end).toLocaleString()}</p>
      <Button onClick={remove}>Delete Event (temp)</Button>
      <Button>Edit (temp)</Button>
    </>
  )
}