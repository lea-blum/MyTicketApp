import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";
import { fetchTickets as fetchTicketsApi } from "../api/api";
import EditTicketForm from "./EditTicketForm";
import Navbar from "../components/Navbar";

/* =====================
   Types
===================== */

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  assigned_to?: number | null;
  assigned_to_name?: string;
  created_at?: string;
}

/* =====================
   Component
===================== */

const ManageTickets = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);

  /* =====================
     Route Guard
  ===================== */

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin" && user.role !== "agent") {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  /* =====================
     Fetch Tickets
  ===================== */

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchTicketsApi();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "שגיאה בטעינת טיקטים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (token) loadTickets();
  }, [token, authLoading]);

  /* =====================
     Update Handler
  ===================== */

  const handleUpdate = (updated: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setEditingTicketId(null);
  };

  /* =====================
     Render Guards
  ===================== */

  if (authLoading) return <p>טוען משתמש...</p>;
  if (loading) return <p>טוען טיקטים...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  /* =====================
     Render
  ===================== */

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2>ניהול טיקטים</h2>

        {tickets.map((ticket) => {
          const isEditing = editingTicketId === ticket.id;

          return (
            <div
              key={ticket.id}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                marginBottom: 10,
              }}
            >
              <h3>{ticket.subject}</h3>
              <p>{ticket.description}</p>
              <p>סטטוס ID: {ticket.status_id}</p>
              <p>סוכן: {ticket.assigned_to_name ?? "לא משויך"}</p>

              <button
                onClick={() =>
                  setEditingTicketId(isEditing ? null : ticket.id)
                }
              >
                {isEditing ? "סגור" : "ערוך"}
              </button>

              {isEditing && (
                <EditTicketForm
                  ticket={ticket}
                  onUpdate={handleUpdate}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ManageTickets;
