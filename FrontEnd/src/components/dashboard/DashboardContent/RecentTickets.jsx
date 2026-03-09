import styles from "./DashboardContent.module.css";

function RecentTickets({ tickets = [] }) {
  return (
    <div className={styles.tableCard}>
      <h3>Recent Tickets</h3>

      {tickets.length === 0 ? (
        <p>No recent tickets</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={i}>
                <td>{t.ticket_code}</td>
                <td>{t.title}</td>
                <td>
                  <span className={`${styles.badge} ${styles[t.priority]}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[t.status]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecentTickets;
