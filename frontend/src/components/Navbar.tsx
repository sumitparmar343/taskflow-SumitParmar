import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h3 className="logo" onClick={() => navigate("/")}>
        TaskFlow Dashboard
      </h3>

      {user && (
        <div className="nav-right">
          <span className="username">{user.name}</span>

          <button
            className="button logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
