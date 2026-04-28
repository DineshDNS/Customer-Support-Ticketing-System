import DashboardContent from "../../components/dashboard/DashboardContent/DashboardContent"
import Sidebar from "../../components/dashboard/Sidebare/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";

function Dashboard() {
   return(
      <div className="mainBackground">
       <Sidebar/>
       <Topbar/>
       <DashboardContent/>
      </div>
    );
}

export default Dashboard;
