export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  project_id: string;
  assignee_id?: string;
  due_date?: string;
}