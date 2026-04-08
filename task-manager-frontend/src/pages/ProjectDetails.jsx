import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function ProjectDetails() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = useCallback(
    () => API.get(`/projects/${id}/tasks`).then((res) => res.data.data),
    [id]
  );

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await loadTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    await API.delete(`/projects/${id}/tasks/${taskId}`);
    toast.success("Task deleted");
    fetchTasks();
  };

  const markComplete = async (taskId) => {
    await API.put(`/projects/${id}/tasks/${taskId}`, {
      status: "completed",
    });
    toast.success("Task completed");
    fetchTasks();
  };

  const updateTask = async () => {
    await API.put(`/projects/${id}/tasks/${editTask.id}`, editTask);
    toast.success("Task updated");
    setEditTask(null);
    fetchTasks();
  };

  useEffect(() => {
    let cancelled = false;
    loadTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadTasks]);

  return (
    <div className="container">
      <h1>📂 Tasks</h1>

      <TaskForm projectId={id} refresh={fetchTasks} />

      {loading ? <Loader /> : null}

      {editTask && (
        <div className="card">
          <h3>Edit Task</h3>
          <input
            value={editTask.title}
            onChange={(e) =>
              setEditTask({ ...editTask, title: e.target.value })
            }
          />
          <textarea
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
          />
          <button className="btn-primary" onClick={updateTask}>
            Save
          </button>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <span
            style={{
              background: task.status === "completed" ? "green" : "orange",
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            {task.status}
          </span>

          <div style={{ marginTop: "10px" }}>
            <button
              className="btn-success"
              onClick={() => markComplete(task.id)}
            >
              Complete
            </button>

            <button
              className="btn-primary"
              onClick={() => setEditTask(task)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>

            <button
              className="btn-danger"
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}