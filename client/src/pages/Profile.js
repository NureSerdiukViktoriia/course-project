import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import "./Profile.css";

const levels = ["Початковий", "Середній", "Просунутий"];

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    level: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ви не авторизовані");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3001/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні профілю");
        return res.json();
      })
      .then((data) => {
        const levelFromApi =
          data.level.charAt(0).toUpperCase() +
          data.level.slice(1).toLowerCase();

        setUserData(data);
        setEditData({
          first_name: data.first_name || "",
          last_name: data.second_name || "",
          email: data.email || "",
          phone: data.phone || "",
          level: levels.includes(levelFromApi) ? levelFromApi : "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Не вдалося завантажити профіль");
        setLoading(false);
      });
  }, []);

  const validate = () => {
    if (!editData.first_name.trim()) {
      setMessage({ type: "error", text: "Ім'я не може бути порожнім" });
      return false;
    }
    if (!/^[a-zA-Zа-яА-ЯіїІЇєЄґҐ'’ -]+$/.test(editData.first_name)) {
      setMessage({ type: "error", text: "Ім'я містить недопустимі символи" });
      return false;
    }

    if (!editData.last_name.trim()) {
      setMessage({ type: "error", text: "Прізвище не може бути порожнім" });
      return false;
    }
    if (!/^[a-zA-Zа-яА-ЯіїІЇєЄґҐ'’ -]+$/.test(editData.last_name)) {
      setMessage({
        type: "error",
        text: "Прізвище містить недопустимі символи",
      });
      return false;
    }
    if (!editData.email.trim()) {
      setMessage({ type: "error", text: "Email не може бути порожнім" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setMessage({ type: "error", text: "Некоректний формат email" });
      return false;
    }
    if (!editData.phone.trim()) {
      setMessage({ type: "error", text: "Телефон не може бути порожнім" });
      return false;
    }
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(editData.phone)) {
      setMessage({ type: "error", text: "Некоректний формат телефону" });
      return false;
    }
    if (!editData.level) {
      setMessage({ type: "error", text: "Виберіть рівень" });
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/user/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка оновлення профілю");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setMessage({ type: "success", text: "Профіль успішно оновлено" });
      })
      .catch((err) => {
        setMessage({ type: "error", text: "Помилка: " + err.message });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/register");
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/user/", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка видалення акаунту");
        localStorage.removeItem("token");
        navigate("/register");
      })
      .catch((err) => {
        setMessage({ type: "error", text: "Помилка: " + err.message });
      });
  };

  const goToChangePassword = () => {
    navigate("/change-password");
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="error">Помилка: {error}</p>;

  return (
    <div className="profile-wrapper">
          <header className="header">
            <nav>
              <div className="nav-left">
                <a href="/home">Головна</a>
                <a href="#">Вивчення слів</a>
              </div>
            </nav>
          </header>
      <div className="profile-right">
        <form onSubmit={handleSubmit} className="profile-form" noValidate>
          <label>
            Ім'я:
            <input
              type="text"
              name="first_name"
              value={editData.first_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Прізвище:
            <input
              type="text"
              name="last_name"
              value={editData.last_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Телефон:
            <input
              type="tel"
              name="phone"
              value={editData.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Рівень:
            <select name="level" value={editData.level} onChange={handleChange}>
              <option value="">-- Виберіть рівень --</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </label>

          {message && (
            <p className={message.type === "error" ? "error" : "success"}>
              {message.text}
            </p>
          )}

          <button type="submit" className="save-btn">
            Зберегти зміни
          </button>
        </form>

        <div className="profile-actions" style={{ marginTop: "20px" }}>
          <button onClick={goToChangePassword}>Змінити пароль</button>

          <button onClick={handleLogout} className="logout-btn">
            Вийти з акаунту
          </button>
          <button
            onClick={handleDeleteAccount}
            className="delete-account-btn"
            style={{
              marginLeft: "10px",
              backgroundColor: "#e74c3c",
              color: "#fff",
            }}
          >
            Видалити акаунт
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
