import styles from "./DashboardContent.module.css";
import {
  FaTicketAlt,
  FaClock,
  FaSync,
  FaCheckCircle,
  FaFire,
} from "react-icons/fa";

function SummaryCards({ summary }) {
  const cards = [
    { title: "Total Tickets", value: summary.total, icon: <FaTicketAlt />, class: styles.total },
    { title: "Open", value: summary.open, icon: <FaClock />, class: styles.open },
    { title: "In Progress", value: summary.in_progress, icon: <FaSync />, class: styles.progress },
    { title: "Resolved", value: summary.resolved, icon: <FaCheckCircle />, class: styles.resolved },
    { title: "High Priority", value: summary.high_priority, icon: <FaFire />, class: styles.high },
  ];

  return (
    <div className={styles.cardsGrid}>
      {cards.map((card, i) => (
        <div key={i} className={`${styles.card} ${card.class}`}>
          <div className={styles.icon}>{card.icon}</div>
          <div>
            <h2>{card.value}</h2>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
