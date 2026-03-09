import { useState } from "react";
import styles from "./Signup.module.css";

import api from "../../../services/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",   // ✅ default role
    terms: false,
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // API call (ROLE INCLUDED)
 const handleSignup = async () => {
  try {
    await api.post("auth/signup/", {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    alert("Signup successful");
    //Login Page Navivate
    navigate('/login');
  } catch (error) {
    if (!error.response) {
      setError("Backend server error");
      return;
    }

    const data = error.response.data;

    setError(
      data?.username?.[0] ||
      data?.email?.[0] ||
      data?.password?.[0] ||
      data?.role?.[0] ||
      "Signup failed"
    );
  }
};


  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("You must accept Terms & Privacy Policy");
      return;
    }

    setError("");
    await handleSignup();
  };

  return (
    <div className={styles.signup}>
      <div className={styles.signupPage}>
        <div className={styles.signupCard}>

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>

            {error && <p className={styles.errorText}>{error}</p>}

            {/* Username */}
            <div className={styles.signupInputCard}>
              <div className={styles.signupInputBox}>
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.signupInputCard}>
              <div className={styles.signupInputBox}>
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role (NEW) */}
            <div className={styles.signupInputCard}>
              <div className={styles.signupInputBox}>
                <FontAwesomeIcon icon={faUserTie} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Support Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className={styles.signupInputCard}>
              <div className={styles.signupInputBox}>
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.signupInputCard}>
              <div className={styles.signupInputBox}>
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Terms */}
            <div className={styles.termsCondition}>
              <label>
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <span>I agree to the Terms & Privacy Policy</span>
              </label>
            </div>

            <button className={styles.signupBtnCard} type="submit">
              <span className={styles.spanSignup}>SIGN UP</span>
              <span className={styles.spanArrowSignup}>→</span>
            </button>

          </form>

          <p className={styles.signupOr}>or Signup with</p>

          <div className={styles.signupSocialIcons}>
            <FontAwesomeIcon icon={faGoogle} className={styles.faGoogle} />
            <FontAwesomeIcon icon={faFacebookF} className={styles.faFacebook} />
            <FontAwesomeIcon icon={faTwitter} className={styles.faTwitter} />
          </div>

          <p className={styles.signupLogin}>
            Already have an account? <a href="/login">Login</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
