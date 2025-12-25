import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TicketCard from "../components/TicketCard";
import Navbar from "../components/Navbar";
import { fetchStatuses, fetchTickets } from "../api/api";

interface Status {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  created_at?: string;
  created_by?: number;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
}

const TicketsList = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<number | "all">("all");
  const [filterAgent, setFilterAgent] = useState<number | "all">("all");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }, [token]);

  console.log("TicketsList token:", token);
  console.log("TicketsList user:", user);

  if (!token || !user) {
    return <p>טוען משתמש...</p>;
  }

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const statusData = await fetchStatuses();
      const statusMap: Record<number, string> = {};
      statusData.forEach((s: Status) => (statusMap[s.id] = s.name));
      setStatuses(statusMap);

      const allTickets: Ticket[] = await fetchTickets();

      let filtered: Ticket[] = [];
      if (user.role === "admin") {
        filtered = allTickets;
      } else if (user.role === "agent") {
        filtered = allTickets.filter((t) => t.assigned_to === user.id);
      } else {
        filtered = allTickets.filter((t) => t.created_by === user.id);
      }

      setTickets(filtered);
    } catch (e) {
      console.error(e);
      setError("שגיאה בטעינת נתונים");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token, user.id, user.role]);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status_id !== filterStatus) return false;
    if (filterAgent !== "all" && t.assigned_to !== filterAgent) return false;

    if (filterDateFrom && t.created_at && new Date(t.created_at) < new Date(filterDateFrom)) return false;
    if (filterDateTo && t.created_at && new Date(t.created_at) > new Date(filterDateTo)) return false;

    return true;
  });

  const uniqueAgents = Array.from(
    new Map(
      tickets
        .filter(t => t.assigned_to_name) 
        .map(t => [t.assigned_to, t])
    ).values()
  );

  if (loading) return <p>טוען טיקטים...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar />
      <div>
        <h2>רשימת טיקטים</h2>
        <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value === "all" ? "all" : Number(e.target.value))}>
            <option value="all">כל הסטטוסים</option>
            {Object.entries(statuses).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          {user.role === "admin" && (
            <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value === "all" ? "all" : Number(e.target.value))}>
              <option value="all">כל הסוכנים</option>
              {uniqueAgents.map(t => (
                <option key={t.assigned_to} value={t.assigned_to ?? ""}>
                  {t.assigned_to_name}
                </option>
              ))}
            </select>
          )}

          <div>
            <label htmlFor="from">
              מתאריך:
            <input name="from" id="from"
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)} 
            />
            </label>

            <label htmlFor="till">
              עד תאריך:
            <input name="till" id="till"
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              style={{ marginLeft: 5 }}
            />
            </label>
          </div>
        </div>

        {filteredTickets.length === 0 && <p>אין טיקטים להצגה</p>}

        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-wrapper"
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
            }}
          >
            <TicketCard
              name={ticket.subject}
              status={statuses[ticket.status_id] || "לא ידוע"}
              date={ticket.created_at || ""}
              comment={ticket.description}
              agentName={
                user.role === "admin"
                  ? ticket.assigned_to_name ?? undefined
                  : undefined
              }
            />
            {user.role !== "admin" && (
              <div
                className="ticket-actions"
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  style={{
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  צפייה בפרטים / הוספת תגובה
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TicketsList;
