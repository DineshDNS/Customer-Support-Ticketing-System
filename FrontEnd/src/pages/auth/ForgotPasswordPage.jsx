import { useState } from "react";
import ForgotPassword from "../../components/auth/ForgotPassword/ForgotPassword";
import OtpVerify from "../../components/auth/ForgotPassword/OtpVerify";
import ResetPassword from "../../components/auth/ForgotPassword/ResetPassword";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | otp | reset
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password/", { email });
      setStep("otp");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/verify-otp/", { email, otp });
      setStep("reset");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password/", {
        email,
        otp,
        password,
      });

      alert("Password reset successful");

      navigate("/login");
    } catch (err) {
  const data = err.response?.data;

  if (data?.errors && data.errors.length > 0) {
    alert(data.errors[0]);   // 👈 shows real reason
  } else if (data?.message) {
    alert(data.message);
  } else {
    alert("Password must contain letters, numbers, symbols, and be at least 8 characters long");
  }
} finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER BY STEP ---------------- */
  if (step === "email") {
    return (
      <ForgotPassword
        email={email}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={handleSendOtp}
        loading={loading}
      />
    );
  }

  if (step === "otp") {
    return (
      <OtpVerify
        otp={otp}
        onOtpChange={(e) => setOtp(e.target.value)}
        onSubmit={handleVerifyOtp}
        loading={loading}
      />
    );
  }

  return (
    <ResetPassword
      password={password}
      confirmPassword={confirmPassword}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={handleResetPassword}
      loading={loading}
    />
  );
}

export default ForgotPasswordPage;
