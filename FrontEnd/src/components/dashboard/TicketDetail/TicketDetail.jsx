import styles from "./TicketDetail.module.css";
import { useNavigate } from "react-router-dom";

function TicketDetail({
  ticket,
  status,
  setStatus,
  onUpdateStatus,
  loading,
  role,
  message,
  error,
}) {
  const navigate = useNavigate();

  if (!ticket) {
    return <p className={styles.loading}>Loading ticket...</p>;
  }

  const canUpdateStatus = role === "agent" || role === "admin";
  const isCustomer = role === "customer";

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2 className={styles.title}>
          {ticket.ticket_code} — {ticket.title}
        </h2>

        {/* Description */}
        <div className={styles.section}>
          <span className={styles.label}>Description</span>
          <p className={styles.text}>{ticket.description}</p>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <span><b>Priority:</b> {ticket.priority}</span>
          <span className={`${styles.status} ${styles[ticket.status]}`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        {/* ✅ Back Arrow – Customer ONLY */}
        {isCustomer && (
          <button
            className={styles.backButton}
            onClick={() => navigate("/ticketlists")}
          >
            ← Back
          </button>
        )}

        {/* ✅ Status Update – Agent/Admin ONLY */}
        {canUpdateStatus && (
          <>
            <div className={styles.updateBox}>
              <label className={styles.label}>Update Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
                className={styles.select}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <button
                onClick={onUpdateStatus}
                disabled={loading || status === ticket.status}
                className={styles.button}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>

            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
