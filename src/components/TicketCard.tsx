interface TicketCardProps {
  name: string;
  status: string;
  agentName?: string;
  date: string;
  comment: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  name,
  status,
  agentName,
  date,
  comment,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{name}</h3>

      <p>
        <strong>Status:</strong> {status}
      </p>

      {agentName && (
        <p>
          <strong>Assigned Agent:</strong> {agentName}
        </p>
      )}

      <p>
        <strong>Date Created:</strong> {date}
      </p>

      <p>
        <strong>Comment:</strong> {comment}
      </p>
    </div>
  );
};

export default TicketCard;
