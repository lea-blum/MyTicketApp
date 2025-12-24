import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

interface CustomerProps {
    
}
 
const Customer: FunctionComponent<CustomerProps> = () => {
       const nav = useNavigate();
     const routerFunction=(rout:string)=>{
         
          nav('/'+rout);
    }
    return (
<>

  hi Customer
              <button onClick={()=>routerFunction("NewTicket")}>יצירת טיקט חדש</button>
              <button onClick={()=>routerFunction("TicketsList")}>צפייה בטיקטים שיצרתי</button>
                     
              
</>

      );
}
 
export default Customer;