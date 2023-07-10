import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { User } from "src/utils/Types";
import "/static/css/register.css";
import { AuthToken } from "src/utils/Types";


export default function CreateEventTemplate() {
  // Get event data from EventDesc.tsx/PageProfile.tsx and saves it as a const, to be used for default values
  const location = useLocation()
  const event = location.state.evt

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + (new Date(event.end).getTime() - new Date(event.start).getTime())));

  const [users, setUsers] = useState<Array<User>>([])
  const [selectedOrganisers, setSelectedOrganisers] = useState<Array<User>>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Array<User>>([])
  const [category, setCategory] = useState()
  const [isChecked, setIsChecked] = useState(false);

  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken }

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

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

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

  const getUsers = async () => {
    const response = await axios.get('/api/users/', config)
    const data = response.data
    setUsers(data)
    console.log(data)
    setCategory(event.category)   
  }

  // For redirect after form submit
  const navigate = useNavigate()

  // Update event
  const UpdateEventInfo = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        title: {value: string}
        description: {value: string}
        location: {value: string}
        budget: {value: number}
        shared: {value: boolean}
      }
      const response = await axios.post('/api/events/', {
        name: target.title.value,
        description: target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: target.location.value,
        budget: target.budget.value,
        organizers: selectedOrganisers.map((organiser: User) => organiser.id),
        participants: selectedParticipants.map((participant: User) => participant.id),
        category: category.value,
        shared: isChecked
      }, config);
      console.log(response.data)
      alert('Event created successfully')
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <Form onSubmit={UpdateEventInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter username" 
            defaultValue={event.name}
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
            style={{ height: '120px'}} 
            name="description" 
            placeholder="Description" 
            defaultValue={event.description}
          />
        </FloatingLabel>

        <Row>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Location" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                type="text" 
                name="location" 
                placeholder="Location" 
                defaultValue={event.location}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Budget" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
                defaultValue={event.budget}
                required
              />
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
              value={categoryOptions.find(chosenCategory => chosenCategory.value === category)}
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