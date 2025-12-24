import { use, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
    
}
 
const NotFound: FunctionComponent<NotFoundProps> = () => {
    const nav=useNavigate();
    return ( 
        <>
        <h1>404 - הדף לא נמצא</h1>
        <button onClick={()=>{nav('http://localhost:5173/Dashboard/')}}> לחזרה לעמוד הראשי</button>
        </>
     );
}
 
export default NotFound;