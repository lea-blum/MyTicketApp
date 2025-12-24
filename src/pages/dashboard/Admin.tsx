import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

interface AdminProps {
    
}
 
const Admin: FunctionComponent<AdminProps> = () => {
          const nav = useNavigate();
        const routerFunction=(rout:string)=>{
    
          nav("/"+rout);
    }
    return (  
        <>
        hello Admin



        
              <button onClick={()=>routerFunction("TicketsList")}>כל הטיקטים</button>
              <button onClick={()=>routerFunction("ManageStatuses")}>ניהול סטטוסים</button>
              <button onClick={()=>routerFunction("ManageTickets")}> ניהול טיקטים</button>
              <button onClick={()=>routerFunction("NewUser")}> הוספת משתמש</button>
              
        </>
    );
}
 
export default Admin;