import type { FunctionComponent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Context";

const Navbar: FunctionComponent = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        <div
          onClick={() => nav("/")}
          className="text-lg font-semibold text-blue-600 cursor-pointer select-none"
        >
          MyTicketApp
        </div>

        <div className="flex items-center gap-1">

          {user?.role === "admin" && (
            <>
              <NavBtn active={location.pathname === "/TicketsList"} onClick={() => nav("/TicketsList")}>
                צפיה בטיקטים
              </NavBtn>
              <NavBtn active={location.pathname === "/ManageTickets"} onClick={() => nav("/ManageTickets")}>
                ניהול טיקטים
              </NavBtn>
              <NavBtn active={location.pathname === "/ManageStatuses"} onClick={() => nav("/ManageStatuses")}>
                ניהול סטטוסים
              </NavBtn>
               <NavBtn active={location.pathname === "/NewUser"} onClick={() => nav("/NewUser")}>
                הוספת משתמש
              </NavBtn>
               <NavBtn active={location.pathname === "/Dashboard"} onClick={() => nav("/Dashboard")}>
                לוח הבקרה
              </NavBtn>
            </>
          )}

          {user?.role === "agent" && (
            <>
              <NavBtn active={location.pathname === "/TicketsList"} onClick={() => nav("/TicketsList")}>
                צפיה בטיקטים
              </NavBtn>
              <NavBtn active={location.pathname === "/ManageTickets"} onClick={() => nav("/ManageTickets")}>
                 עדכון סטטוסים
              </NavBtn>
               <NavBtn active={location.pathname === "/Dashboard"} onClick={() => nav("/Dashboard")}>
                לוח הבקרה
              </NavBtn>
            </>
          )}

          {user?.role === "customer" && (
            <>
              <NavBtn active={location.pathname === "/TicketsList"} onClick={() => nav("/TicketsList")}>
                צפיה בטיקטים
              </NavBtn>
              <NavBtn active={location.pathname === "/NewTicket"} onClick={() => nav("/NewTicket")}>
                צור טיקט חדש
              </NavBtn>
                <NavBtn active={location.pathname === "/Dashboard"} onClick={() => nav("/Dashboard")}>
                לוח הבקרה
              </NavBtn>
            </>
          )}
        </div>
     </div>
    </nav>
  );
};

export default Navbar;

const NavBtn = ({
  children,
  onClick,
  active,
}: {
  children: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1.5 text-sm rounded-md transition
      ${active
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
    `}
  >
    {children}
  </button>
);
