import Sidebar from "../../components/dashboard/Sidebare/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";
import Settings from "../../components/dashboard/Settings/Settings";

function SettingsPage(){
    return(
      <div className="mainBackground">
        <Sidebar />
        <Topbar />
        <Settings />
      </div>
    );
}

export default SettingsPage