import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import NewEventModalContext from "../context/NewEventModalContext";
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { User, AuthToken, Event } from "../utils/Types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "/static/css/register.css";

export default function NewEvent({defaultStart, defaultEnd, template}: {defaultStart: Date; defaultEnd: Date; template: Event}) {
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const { setShowModal } = useContext(NewEventModalContext)
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken }

  const [users, setUsers] = useState<Array<User>>([])
  const [selectedOrganisers, setSelectedOrganisers] = useState<Array<User>>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Array<User>>([])

  const [category, setCategory] = useState({value: "", label: ""})
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked)
  };

  const categoryOptions = [
    { value: 'Social', label: 'Social' },
    { value: 'Educational', label: 'Educational' },
    { value: 'Community', label: 'Community' },
    { value: 'Others', label: 'Others' },
  ];

  // Get all users
  useEffect(() => {
    getUsers();
  }, [])

  // End time/date for event >= start
  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate)
    }
  }, [startDate])

  // Start time/date for event <= end
  useEffect(() => {
    if (endDate < startDate) {
      setStartDate(endDate)
    }
  }, [endDate])

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getUsers = async () => {
    const response = await axios.get('/api/users/', config)
    const data = response.data
    setUsers(data)
    console.log(data)
  }

  const navigate = useNavigate()

  const AddEventInfo = async(e: React.FormEvent<HTMLFormElement>) => {
    console.log(isChecked)
    console.log(category)
    e.preventDefault()
    try {
      const target = e.target as typeof e.target & {
        title: {value: string}
        description: {value: string}
        location: {value: string}
        budget: {value: number}
      }
      const response = await axios.post('/api/events/', {
        name: target.title.value,
        description: target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: target.location.value,
        budget: target.budget.value,
        organizers: selectedOrganisers.map((org:User) => org.id),
        participants: selectedParticipants.map((par:User) => par.id),
        category: category.value,
        shared: isChecked
      }, config);
      console.log(response.data)
      setShowModal(false)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <Form onSubmit={AddEventInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter title"
            defaultValue={template.name}
            required
          />
        </FloatingLabel>
        <hr />
        <Row>
          <Form.Group as={Col}>
            <Form.Label>From</Form.Label>
            <DatePicker
              className="datepicker"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              timeCaption="Start time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>To</Form.Label>
            <DatePicker
              className="datepicker"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showTimeSelect
              timeCaption="End time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
              required
            />
          </Form.Group>
        </Row>
        <hr />
        <FloatingLabel controlId="floatingInput" label="Description">
          <Form.Control 
            className="event-form-field" 
            as="textarea" 
            style={{ height: '120px' }} 
            name="description"
            defaultValue={template.description}
            placeholder="Description"
          />
        </FloatingLabel>

        <Row>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Location" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                type="text" 
                name="location"
                defaultValue={template.location}
                placeholder="Location"
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Budget" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field"
                defaultValue={template.budget} 
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please input a budget.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Select Organisers:</Form.Label>
            <Select
              options={users}
              placeholder="Search organisers"
              getOptionLabel={(option) => option.username}
              getOptionValue={(option) => option.id.toString()}
              onChange={(data) => setSelectedOrganisers(Array.from(data))}
              isSearchable={true}
              isMulti
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Select Participants:</Form.Label>
            <Select
              options={users}
              placeholder="Search participants"
              getOptionLabel={(option) => option.username}
              getOptionValue={(option) => option.id.toString()}
              onChange={(data) => setSelectedParticipants(Array.from(data))}
              isSearchable={true}
              isMulti
            />
          </Form.Group>
        </Row>
        <Row>
        <Form.Group as={Col}>
            <Form.Label>Select Category:</Form.Label>
            <Select
              options={categoryOptions}
              placeholder="Search category"
              onChange={(data) => setCategory(data)}
              isSearchable={true}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Add to marketplace:</Form.Label>
            <Form.Check type="checkbox" label="Share on marketplace" onChange={handleCheckboxChange} />
          </Form.Group>
        </Row>
        <hr />
        <Button variant="primary" type="submit">Create Event</Button>
      </Form>
    </div>
  )
}