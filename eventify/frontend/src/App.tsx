import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState("");
  const [request, setRequest] = useState("");
  /**
   * Gets api data from django backend using Axios
   * For now using the entire link in .get() since setting up a proxy for relative path
   * seems to be slightly different in vite compared to CRA
   */
  const getData = (submission) => {
    submission.preventDefault();
    axios
      .get("http://127.0.0.1:8000/api/events/")
      .then((res) => {
        console.log(res);
        setData("");
        res.data.forEach((event) => {
          if (event.name == request) {
            setData(event);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const events = (
    <div>
      <h2>{data.name}</h2>
      <p>{"Description: " + data.description}</p>
      <p>{"Weather: " + data.weather + " Budget: $" + data.budget}</p>
    </div>
  )

  return (
    <>
      <div className="App">
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

export default App;
