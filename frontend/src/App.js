import React, { useState, useEffect } from "react";
import API_URL from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
  fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: taskTitle })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    setTasks([...tasks, data]);
    setTaskTitle("");
  })
  .catch(err => console.error(err));
};

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
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;