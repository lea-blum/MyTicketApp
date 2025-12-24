import type { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/Context";
import { useEffect } from "react";

interface UserFormValues {
  email: string;
  password: string;
  name: string;
  role: "admin" | "agent" | "customer";
}

const NewUser: FunctionComponent = () => {
  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<UserFormValues>();

  const nav = useNavigate();
  const { user } = useAuth();

  /* ===== Guard: Admin Only ===== */
  useEffect(() => {
    if (user && user.role !== "admin") {
      nav("/dashboard");
    }
  }, [user, nav]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data);
      alert("המשתמש נוצר בהצלחה");
      reset();
      nav("/Dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "שגיאת רשת");
    }
  };

  return (
    <>
      <Navbar />

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        <input
          {...register("email", { required: "יש להזין מייל" })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          {...register("password", { required: "יש להזין סיסמה" })}
          type="password"
          placeholder="סיסמה"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <input
          {...register("name", { required: "יש להזין שם" })}
          type="text"
          placeholder="שם"
        />
        {errors.name && <p>{errors.name.message}</p>}

        <select
          {...register("role", { required: "יש לבחור תפקיד" })}
          defaultValue=""
        >
          <option value="" disabled>בחר תפקיד</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="customer">Customer</option>
        </select>
        {errors.role && <p>{errors.role.message}</p>}

        <button type="submit">שמור</button>
      </form>
    </>
  );
};

export default NewUser;
