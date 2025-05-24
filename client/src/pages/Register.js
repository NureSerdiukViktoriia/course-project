import "./Register.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import facebookIcon from "../assets/facebook.png";
import googleIcon from "../assets/google.png";
import userIcon from "../assets/user.png";
import phoneIcon from "../assets/phone.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    phone: "",
    password: "",
    level: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.level) {
      setError("Будь ласка, оберіть рівень");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Реєстрація успішна!");
        setFormData({
          first_name: "",
          second_name: "",
          email: "",
          phone: "",
          password: "",
          level: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Помилка реєстрації");
      }
    } catch (err) {
      setError("Помилка сервера");
    }
  };

  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-header">
            <img src={userIcon} alt="Name icon" />
            <p>Ім'я</p>
          </div>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <div className="input-header">
            <img src={userIcon} alt="Surname icon" />
            <p>Прізвище</p>
          </div>
          <input
            type="text"
            name="second_name"
            value={formData.second_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group email-group">
          <div className="input-header">
            <img src={emailIcon} alt="Email icon" />
            <p>Пошта</p>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <div className="input-header">
            <img src={phoneIcon} alt="Phone icon" />
            <p>Номер телефону</p>
          </div>
          <input
            type="tel"
            name="phone"
            pattern="[0-9+()-\s]*"
            placeholder=""
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <div className="input-header">
            <img src={passwordIcon} alt="Password icon" />
            <p>Пароль</p>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <select
            className="level-select"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть рівень</option>
            <option value="початковий">Початковий</option>
            <option value="середній">Середній</option>
            <option value="просунутий">Просунутий</option>
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Зареєструватися</button>
      </form>

      <p>Вже є обліковий запис?</p>
      <button
        className="login-button"
        onClick={() => navigate("/login")}
        type="button"
      >
        Увійти
      </button>

      <div className="login-icons">
        <img src={facebookIcon} alt="Facebook login" />
        <img src={googleIcon} alt="Google login" />
      </div>
    </div>
  );
};

export default Register;
