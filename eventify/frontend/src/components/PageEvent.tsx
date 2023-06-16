import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";

type Event = {
  id?: number;
}

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;

  return (
    <div>
      <h3>{event.name}</h3>
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>Description:</p>
      <p>{event.description}</p>
      <br></br>
      <DisplayActivity event={event}/>
    </div>
  );
}