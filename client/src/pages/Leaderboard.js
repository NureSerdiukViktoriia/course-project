import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/user/leaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не вдалося завантажити рейтинг");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="error">Помилка: {error}</p>;

return (
  <div className="leaderboard-page">
    <Header />

    <main className="leaderboard-content">
      <h1>Рейтинг користувачів</h1>

      <p className="leaderboard-subtitle">
        Топ-5 користувачів з найбільшою кількістю XP
      </p>

      <div className="leaderboard-card">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`leaderboard-row ${
              index === 0
                ? "leaderboard-first"
                : index === 1
                ? "leaderboard-second"
                : index === 2
                ? "leaderboard-third"
                : ""
            }`}
          >
            <div className="leaderboard-place">
            {index === 0 ? (
                "🥇"
            ) : index === 1 ? (
                "🥈"
            ) : index === 2 ? (
                "🥉"
            ) : (
                <div className="place-number">{index + 1}</div>
            )}
            </div>

            <div className="leaderboard-user">
              <strong>
                {user.first_name} {user.second_name}
              </strong>
            </div>

            <div className="leaderboard-xp">
              {user.xp || 0} XP
            </div>
          </div>
        ))}
      </div>
    </main>

    <Footer />
  </div>
);
};

export default Leaderboard;