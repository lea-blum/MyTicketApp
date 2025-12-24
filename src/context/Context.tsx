import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  
} from "react";
import type { ReactNode } from "react";

/* =======================
   Types
======================= */

export interface User {
  id: number;
  email: string;
  role: "admin" | "agent" | "customer";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };

/* =======================
   Initial State
======================= */

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
};

/* =======================
   Reducer
======================= */

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        loading: false,
      };

    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

/* =======================
   Context
======================= */

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* =======================
   Provider
======================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* ---------- Login ---------- */
  const login = (user: User, token: string) => {
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  /* ---------- Logout ---------- */
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  /* ---------- Load user on refresh ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: "STOP_LOADING" });
      return;
    }

    fetch("http://localhost:4000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((user: User) => {
        dispatch({ type: "SET_USER", payload: user });
      })
      .catch(() => {
        dispatch({ type: "LOGOUT" });
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

export default AuthProvider;
