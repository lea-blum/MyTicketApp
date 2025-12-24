import { useEffect, useState } from "react";
import { useAuth } from "../context/Context";
import type { Ticket } from "./ManageTickets";
import { fetchStatuses, fetchUsers, updateTicket } from "../api/api";

interface Status {
  id: number;
  name: string;
}
interface Agent {
  id: number;
  name: string;
}


interface Props {
  ticket: Ticket;
  onUpdate: (ticket: Ticket) => void;
}

const EditTicketForm = ({ ticket, onUpdate }: Props) => {
  const { token, user } = useAuth();

  const [statusId, setStatusId] = useState(ticket.status_id);
  const [agentId, setAgentId] = useState<number | "">(ticket.assigned_to ?? "");

  const [agents, setAgents] = useState<Agent[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setStatusId(ticket.status_id);
    setAgentId(ticket.assigned_to ?? "");
  }, [ticket]);

  /* ===== fetch statuses ===== */
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const data = await fetchStatuses();
        setStatuses(data);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "שגיאה בטעינת סטטוסים");
      }
    };
    loadStatuses();
  }, [token]);

  /* ===== fetch agents (admin only) ===== */
  useEffect(() => {
    if (!isAdmin) return;

    const loadAgents = async () => {
      try {
        const users = await fetchUsers();
        setAgents(users.filter((u: any) => u.role === "agent"));
      } catch (err: any) {
        console.error(err);
        alert(err.message || "שגיאה בטעינת סוכנים");
      }
    };
    loadAgents();
  }, [token, isAdmin]);
  const save = async () => {
    setSaving(true);

    try {
      const body: any = { status_id: statusId };

      // 🔐 רק Admin שולח assigned_to
      if (isAdmin && agentId !== "") {
        body.assigned_to = agentId;
      }

      const updated = await updateTicket(ticket.id, body);

      onUpdate({
        ...ticket,
        status_id: updated.status_id,
        assigned_to: updated.assigned_to,
        assigned_to_name: updated.assigned_to_name,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "שמירה נכשלה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div>
        <label>סטטוס:</label>
        <select
          value={statusId}
          onChange={(e) => setStatusId(Number(e.target.value))}
        >
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <div>
          <label>שיוך לסוכן:</label>
          <select
            value={agentId}
            onChange={(e) =>
              setAgentId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">לא משוייך</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={save} disabled={saving}>
        {saving ? "שומר..." : "שמור"}
      </button>
    </div>
  );
};

export default EditTicketForm;
