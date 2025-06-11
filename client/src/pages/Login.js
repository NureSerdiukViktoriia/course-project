import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import facebookIcon from "../assets/facebook.png";
import googleIcon from "../assets/google.png";
import "../pages/Register.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Введіть коректний email";
    }
    if (password.length < 6) {
      return "Пароль повинен містити мінімум 6 символів";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setError(data.error || "Невірні дані");
      }
    } catch (err) {
      setError("Помилка сервера");
    }
  };

  return (
    <div className="register-container">
      <h2>Вхід</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group email-group">
          <div className="input-header">
            <img src={emailIcon} alt="Email icon" />
            <p>Пошта</p>
          </div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <div className="input-header">
            <img src={passwordIcon} alt="Password icon" />
            <p>Пароль</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <button type="submit">Увійти</button>
      </form>

      <p>Ще немає облікового запису?</p>
      <button
        className="login-button"
        onClick={() => navigate("/register")}
        type="button"
      >
        Зареєструватися
      </button>

      <div className="login-icons">
        <img src={facebookIcon} alt="Facebook login" />
        <img src={googleIcon} alt="Google login" />
      </div>
    </div>
  );
};

export default Login;
