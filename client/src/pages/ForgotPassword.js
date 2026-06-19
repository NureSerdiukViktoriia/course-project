import "./Register.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import openIcon from "../assets/OpenEye.png";
import questionIcon from "../assets/question.png";
import hideIcon from "../assets/CloseEye.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [secretQuestion, setSecretQuestion] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    secret_question: "",
    secret_answer: "",
    new_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const questionMap = {
    pet: "Як звали вашого першого домашнього улюбленця?",
    book: "Яка ваша улюблена книга?",
    food: "Яка ваша улюблена страва?",
    city: "У якому місті ви народилися?",
    friend: "Як звали вашого найкращого друга в дитинстві?",
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForgotPassword = (step) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      if (!formData.email.trim()) {
        return "Введіть email";
      }

      if (!emailRegex.test(formData.email)) {
        return "Введіть коректний email";
      }
    }

    if (step === 2) {
      if (!formData.secret_answer.trim()) {
        return "Введіть відповідь на секретне питання";
      }
    }

    if (step === 3) {
      if (!formData.new_password) {
        return "Введіть новий пароль";
      }

      if (formData.new_password.length < 6) {
        return "Пароль повинен містити мінімум 6 символів";
      }
    }

    return null;
  };
  const verifyAnswer = async () => {
    const res = await fetch(
      "http://localhost:3001/api/auth/forgot/verify-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          secret_answer: formData.secret_answer.trim(),
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }
    setError("");
    setSuccess("");
    setStep(3);
  };
  const resetPassword = async () => {
    setError("");

    const res = await fetch(
      "http://localhost:3001/api/auth/forgot/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          new_password: formData.new_password,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess("Пароль успішно змінено");
  };
  const checkUser = async () => {
    const res = await fetch(
      "http://localhost:3001/api/auth/forgot/check-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSecretQuestion(data.secret_question);
    setError("");
    setSuccess("");
    setStep(2);
  };

  return (
    <div className="register-screen">
      <div className="register-container">
        <h2>Відновлення паролю</h2>

        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
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

              <button
                type="button"
                onClick={() => {
                  const err = validateForgotPassword(1);
                  if (err) return setError(err);

                  checkUser();
                }}
              >
                Далі
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="input-group">
                <p>{questionMap[secretQuestion]}</p>
              </div>

              <div className="input-group">
                <input
                  name="secret_answer"
                  value={formData.secret_answer}
                  onChange={handleChange}
                  placeholder="Відповідь"
                />
              </div>
              <button
                className="check-question"
                onClick={() => {
                  const err = validateForgotPassword(2);
                  if (err) return setError(err);

                  verifyAnswer();
                }}
              >
                Перевірити
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="input-group">
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Новий пароль"
                />
              </div>

              <button
                className="check-question"
                onClick={() => {
                  const err = validateForgotPassword(3);
                  if (err) return setError(err);

                  resetPassword();
                }}
              >
                Змінити пароль
              </button>
            </>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <p className="register-account-password">Згадали пароль?</p>
          <button onClick={() => navigate("/register")} type="submit">
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
