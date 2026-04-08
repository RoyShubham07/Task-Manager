import { useState } from "react";
import API from "../services/api";

export default function ProjectForm({ refresh }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name || !description) return;

    try {
      await API.post("/projects", { name, description });
      setName("");
      setDescription("");
      refresh();
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: "10px" }}>➕ New Project</h3>

      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="btn-primary"
        style={{ marginTop: "12px", width: "100%" }}
        onClick={handleSubmit}
      >
        Create Project
      </button>
    </div>
  );
}
