import { type FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context";
import Admin from "./Admin";
import Agent from "./Agent";
import Customer from "./Customer";
import Navbar from "../../components/Navbar";

const Dashboard: FunctionComponent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) return <p>טוען...</p>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <h1>ברוכים הבאים ללוח הבקרה</h1>

      {user.role === "admin" && <Admin />}
      {user.role === "agent" && <Agent />}
      {user.role === "customer" && <Customer />}
    </>
  );
};

export default Dashboard;
