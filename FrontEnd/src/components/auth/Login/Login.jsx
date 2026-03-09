import { useState } from "react";
import {useNavigate} from 'react-router-dom';

import styles from "./login.module.css";

import api from "../../../services/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
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

  // API login call
  const handleLogin = async () => {
    try {
      const response = await api.post("auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      //store token
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      localStorage.setItem("username", response.data.username); 
      localStorage.setItem("userRole", response.data.role);

      alert("Login successful");
      //Use Navigate for Dashboard
      navigate('/dashboard');
    } catch (error) {
  console.log("LOGIN ERROR:", error.response?.data);

  alert(
    error.response?.data?.detail ||
    error.response?.data?.non_field_errors?.[0] ||
    "Invalid username or password"
  );
}
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    setError("");
    await handleLogin();
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>

          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <form onSubmit={handleSubmit}>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.loginInputCard}>
              <label>Username</label>
              <div className={styles.loginInputBox}>
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Your Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.loginInputCard}>
              <label>Password</label>
              <div className={styles.loginInputBox}>
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.loginOptions}>
              <label className={styles.loginRemember}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <a href="/forgotpassword" className={styles.loginForgot}>
                Forgot Password?
              </a>
            </div>

            <button className={styles.loginBtnCard} type="submit">
              <span className={styles.spanProceed}>LOGIN</span>
              <span className={styles.spanArrow}>→</span>
            </button>

          </form>

          <p className={styles.loginOr}>or Continue with</p>

          <div className={styles.loginSocialIcons}>
            <FontAwesomeIcon icon={faGoogle} className={styles.faGoogle} />
            <FontAwesomeIcon icon={faFacebookF} className={styles.faFacebook} />
            <FontAwesomeIcon icon={faTwitter} className={styles.faTwitter} />
          </div>

          <p className={styles.loginText}>
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
