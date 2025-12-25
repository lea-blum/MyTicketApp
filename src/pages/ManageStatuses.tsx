import { useEffect, useState, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";
import Navbar from "../components/Navbar";
import { createStatus, fetchStatuses } from "../api/api";

interface Status {
  id: number;
  name: string;
}

interface ManageStatusesProps {}

const ManageStatuses: FunctionComponent<ManageStatusesProps> = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newStatusName, setNewStatusName] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
  if (authLoading) return;
  if (!token || user?.role !== "admin") return;

  const loadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchStatuses();
      setStatuses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("שגיאה בטעינת הסטטוסים");
    } finally {
      setLoading(false);
    }
  };

  loadStatuses();
}, [token, user, authLoading]);
  const handleAddStatus = async () => {
  if (!newStatusName.trim()) return;

  try {
    setAdding(true);

    const createdStatus = await createStatus(newStatusName);
    setStatuses((prev) => [...prev, createdStatus]);
    setNewStatusName("");
  } catch (err) {
    alert("לא ניתן להוסיף סטטוס");
  } finally {
    setAdding(false);
  }
};

  if (authLoading) return <p>טוען משתמש...</p>;

  return (
    <>
    <Navbar/>
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>ניהול סטטוסים</h2>

      {loading && <p>טוען סטטוסים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && statuses.length === 0 && (
        <p>אין סטטוסים במערכת</p>
      )}

      {!loading && !error && statuses.length > 0 && (
        <ul>
          {statuses.map((status) => (
            <li key={status.id}>{status.name}</li>
          ))}
        </ul>
      )}

      <hr />

      <h3>הוספת סטטוס חדש</h3>

      <input
        type="text"
        placeholder="שם הסטטוס"
        value={newStatusName}
        onChange={(e) => setNewStatusName(e.target.value)}
      />

      <button onClick={handleAddStatus} disabled={adding}>
        {adding ? "מוסיף..." : "הוסף"}
      </button>
    </div>
    </>
  );
};

export default ManageStatuses;
