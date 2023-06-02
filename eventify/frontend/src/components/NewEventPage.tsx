import { useState, useEffect } from "react"
import axios from "axios"
import { Form, Button } from "react-bootstrap"

export default function NewEventPage() {
    const [users, setUsers] = useState([])
    const [selectedOrganisers, setSelectedOrganisers] = useState([])
    const [selectedParticipants, setSelectedParticipants] = useState([])

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/users/')
        const data = response.data
        setUsers(data)
        console.log(data)
    }

    return (
        <div>
            <Button>WIP</Button>
           <Form>
            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>Title: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="text" name="title" placeholder="Enter title" /></div>
            </Form.Group>  
                
            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>Description: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="textarea" name="password" placeholder="Enter description" /></div>
            </Form.Group>

            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>Location: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="text" name="location" placeholder="Enter location" /></div>
            </Form.Group>

            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>Budget: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="number" min="0" step="0.01" name="budget" placeholder="Enter budget" /></div>
            </Form.Group>

            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>Start time: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="text" name="start" placeholder="Enter start time" /></div>
            </Form.Group>

            <Form.Group className="own-form-item">
                <div><Form.Label className='own-form-label'>End time: </Form.Label></div>
                <div><Form.Control className='own-form-field' type="text" name="end" placeholder="Enter end time" /></div>
            </Form.Group>

            <Form.Group>
                <Form.Label>Select Organisers:</Form.Label>
                <Form.Control as="select" multiple>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.username}
                    </option>
                ))}
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Select Participants:</Form.Label>
                <Form.Control as="select" multiple>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.username}
                    </option>
                ))}
                </Form.Control>
            </Form.Group>

            <Button variant="primary" className="own-form-button" type="submit">Create New Event</Button>
        </Form> 
        </div>
        
    )
}
