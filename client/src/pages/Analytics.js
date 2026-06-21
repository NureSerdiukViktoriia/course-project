import React, { useEffect, useState } from "react";
import "./Analytics.css";

const Analytics = ({ userId }) => {
  const [data, setData] = useState({
    modules: [],
    weakSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    fetch(`http://localhost:3001/api/analytics/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData({
          modules: data.modules || [],
          weakSections: data.weakSections || [],
        });
      })
      .finally(() => setLoading(false));
  }, [userId]);
  const module = data.modules?.find((m) => m.moduleId === openModuleId);
  if (loading) return <p>Завантаження аналітики...</p>;

  return (
    <div className="analytics-page">
      <h2 className="analytics-title">Аналітика по курсах</h2>

      {!data ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <div className="courses-list">
            {data.modules?.map((m) => (
              <div
                key={m.moduleId}
                className="course-card"
                onClick={() =>
                  setOpenModuleId(
                    openModuleId === m.moduleId ? null : m.moduleId,
                  )
                }
              >
                <div className="course-header">
                  <div>
                    <span>{m.title}</span>
                    <small style={{ marginLeft: "8px", opacity: 0.7 }}>
                      ({m.level})
                    </small>
                  </div>

                  <span className="percent">{Math.round(m.avg)}%</span>
                </div>

                <div className="course-bar">
                  <div className="course-fill" style={{ width: `${m.avg}%` }} />
                </div>
              </div>
            ))}
          </div>

          {module && (
            <div className="course-details">
              <h3>{module.title}</h3>

              {module.sections?.map((s) => (
                <div
                  key={`${s.sectionId}-${s.moduleId}`}
                  className="section-row"
                >
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
                {module.sections?.some((s) => s.progress < 80) ? (
                  <>
                    <h4>Рекомендації</h4>

                    {module.sections
                      .filter((s) => s.progress < 80)
                      .map((s) => (
                        <p key={`${s.sectionId}-${s.moduleId}`}>
                          Рекомендується повторити: {s.sectionTitle} ({s.type})
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
