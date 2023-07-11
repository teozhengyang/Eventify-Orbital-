import NewEvent from "./NewEvent"
import { useLocation } from "react-router-dom"
import { emptyEvent } from "../utils/Types"

export default function NewEventPage() {
  // No. of milliseconds in 15 mins, used to round off default date to nearest 15 minutes
  const ms = 900000
  const defaultRounded = new Date(Math.round(new Date().getTime() / ms) * ms)
  let end = defaultRounded

  let template = emptyEvent

  // If state passed via location, there is a template to be used
  const location = useLocation().state
  if (location != null) {
    const event = location.evt
    end = new Date(defaultRounded.getTime() + (new Date(event.end).getTime() - new Date(event.start).getTime()))
    template = event
  }

  return (
    <NewEvent defaultStart={defaultRounded} defaultEnd={end} template={template}/>
  )
}
