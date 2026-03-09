import styles from "./ForgotPassword.module.css";

function OtpVerify({ otp, onOtpChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className={styles.card}>
      <h2>Verify Code</h2>
      <p>Enter the code sent to your email</p>

      <input
        type="text"
        placeholder="6-digit code"
        value={otp}
        onChange={onOtpChange}
        required
      />

      <button disabled={loading}>
        {loading ? "Verifying..." : "Verify Code"}
      </button>
    </form>
  );
}

export default OtpVerify;
