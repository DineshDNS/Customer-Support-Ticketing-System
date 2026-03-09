import { useEffect, useState } from "react";
import api from "../../../services/api";
import styles from "./Report.module.css";

function Report() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [dailyReports, setDailyReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports/summary/");
      setSummary(response.data.summary);
      setDailyReports(response.data.daily_reports);
    } catch (error) {
      console.error(error);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading reports...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Reports & Analytics</h2>

      {/* Summary Cards */}
      <div className={styles.cards}>
        <Card title="Total Users" value={summary.total_users} />
        <Card title="Total Tickets" value={summary.total_tickets} />
        <Card title="Open Tickets" value={summary.open_tickets} />
        <Card title="Resolved Tickets" value={summary.resolved_tickets} />
      </div>

      {/* Chart Placeholder */}
      <div className={styles.chartBox}>
        <h3>Ticket Trends</h3>
        <p>📊 Charts will be added here</p>
      </div>

      {/* Table */}
      <div className={styles.tableBox}>
        <h3>Daily Ticket Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>New</th>
              <th>Resolved</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {dailyReports.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.new}</td>
                <td>{item.resolved}</td>
                <td>{item.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className={styles.card}>
      <h4>{title}</h4>
      <span>{value}</span>
    </div>
  );
}

export default Report;
