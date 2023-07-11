import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;

  const navigate = useNavigate()

  const templateButton = (
    <Button onClick={() => {navigate('/NewEvent', {state:{evt:event}})}} disabled={!event.shared}>
      Use Template
    </Button>
  )

  return (
    <>
      <h3 style={{marginTop:"20px"}}>{event.name}</h3>
      {event.shared && templateButton}
      <hr />
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>Location: {event.location}</p>
      <hr />
      <p>Description:</p>
      <p style={{minHeight:"8em"}}>
        {event.description} 
        <br /> <br /> 
      </p>
      <hr />
      <DisplayActivity event={event}/>
    </>
  );
}