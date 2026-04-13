import { useEffect, useState } from "react";
import API from "../api/client";
import { Project } from "../types";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        console.log("Projects API:", res.data); // ✅ debug
        setProjects(res.data); // ✅ FIXED
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load projects");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 15,
              marginBottom: 10,
              background: "white",
              borderRadius: 8,
            }}
          >
            <Link to={`/projects/${p.id}`}>
              <h3>{p.name}</h3>
            </Link>
            <p>{p.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
