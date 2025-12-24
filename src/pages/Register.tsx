import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({...data});

      alert("נרשמת בהצלחה!");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "שגיאה בהרשמה");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2>הרשמה</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          {...register("name", { required: "יש להזין שם מלא" })}
          placeholder="שם מלא"
        />
        {errors.name && <p>{errors.name.message}</p>}

        <input
          {...register("email", {
            required: "יש להזין מייל",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "מייל לא תקין",
            },
          })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          {...register("password", {
            required: "יש להזין סיסמה",
            minLength: {
              value: 6,
              message: "סיסמה חייבת להכיל לפחות 6 תווים",
            },
          })}
          type="password"
          placeholder="סיסמה"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">הרשם</button>
      </form>
    </div>
  );
};

export default Register;
