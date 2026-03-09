import { useEffect, useState } from "react";
import TicketsTable from "../../components/dashboard/TicketsTable/TicketsTable.jsx";
import Sidebar from "../../components/dashboard/Sidebare/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";
import api from "../../services/api";

function TicketLists() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("tickets/")
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load tickets");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>{error}</p>;

  return (
  <div className="mainBackground">
        <Sidebar/>
        <Topbar/>
        <TicketsTable tickets={tickets} />
      </div>
  )
}

export default TicketLists;
