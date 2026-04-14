import { useEffect, useState } from "react";
import API from "../api/client";
import { Project } from "../types";
import { Link, useNavigate } from "react-router-dom";

import "./styles.css";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!name) {
      alert("Project name is required");
      return;
    }

    try {
      await API.post("/projects", {
        name,
        description,
        owner_id: "1",
        created_at: new Date().toISOString()
      });

      setName("");
      setDescription("");
      loadProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>Projects</h2>

        {/* CREATE PROJECT */}
        <div className="card">
          <h3 style={{ textAlign: "center" }}>Create Project</h3>

          <input
            className="input"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "1rem" }}
          />

          <input
            className="input"
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ margin: "1rem" }}
          />

          <button className="button" onClick={createProject}>
            Create Project
          </button>
        </div>

        {/* STATES */}
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* PROJECT LIST */}
        <div style={{ marginTop: 20 }}>
          {projects.length === 0 && !loading && (
            <p style={{ textAlign: "center" }}>No projects found</p>
          )}

          {currentProjects.map((p) => (
            <div key={p.id} className="projectCard">
              <div className="projectHeader">
                <div>
                  <Link
                    to={`/projects/${p.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3 style={{ color: "#4f46e5", margin: 0 }}>
                      {p.name}
                    </h3>
                  </Link>

                  <p style={{ color: "#555", marginTop: 5 }}>
                    {p.description || "No description"}
                  </p>
                </div>

                <button
                  className="button"
                  onClick={() => navigate(`/projects/${p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  Open Project
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ PAGINATION UI */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              gap: 10
            }}
          >
            <button
              className="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            <span style={{ padding: "8px 12px" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}