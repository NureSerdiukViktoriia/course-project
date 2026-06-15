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
  <div className="analytics-page">
    <h2 className="analytics-title">Аналітика по курсах</h2>

    {!data ? (
      <p>Завантаження...</p>
    ) : (
      <>
        <div className="courses-list">
          {data.modules.map((m, index) => (
            <div
              key={m.moduleId}
              className="course-card"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="course-header">
                <span>{m.title}</span>
                <span className="percent">{Math.round(m.avg)}%</span>
              </div>

              <div className="course-bar">
                <div
                  className="course-fill"
                  style={{ width: `${m.avg}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {openIndex !== null && data.modules[openIndex] && (
          <div className="course-details">
            <h3>{data.modules[openIndex].title}</h3>

            {data.modules[openIndex].sections.map((s) => (
              <div key={s.id} className="section-row">
                <span>
                  {s.type} {s.sectionTitle ? `(${s.sectionTitle})` : ""}
                </span>

                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>

                <span>{s.progress}%</span>
              </div>
            ))}

            <div className="recommendations">
              {data.modules[openIndex].sections.some(
                (s) => s.progress < 50
              ) ? (
                <>
                  <h4>Рекомендації</h4>
                  {data.modules[openIndex].sections
                    .filter((s) => s.progress < 50)
                    .map((s) => (
                      <p key={s.id}>
                        Рекомендується повторити: {s.sectionTitle || s.type}
                      </p>
                    ))}
                </>
              ) : (
                <p className="no-reco">Рекомендацій немає!</p>
              )}
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
};

export default Analytics;
