import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/Context";

interface LoginProps {
  email: string;
  password: string;
}

const Login: FunctionComponent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginProps>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginProps) => {
    try {
      const result = await loginUser(data.email, data.password);

      const payload = JSON.parse(atob(result.token.split(".")[1]));

      login(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
        result.token
      );

      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "שגיאה בהתחברות");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

        <button type="submit">התחבר</button>
      </form>

      <p style={{ marginTop: 10 }}>
        אין לך חשבון?{" "}
        <Link to="/Register" style={{ color: "blue", textDecoration: "underline" }}>
          הרשם כאן
        </Link>
      </p>
    </div>
  );
};

export default Login;
