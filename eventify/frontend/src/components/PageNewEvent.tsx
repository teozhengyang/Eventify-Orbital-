import NewEvent from "./NewEvent"

export default function NewEventPage() {
  // No. of milliseconds in 15 mins, used to round off default date to nearest 15 minutes
  const ms = 900000
  return (
    <NewEvent defaultdate={new Date(Math.round(new Date().getTime() / ms) * ms)}/>
  )
}
