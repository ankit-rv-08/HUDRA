import React, { useState, useEffect } from "react";
import API_URL from "./api";
import "./App.css";

function App() {

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Load tasks from backend
  useEffect(() => {

    fetch(`${API_URL}/api/tasks`)
      .then(res => res.json())
      .then(data => {

        // safety check so React does not crash
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }

        setLoading(false);

      })
      .catch(error => {
        console.error("API error:", error);
        setTasks([]);
        setLoading(false);
      });

  }, []);

  // Add new task
  const addTask = () => {

    if (!taskTitle.trim()) return;

    fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: taskTitle })
    })
      .then(res => res.json())
      .then(newTask => {

        setTasks([...tasks, newTask]);
        setTaskTitle("");

      })
      .catch(err => console.error(err));

  };

  if (loading) {
    return (
      <div className="container">
        <h1>HUDRA Task Marketplace</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (

    <div className="container">

      <h1>HUDRA Task Marketplace</h1>

      <div className="task-input">

        <input
          type="text"
          placeholder="Enter task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <button onClick={addTask}>
          Add Task
        </button>

      </div>

      <div className="task-list">

        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              {task.title}
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default App;