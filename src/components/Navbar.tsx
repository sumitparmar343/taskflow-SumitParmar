import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>TaskFlow</h3>
      {user && (
        <div>
          {user.name}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
