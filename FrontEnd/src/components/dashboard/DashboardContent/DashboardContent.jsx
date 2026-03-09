import { useEffect, useState } from "react";
import api from "../../../services/api";
import SummaryCards from "./SummaryCards";
import RecentTickets from "./RecentTickets";
import styles from "./DashboardContent.module.css";

function DashboardContent() {
  const [summary, setSummary] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("tickets/dashboard/stats/");
        setSummary(res.data.summary);
        setRecentTickets(res.data.recent_tickets);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading dashboard...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <SummaryCards summary={summary} />
      <RecentTickets tickets={recentTickets} />
    </div>
  );
}

export default DashboardContent;
