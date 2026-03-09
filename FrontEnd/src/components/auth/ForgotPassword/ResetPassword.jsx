import styles from "./ForgotPassword.module.css";

function ResetPassword({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className={styles.card}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={onPasswordChange}
        required
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={onConfirmChange}
        required
      />

      <button disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}

export default ResetPassword;
