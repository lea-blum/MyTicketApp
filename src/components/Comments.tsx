import { useEffect, useState, type FunctionComponent } from "react";
import { fetchComments } from "../api/api";

interface Comment {
  id: number;
  content: string;       // תוכן התגובה מהשרת
  author_name: string;   // שם המחבר מהשרת
}

interface CommentsProps {
  ticketId: number;
}

const Comments: FunctionComponent<CommentsProps> = ({ ticketId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticketId) return;

    const loadComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchComments(ticketId);
        setComments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "שגיאה בטעינת התגובות");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [ticketId]);

  if (loading) return <p>טוען תגובות...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (comments.length === 0) return <p>אין תגובות להצגה</p>;

  return (
    <div>
      <h4>תגובות</h4>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: "8px",
            paddingBottom: "6px",
          }}
        >
          <p>
            <strong>{comment.author_name}</strong> {/* שם המחבר כפי שמגיע מהשרת */}
          </p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
