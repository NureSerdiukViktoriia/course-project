import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Analytics from "./Analytics";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Profile.css";

const levels = [
  { label: "Початковий", value: "початковий" },
  { label: "Середній", value: "середній" },
  { label: "Просунутий", value: "просунутий" },
];

const getXpStatus = (xp = 0) => {
  if (xp >= 2000) return "Майстер";
  if (xp >= 1000) return "Просунутий мовець";
  if (xp >= 600) return "Впевнений мовець";
  if (xp >= 300) return "Практик";
  if (xp >= 100) return "Початківець";
  return "Новачок";
};

const getNextXp = (xp = 0) => {
  if (xp < 100) return 100;
  if (xp < 300) return 300;
  if (xp < 600) return 600;
  if (xp < 1000) return 1000;
  if (xp < 2000) return 2000;
  return xp;
};

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
  const [achievements, setAchievements] = useState([]);

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
        const normalizedLevel = (data.level || "").toLowerCase();

        setUserData(data);

        setEditData({
          first_name: data.first_name || "",
          last_name: data.second_name || "",
          email: data.email || "",
          phone: data.phone || "",
          level: normalizedLevel,
        });

        return fetch("http://localhost:3001/user/achievements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setAchievements(data);
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

  const xp = userData?.xp || 0;
  const nextXp = getNextXp(xp);
  const status = getXpStatus(xp);
  const progress = nextXp === xp ? 100 : Math.min((xp / nextXp) * 100, 100);

  return (
    <div className="profile-wrapper">
      <header className="header">
        <nav>
          <div className="nav-left">
            <a href="/home">Головна</a>
            <a href="/words">Вивчення слів</a>
            <a href="/dictionary">Словник</a>
          </div>
        </nav>
      </header>
      <h2 className="profile-user">Профіль користувача</h2>
      <div className="profile-layout">
        <div className="profile-left">
          <form onSubmit={handleSubmit} className="profile-form" noValidate>
            <div className="row-fields">
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
            </div>

            <label className="full-width">
              Email:
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
              />
            </label>

            <div className="row-fields">
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
                <select
                  name="level"
                  value={editData.level}
                  onChange={handleChange}
                >
                  <option value="">-- Виберіть рівень --</option>
                  {levels.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="save-btn">
              Зберегти зміни
            </button>

            <button
              onClick={goToChangePassword}
              className="change-password-btn"
            >
              Змінити пароль
            </button>

            <div className="progress-section">
            <h3 className="section-title">Прогрес користувача</h3>
              <div className="xp-card">
                <div className="xp-row">
                  <span>XP:</span>
                  <strong>{xp}</strong>
                </div>

                <div className="xp-row">
                  <span>Статус:</span>
                  <strong>{status}</strong>
                </div>

                <div className="xp-progress-bar">
                  <div
                    className="xp-progress"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="xp-text">
                  {xp >= 2000
                    ? "Максимальний статус досягнуто"
                    : `${xp} / ${nextXp} XP до наступного статусу`}
                </p>
              </div>
            </div>

            <div className="achievements-card">
              <h3>Досягнення</h3>

              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-item ${
                    achievement.completed ? "completed" : ""
                  }`}
                >
                  <div>
                    <strong>{achievement.name}</strong>
                    <p>{achievement.description}</p>
                  </div>

                  <span>
                    {achievement.completed ? "Виконано" : "Не виконано"}
                  </span>
                </div>
              ))}
            </div>

            {message && (
              <p className={message.type === "error" ? "error" : "success"}>
                {message.text}
              </p>
            )}
          </form>
        </div>

        <div className="profile-right-panel">
          <Analytics userId={userData?.id} />
        </div>
      </div>
      <div className="profile-actions" style={{ marginTop: "20px" }}>
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

      <Footer />
    </div>
  );
};

export default Profile;
