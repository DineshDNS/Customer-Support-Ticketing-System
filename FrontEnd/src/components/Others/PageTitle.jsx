import { useLocation } from "react-router-dom";


function PageTitle(){

    const location=useLocation();

    const getTitle=()=>{
        
        switch(location.pathname){
            case "/dashboard":
                return "Dashboard";
            case "/create-ticket":
                return "Create Ticket";
            case "/my-tickets":
                return "My Tickets";
            case "/reports":
                return "Reports";
            case "/settings":
                return "Settings";
            default:
                return "";

        }

    };

    return <h3>{getTitle()}</h3>
    
}

export default PageTitle