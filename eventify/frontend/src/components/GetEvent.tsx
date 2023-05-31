import { useState } from "react";
import "/static/css/App.css";
import axios from "axios";

/**
 * Temporary component to test GET request from backend, might be reused/replaced elsewhere
 */
export default function GetEvent() {
  const [data, setData] = useState("");
  const [request, setRequest] = useState("");

  /**
   * Gets api data from django backend using Axios, uses relative path set by proxy in vite.config.ts
   */
  const getData = async (submission) => {
    submission.preventDefault();
    const response = await axios.get("/api/events/");
    console.log(response);
    setData("")
    response.data.forEach((event) => {
      if (event.name == request) {
        setData(event);
      }
    });
  }

  const events = (
    <div>
      <h2>{data.name}</h2>
      <p>{"Description: " + data.description}</p>
      <p>{"Weather: " + data.weather + " Budget: $" + data.budget}</p>
    </div>
  )

  return (
    <>
      <div className="getTest">
        <form onSubmit={getData}>
          <label>
            Enter event name:
            <input type="text" value={request} onChange={(e) => setRequest(e.target.value)}/>
          </label>
          <input type="submit" />
        </form>
        {data && events}
      </div>
    </>
  );
}
