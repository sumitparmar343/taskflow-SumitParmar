import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/client";
import { Task } from "../types";

export default function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    API.get(`/tasks?project_id=${id}`)
      .then((res) => {
        console.log("Tasks:", res.data);
        setTasks(res.data); // ✅ correct
      })
      .catch(() => alert("Error loading tasks"));
  }, [id]);

  const createTask = async () => {
    if (!title) return;

    const res = await API.post("/tasks", {
      title,
      status: "todo",
      project_id: id,
    });

    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tasks</h2>

      <input
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createTask}>Add</button>

      <div style={{ display: "flex", gap: 20 }}>
        {Object.entries(grouped).map(([key, value]) => (
          <div key={key}>
            <h3>{key}</h3>

            {value.map((task) => (
              <div key={task.id}>{task.title}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
