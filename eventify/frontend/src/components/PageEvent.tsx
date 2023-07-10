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

  return (
    <div>
      <h3 style={{marginTop:"20px"}}>{event.name}</h3>
      <hr />
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>Location: {event.location}</p>
      <hr />
      <p>Description:</p>
      <p style={{minHeight:"8em"}}>
        {event.description} 
        <br /> <br /> 
        <Button onClick={() => {navigate('/CreateEventTemplate', {state:{evt:event}})}}>Use Template</Button>
      </p>
      <hr />
      <DisplayActivity event={event}/>
    </div>
  );
}