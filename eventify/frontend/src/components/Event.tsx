import React, { useState, useContext } from "react";
import axios from "axios";

/**
 * Temporary component to test POST request from frontend to backend
 * Might be used for actual event creation, will have to change time fields and user fields
 */

export default function Event() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");



  let AddEventInfo = async () => {
    let formField = new FormData()

    formField.append('name', title)
    formField.append('description', description)
    formField.append('start', "")
    formField.append('end', "")
    formField.append('location', location)
    formField.append('weather', "Sunny")
    formField.append('budget', budget)
    formField.append('organizers', [1])
    formField.append('participants', [3])

    await axios({
      method: 'POST',
      url: '/api/events/',
      data: formField
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <>
      <h1>Add Event</h1>
      <div>
        <input type="text" placeholder="Enter Event name" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Enter Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Enter Location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="Enter Budget" name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <button onClick={AddEventInfo}>Add Event</button>
      </div>
    </>
  )
}