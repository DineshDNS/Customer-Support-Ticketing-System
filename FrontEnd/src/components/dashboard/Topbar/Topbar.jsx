import styles from "./Topbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faBell } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../Others/PageTitle";

function Topbar() {
  const role = localStorage.getItem("userRole") || "guest";
  const username = localStorage.getItem("username") || "User";

  const displayRole =
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <PageTitle />
      </div>

      <div className={styles.topbarRight}>
        <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />
        <FontAwesomeIcon icon={faUserTie} />

        <span className={styles.userName}>
          {username} <small>({displayRole})</small>
        </span>
      </div>
    </header>
  );
}

export default Topbar;
