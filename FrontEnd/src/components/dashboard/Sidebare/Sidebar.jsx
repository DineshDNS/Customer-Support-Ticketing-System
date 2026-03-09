import styles from "./Sidebar.module.css";

import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faPlusCircle,
  faTicketAlt,
  faFileLines,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.sidebarCard}>

      {/* Top */}
      <div className={styles.sidebarTop}>
        <h3>Customer Support System</h3>
      </div>

      {/* Middle */}
      <div className={styles.sidebarMiddle}>
        <nav>
          <ul className={styles.navList}>

            {/* Dashboard – All roles */}
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                <FontAwesomeIcon icon={faChartLine} />
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* Create Ticket – Customer only */}
            {role === "customer" && (
              <li>
                <NavLink
                  to="/createticket"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  <span>Create Ticket</span>
                </NavLink>
              </li>
            )}

            {/* Tickets – All roles*/}
            <li>
              <NavLink
                to="/ticketlists"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                <FontAwesomeIcon icon={faTicketAlt} />
                <span>{role === "customer" ? "My Tickets" : "All Tickets"}</span>
              </NavLink>
            </li>

            {/* Reports – Agent & Admin */}
            {(role === "agent" || role === "admin") && (
              <li>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  <span>Reports</span>
                </NavLink>
              </li>
            )}

            {/* Settings – All Roles */}
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  <FontAwesomeIcon icon={faGear} />
                  <span>Settings</span>
                </NavLink>
              </li>

          </ul>
        </nav>
      </div>

      {/* Bottom */}
      <div className={styles.sidebarBottom}>
        <div className={styles.btnCard} onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <button className={styles.logoutBtn}>Logout</button>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
