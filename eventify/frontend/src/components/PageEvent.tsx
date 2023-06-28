import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;

  return (
    <div>
      <h3 style={{marginTop:"20px"}}>{event.name}</h3>
      <hr />
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <hr />
      <p>Description:</p>
      <p style={{minHeight:"8em"}}>{event.description}</p>
      <hr />
      <DisplayActivity event={event}/>
    </div>
  );
}