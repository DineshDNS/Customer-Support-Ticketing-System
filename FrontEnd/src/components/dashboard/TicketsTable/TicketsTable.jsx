import styles from "./TicketsTable.module.css";
import { Link } from "react-router-dom";

function TicketsTable({ tickets = [] }) {
  const role = localStorage.getItem("userRole") || "customer";

  const columnsByRole = {
    customer: ["ticket_code", "title", "priority", "status", "created_at"],
    agent: ["ticket_code", "title", "priority", "status", "action"],
    admin: ["ticket_code", "title", "priority", "status", "action"],
  };

  const columns = columnsByRole[role] || [];

  const formatCell = (ticket, col) => {
    if (col === "created_at") {
      return new Date(ticket.created_at).toLocaleDateString();
    }
    return ticket[col];
  };

  return (
    <div className={styles.tableCard}>
      <h2 className={styles.title}>Tickets</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col.replace("_", " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === "action" ? (
                      role === "customer" ? (
                        "-"
                      ) : (
                        <div className={styles.actions}>
                          <button className={styles.statusBtn}>
                            Update Status
                          </button>
                        </div>
                      )
                    ) : col === "ticket_code" ? (
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className={styles.ticketLink}
                      >
                        {ticket.ticket_code}
                      </Link>
                    ) : (
                      formatCell(ticket, col)
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsTable;
