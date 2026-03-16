import React, { useEffect, useState } from "react";
import API_URL from "./api";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/tasks/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      })
      .catch(err => {
        console.log("API error:", err);
        setTasks([]);
      });
  }, []);

  const addTask = () => {

    if (!title || !location || !budget) {
      alert("Please fill all fields");
      return;
    }

    fetch(`${API_URL}/api/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        location: location,
        budget: budget
      })
    })
      .then(res => res.json())
      .then(data => {
        setTasks([...tasks, data]);
        setTitle("");
        setLocation("");
        setBudget("");
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.page}>

      {/* LANDING SECTION */}
      <div style={styles.hero}>
        <h1>HUDRA</h1>
        <h2>Local Task Marketplace</h2>
        <p>
          Post real-world tasks and get them done by trusted people nearby.
        </p>
      </div>

      {/* POST TASK */}
      <div style={styles.postBox}>
        <h3>Post a Task</h3>

        <input
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          style={styles.input}
        />

        <button onClick={addTask} style={styles.button}>
          Add Task
        </button>
      </div>

      {/* TASK MARKETPLACE */}
      <div style={styles.marketplace}>
        <h2>Available Tasks</h2>

        {tasks.length === 0 && (
          <p>No tasks yet. Post the first one!</p>
        )}

        {tasks.map(task => (
          <div key={task.id} style={styles.card}>
            <h3>{task.title}</h3>
            <p>📍 {task.location}</p>
            <p>💰 ₹{task.budget}</p>
            <button style={styles.applyButton}>
              Apply
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

const styles = {

  page: {
    fontFamily: "Arial",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    padding: "30px",
    color: "white"
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px"
  },

  postBox: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "40px",
    maxWidth: "500px",
    margin: "auto"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "none"
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  marketplace: {
    marginTop: "40px"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px"
  },

  applyButton: {
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  }

};

export default App;