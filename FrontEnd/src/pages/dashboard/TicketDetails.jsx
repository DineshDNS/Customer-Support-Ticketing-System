import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import TicketDetail from "../../components/dashboard/TicketDetail/TicketDetail.jsx";

function TicketDetails() {

  const navigate = useNavigate();
  const { id } = useParams();
  const role = (localStorage.getItem("userRole") || "customer").toLowerCase();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`tickets/${id}/`)
      .then((res) => {
        setTicket(res.data);
        setStatus(res.data.status);
      })
      .catch(() => {
        setError("Failed to load ticket details");
      });
  }, [id]);

  const updateStatus = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.patch(`tickets/${id}/update/`, { status });
      setTicket(res.data);
      setMessage("Status updated successfully");

      navigate("/ticketlists");
  

    } catch {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TicketDetail
      ticket={ticket}
      status={status}
      setStatus={setStatus}
      onUpdateStatus={updateStatus}
      loading={loading}
      role={role}
      message={message}
      error={error}
    />
  );
}

export default TicketDetails;
