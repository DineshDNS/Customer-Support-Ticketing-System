import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

function ForgotPassword({ email, onEmailChange, onSubmit, loading }) {
  return (
    <div className={styles.fp}>
        <form onSubmit={onSubmit} className={styles.fpCard}>
        <h2>Forgot Password</h2>
        <p>Enter your registered email</p>

        <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={onEmailChange}
            required
            className={styles.fpInput}
        />

        <button
            disabled={loading}
            className={styles.fpButton}
        >
            {loading ? "Sending Code..." : "Send Code"}
        </button>

        <Link to="/login" className={styles.fpBackLink}>
            ← Back to Login
        </Link>
        </form>
    </div>
    
  );
}

export default ForgotPassword;
