import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import NewEventModalContext from "../context/NewEventModalContext";

//idk why got red line here, it seems to import and work just fine
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Might be nice to change the form to a bootstrap one
export default function NewEvent({defaultdate}: {defaultdate: Date}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState(defaultdate);
  const [endDate, setEndDate] = useState(defaultdate);

  const { setShowModal } = useContext(NewEventModalContext)
  const { user } = useContext(AuthContext); // Set event creator as default organiser

  const navigate = useNavigate()

  const AddEventInfo = async () => {
    const formField = new FormData()

    formField.append('name', title)
    formField.append('description', description)
    formField.append('start', "")
    formField.append('end', "")
    formField.append('location', location)
    formField.append('weather', "Sunny")
    formField.append('budget', budget)
    formField.append('organizers', user.user_id)
    formField.append('participants', [3])
    formField.append('start', startDate.toJSON())
    formField.append('end', endDate.toJSON())

    await axios({
      method: 'POST',
      url: '/api/events/',
      data: formField
    }).then((response) => {
      console.log(response.data)
      navigate('/')
    }).catch((error) => {
      console.log(error.response)
    })
    setShowModal(false)
  }

  return (
    <div>
      <input type="text" placeholder="Enter Event name" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Enter Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Enter Location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="text" placeholder="Enter Budget" name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
      <DatePicker placeholderText="Select Start Date" selected={startDate} onChange={(date: Date) => setStartDate(date)}/>
      <DatePicker placeholderText="Select End Date" selected={endDate} onChange={(date: Date) => setEndDate(date)}/>
      <button onClick={AddEventInfo}>Add Event</button>
    </div>
  )
}