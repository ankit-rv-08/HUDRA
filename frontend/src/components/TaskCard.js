import React from "react";
import axios from "axios";

function TaskCard({ task }) {
  if (!task) return null;

const handleApply = () => {
  axios.post("http://127.0.0.1:8000/api/apply/", {
    task_id: task.id,
    username: "ankith"
  })
  .then(() => alert("Applied successfully"))
  .catch(err => console.error(err));
};

  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-400">{task.description}</p>
      <p>📍 {task.location}</p>
      <p>💰 {task.budget}</p>

      <button
        onClick={handleApply}
        className="bg-white text-black px-4 py-2 mt-3 rounded"
      >
        Apply
      </button>
    </div>
  );
}

export default TaskCard;