import "./Register.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import userIcon from "../assets/user.png";
import phoneIcon from "../assets/phone.png";
import questionIcon from "../assets/question.png";
import openIcon from "../assets/OpenEye.png";
import hideIcon from "../assets/CloseEye.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    phone: "",
    password: "",
    level: "",
    inviteCode: "",
    secret_question: "",
    secret_answer: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ'-\s]+$/;

    if (!formData.first_name.trim()) {
      return "Введіть ім'я";
    }
    if (!nameRegex.test(formData.first_name)) {
      return "Ім'я може містити лише літери";
    }

    if (!formData.second_name.trim()) {
      return "Введіть прізвище";
    }
    if (!nameRegex.test(formData.second_name)) {
      return "Прізвище може містити лише літери";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Введіть коректний email";
    }

    const phoneRegex = /^[+()\-0-9\s]{6,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Введіть коректний номер телефону";
    }

    if (formData.password.length < 6) {
      return "Пароль повинен містити мінімум 6 символів";
    }

    if (!formData.level) {
      return "Будь ласка, оберіть рівень";
    }

    if (!formData.secret_question) {
      return "Оберіть секретне питання";
    }

    if (!formData.secret_answer.trim()) {
      return "Введіть відповідь на секретне питання";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
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
          inviteCode: "",
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
    <div className="register-screen">
      <div className="register-container">
        <h2>Реєстрація</h2>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
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
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <div className="input-header">
              <img src={passwordIcon} alt="Password icon" />
              <p>Пароль</p>
            </div>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <img
                src={showPassword ? hideIcon : openIcon}
                alt="toggle password"
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
          </div>
  
          <div className="input-group">
            <select
              className="question-select"
              name="secret_question"
              value={formData.secret_question}
              onChange={handleChange}
            >
              <option value="">Оберіть секретне питання</option>
              <option value="pet">
                Як звали вашого першого домашнього улюбленця?
              </option>
              <option value="book">Яка ваша улюблена книга?</option>
              <option value="food">Яка ваша улюблена страва?</option>
              <option value="city">У якому місті ви народилися?</option>
              <option value="friend">
                Як звали вашого найкращого друга в дитинстві?
              </option>
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="secret_answer"
              value={formData.secret_answer}
              onChange={handleChange}
              placeholder="Введіть відповідь"
            />
          </div>
          <div className="input-group">
            <select
              className="level-select"
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="">Оберіть рівень</option>
              <option value="початковий">Початковий</option>
              <option value="середній">Середній</option>
              <option value="просунутий">Просунутий</option>
            </select>
          </div>

          <div className="input-group">
            <div
              className="input-code"
              onClick={() => setShowInvite((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <p>У мене є код</p>
            </div>

            {showInvite && (
              <input
                type="password"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="Введіть код"
              />
            )}
          </div>

          {error && (
            <p
              style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}
            >
              {error}
            </p>
          )}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit">Зареєструватися</button>
        </form>

        <p className="register-account">Вже є обліковий запис?</p>
        <button
          className="login-button"
          onClick={() => navigate("/login")}
          type="button"
        >
          Увійти
        </button>
      </div>
    </div>
  );
};

export default Register;
