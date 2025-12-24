import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addComment, fetchTicketById } from "../api/api";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user?: {
    name: string;
  };
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status?: { id: number; name: string };
  created_at?: string;
  comments?: Comment[];
}

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async () => {
  try {
    setLoading(true);
    setError(null);

    if (!id) return;

    const data = await fetchTicketById(Number(id)); // קריאה לפונקציה מ־api.ts
    setTicket(data);
    setComments(data.comments || []);
  } catch (err: any) {
    setError(err.message || "לא ניתן לטעון את הטיקט");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleAddComment = async () => {
  if (!newComment.trim() || !id) return;

  try {
    setSending(true);

    await addComment(Number(id), newComment); // קריאה לפונקציה מ־api.ts
    setNewComment("");
    fetchTicket(); // ריענון תגובות
  } catch (err: any) {
    alert(err.message || "שליחת התגובה נכשלה");
  } finally {
    setSending(false);
  }
};
  if (loading) return <p>טוען טיקט...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!ticket) return <p>הטיקט לא נמצא</p>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2>{ticket.subject}</h2>

        <p>
          <strong>תיאור:</strong> {ticket.description}
        </p>

        {ticket.status && (
          <p>
            <strong>סטטוס:</strong> {ticket.status.name}
          </p>
        )}

        {ticket.created_at && (
          <p>
            <strong>נוצר בתאריך:</strong>{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>
        )}

        <hr />

        <h3>תגובות</h3>
        {comments.length === 0 && <p>אין תגובות עדיין</p>}

        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            <p>{comment.content}</p>
            <small>
              {comment.user?.name || "משתמש"} |{" "}
              {new Date(comment.created_at).toLocaleString()}
            </small>
          </div>
        ))}

        <h4>הוספת תגובה</h4>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          placeholder="כתוב תגובה..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          onClick={handleAddComment}
          disabled={sending}
          style={{ marginTop: "8px" }}
        >
          {sending ? "שולח..." : "שלח תגובה"}
        </button>
      </div>
    </>
  );
};

export default TicketDetails;
