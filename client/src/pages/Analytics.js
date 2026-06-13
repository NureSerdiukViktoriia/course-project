import React, { useEffect, useState } from "react";

const Analytics = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/api/analytics/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [userId]);

  if (!data) return <p>Завантаження аналітики...</p>;

  return (
    <div className="analytics-block">
      <h3>Аналітика прогресу</h3>

      <div>
        <p>Середній прогрес: {data.avgProgress}%</p>
        <p>Завершено модулів: {data.completedModules}</p>
      </div>

      <div>
        <h4>Слабкі теми</h4>
        {data.weakModules.map((m) => (
          <p key={m.id}>
            {m.name} — {m.progress}%
          </p>
        ))}
      </div>
    </div>
  );
};

export default Analytics;