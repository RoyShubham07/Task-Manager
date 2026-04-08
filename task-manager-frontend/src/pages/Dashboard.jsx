import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState(null);

  const loadProjects = useCallback(
    () => API.get("/projects").then((res) => res.data.data),
    []
  );

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await loadProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    await API.delete(`/projects/${id}`);
    toast.success("Project deleted");
    fetchProjects();
  };

  const updateProject = async () => {
    await API.put(`/projects/${editProject.id}`, editProject);
    toast.success("Project updated");
    setEditProject(null);
    fetchProjects();
  };

  useEffect(() => {
    let cancelled = false;
    loadProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadProjects]);

  return (
    <div className="container">
      <h1>📊 Dashboard</h1>

      <ProjectForm refresh={fetchProjects} />

      {loading ? <Loader /> : null}

      {editProject && (
        <div className="card">
          <h3>Edit Project</h3>
          <input
            value={editProject.name}
            onChange={(e) =>
              setEditProject({ ...editProject, name: e.target.value })
            }
          />
          <textarea
            value={editProject.description}
            onChange={(e) =>
              setEditProject({ ...editProject, description: e.target.value })
            }
          />
          <button className="btn-primary" onClick={updateProject}>
            Save
          </button>
        </div>
      )}

      {projects.map((project) => (
        <div key={project.id} className="card">
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          <Link to={`/project/${project.id}`}>View Tasks →</Link>

          <div style={{ marginTop: "10px" }}>
            <button
              className="btn-primary"
              onClick={() => setEditProject(project)}
            >
              Edit
            </button>

            <button
              className="btn-danger"
              onClick={() => deleteProject(project.id)}
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