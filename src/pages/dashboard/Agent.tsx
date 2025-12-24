import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

interface AgentProps {
    
}
 
const Agent: FunctionComponent<AgentProps> = () => {
     const nav = useNavigate();
     const routerFunction=(rout:string)=>{
          
          nav('/'+rout);
    }
    return ( 
        <>
        hello Agent

         
                <button onClick={()=>routerFunction("TicketsList")}>טיקטים שהוקצו אלי</button>
                <button onClick={()=>routerFunction("ManageTickets")}>עדכון סטטוסים</button>
                
                
        </>
     );
}
 
export default Agent;