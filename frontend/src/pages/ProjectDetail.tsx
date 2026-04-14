import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/client";
import { Task } from "../types";
import TaskModal from "../components/TaskModal";
import "./styles.css";

export default function ProjectDetail() {
  const { id } = useParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks?project_id=${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const resetModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingTask) {
        const res = await API.patch(`/tasks/${editingTask.id}`, data);

        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t)),
        );
      } else {
        const res = await API.post("/tasks", {
          ...data,
          project_id: id,
        });

        setTasks((prev) => [...prev, res.data]);
      }

      setEditingTask(null);
      resetModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  // ✅ FILTER
  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "all" || task.status === statusFilter) &&
      (assigneeFilter === "all" || task.assignee_id === assigneeFilter)
    );
  });

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + tasksPerPage
  );

  // ✅ GROUP AFTER PAGINATION
  const grouped = {
    todo: paginatedTasks.filter((t) => t.status === "todo"),
    in_progress: paginatedTasks.filter((t) => t.status === "in_progress"),
    done: paginatedTasks.filter((t) => t.status === "done"),
  };

  const getUserName = (id?: string) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Unassigned";
  };

  return (
    <div className="project-page">
      <h2>Project Tasks</h2>

      <button
        className="button"
        onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
      >
        + Add Task
      </button>

      {/* FILTERS */}
      <div className="filter-card">
        <select
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); // reset page
          }}
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          onChange={(e) => {
            setAssigneeFilter(e.target.value);
            setCurrentPage(1); // reset page
          }}
        >
          <option value="all">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATES */}
      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* KANBAN */}
      <div className="kanban">
        {Object.entries(grouped).map(([key, value]) => (
          <div key={key} className="column">
            <h3>{key.toUpperCase()}</h3>

            {value.map((task) => (
              <div key={task.id} className="task-card">
                <p className="task-title">{task.title}</p>

                <small className="badge">{task.priority}</small>

                <p className="meta">👤 {getUserName(task.assignee_id)}</p>

                {task.due_date && (
                  <p className="meta">📅 {task.due_date}</p>
                )}

                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ✅ PAGINATION UI */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            className="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{ marginRight: 10 }}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{ marginLeft: 10 }}
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={resetModal}
        onSave={handleSave}
        users={users}
        initialData={editingTask}
      />
    </div>
  );
}