import Sidebar from "../../components/dashboard/Sidebare/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";
import TicketCreate from "../../components/dashboard/TicketCreate/TicketCreate";

function CreateTicket(){
    return(
        <div className="mainBackground">
        <Sidebar/>
        <Topbar/>
        <TicketCreate/>
      </div>
    );
}

export default CreateTicket