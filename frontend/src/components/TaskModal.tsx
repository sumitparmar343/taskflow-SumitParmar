import { useState, useEffect } from "react";
import { Task } from "../types";
import "./styles.css";

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  initialData,
}: any) {
  const [form, setForm] = useState<Partial<Task>>({
    title: "",
    status: "todo",
    priority: "medium",
    assignee_id: "",
    due_date: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        title: "",
        status: "todo",
        priority: "medium",
        assignee_id: "",
        due_date: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    const newErrors: any = {};

    if (!form.title || form.title.trim() === "") {
      newErrors.title = "Title is required";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    if (!form.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!form.assignee_id) {
      newErrors.assignee_id = "Assignee is required";
    }

    if (!form.due_date) {
      newErrors.due_date = "Due date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ HANDLE SAVE
  const handleSaveClick = () => {
    if (!validate()) return;

    onSave(form);

    // reset after save
    setForm({
      title: "",
      status: "todo",
      priority: "medium",
      assignee_id: "",
      due_date: "",
    });
    setErrors({});
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* HEADER */}
        <div className="modal-header">
          <h3>{initialData ? "Edit Task" : "Create Task"}</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div>{"Enter Project title"}</div>
        <div className="modal-body">
          {/* TITLE */}
          <input
            className="modal-input"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          {errors.title && (
            <p style={{ color: "red", fontSize: 12 }}>{errors.title}</p>
          )}

          <div>{"Select Status"}</div>
          <select
            className="modal-input"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <p style={{ color: "red", fontSize: 12 }}>{errors.status}</p>
          )}

          <div>{"Select Priority"}</div>
          <select
            className="modal-input"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.priority}
            </p>
          )}

          <div>{"Select Assignee"}</div>
          <select
            className="modal-input"
            value={form.assignee_id}
            onChange={(e) =>
              setForm({ ...form, assignee_id: e.target.value })
            }
          >
            <option value="">Select Assignee</option>
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.assignee_id && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.assignee_id}
            </p>
          )}

          <div>{"Due Date"}</div>
          <input
            type="date"
            className="modal-input"
            value={form.due_date}
            onChange={(e) =>
              setForm({ ...form, due_date: e.target.value })
            }
          />
          {errors.due_date && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.due_date}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}