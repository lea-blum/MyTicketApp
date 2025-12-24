import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createTicket, fetchTickets as fetchTicketsApi } from "../api/api";

interface NewTicketForm {
  subject: string;
  description: string;
  priority_id?: number;
  assigned_to?: number;
}

const NewTicket: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewTicketForm>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tickets, setTickets] = useState<NewTicketForm[]>([]);

  const nav = useNavigate();

  /* =========================
     Fetch tickets (FIXED)
  ========================= */

  const loadTickets = async () => {
    try {
      const data = await fetchTicketsApi();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "לא ניתן לשלוף טיקטים");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* =========================
     Submit
  ========================= */

  const onSubmit = async (data: NewTicketForm) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        subject: data.subject,
        description: data.description,
        ...(data.priority_id && { priority_id: Number(data.priority_id) }),
        ...(data.assigned_to && { assigned_to: Number(data.assigned_to) }),
      };

      await createTicket(payload);

      setSuccessMessage("טיקט נוסף בהצלחה!");
      reset();

      await loadTickets(); // טעינה מחדש – בלי רקורסיה
      nav("/TicketsList");
    } catch (err: any) {
      setServerError(err.message || "שגיאה בשליחת הטיקט");
    }
  };

  /* =========================
     Render
  ========================= */

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#f9fafb",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          יצירת טיקט חדש
        </h1>

        {serverError && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {serverError}
          </p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "12px" }}>
            <input
              {...register("subject", { required: "שדה חובה" })}
              placeholder="כותרת הטיקט"
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.subject && (
              <p style={{ color: "red" }}>{errors.subject.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <textarea
              {...register("description", { required: "שדה חובה" })}
              placeholder="תיאור הטיקט"
              rows={4}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              type="number"
              {...register("priority_id")}
              placeholder="רמת דחיפות (מספר)"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              type="number"
              {...register("assigned_to")}
              placeholder="מזהה סוכן משויך (אופציונלי)"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            {isSubmitting ? "שולח..." : "צור טיקט"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewTicket;
