import { useState } from "react";
import API from "../services/api";

export default function TaskForm({ projectId, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !dueDate) return;

    try {
      await API.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        due_date: dueDate,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      refresh();
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: "10px" }}>📝 Add Task</h3>

      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button
        className="btn-primary"
        style={{ marginTop: "12px", width: "100%" }}
        onClick={handleSubmit}
      >
        Add Task
      </button>
    </div>
  );
}