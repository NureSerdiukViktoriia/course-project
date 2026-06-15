import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import openIcon from "../assets/OpenEye.png";
import hideIcon from "../assets/CloseEye.png";

const ChangePassword = ({ onSuccess, onError }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Всі поля повинні бути заповнені");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Новий пароль і підтвердження не співпадають");
      return false;
    }
    if (newPassword.length < 6) {
      setMessage("Пароль повинен містити щонайменше 6 символів");
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    fetch("http://localhost:3001/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при зміні пароля");
        return res.json();
      })
      .then(() => {
        setMessage("Пароль успішно змінено");
        onSuccess && onSuccess();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setMessage(err.message);
        onError && onError(err.message);
      });
  };

  return (
    <div className="change-password-wrapper">
      <Header />
      <h3 className="change-password-text">Змінити пароль</h3>
      <div className="change-password-container">
        <form className="change-password-form" onSubmit={handleSubmit}>
          <label>
            Старий пароль
            <div className="password-wrapper">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />

              <img
                src={showOld ? hideIcon : openIcon}
                className="eye-icon"
                onClick={() => setShowOld((prev) => !prev)}
                alt="toggle"
              />
            </div>
          </label>

          <label>
            Новий пароль
            <div className="password-wrapper">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <img
                src={showNew ? hideIcon : openIcon}
                className="eye-icon"
                onClick={() => setShowNew((prev) => !prev)}
                alt="toggle"
              />
            </div>
          </label>

          <label>
            Підтвердження нового пароля
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <img
                src={showConfirm ? hideIcon : openIcon}
                className="eye-icon"
                onClick={() => setShowConfirm((prev) => !prev)}
                alt="toggle"
              />
            </div>
          </label>

          {message && (
            <p className={message.includes("успішно") ? "success" : "error"}>
              {message}
            </p>
          )}

          <button type="submit" className="save-btn">
            Зберегти
          </button>
          <button
            type="button"
            className="back-btn-account"
            onClick={() => navigate("/profile")}
          >
            Назад
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;
