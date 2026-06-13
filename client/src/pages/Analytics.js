import React, { useEffect, useState } from "react";
import "./Analytics.css";

const Analytics = ({ userId }) => {
  const [data, setData] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

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
    <div className="analytics">
      {data.modules.map((m, index) => (
        <div key={index} className="module-card">
          <div
            className="module-header"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <h3>{m.title}</h3>
            <span>{Math.round(m.avg)}%</span>
          </div>

          {openIndex === index && (
            <div className="module-body">
              {m.sections.map((s) => (
                <div key={s.id} className="bar-row">
                  <span>
                    {s.type} {s.sectionTitle ? `(${s.sectionTitle})` : ""}
                  </span>

                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>

                  <span>{s.progress}%</span>
                </div>
              ))}

              <div className="recommendations">
                <h4>Рекомендації</h4>

                {m.sections
                  ?.filter((s) => s.progress < 50)
                  ?.map((s) => (
                    <p key={s.id}>
                      Рекомендується повторити: {s.sectionTitle || s.type}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Analytics;
