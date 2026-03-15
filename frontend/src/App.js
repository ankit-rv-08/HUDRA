import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks from Django API
  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Create new task
  const createTask = () => {
    fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setTitle("");
      })
      .catch((error) => console.error("Error creating task:", error));
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>HUDRA Task Manager</h1>

      {/* Input to create task */}
      <input
        type="text"
        placeholder="Enter task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button onClick={createTask} style={{ padding: "10px" }}>
        Add Task
      </button>

      {/* Task list */}
      <h2 style={{ marginTop: "30px" }}>Tasks</h2>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;