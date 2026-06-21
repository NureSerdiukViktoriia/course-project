import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

const Analytics = ({ userId }) => {
  const [data, setData] = useState({
    modules: [],
    weakSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [recommendedLevel, setRecommendedLevel] = useState(null);
  const module = data.modules?.find((m) => m.moduleId === openModuleId);
  const moduleWeakSections =
    module?.sections?.filter((s) => s.progress < 80) || [];

  const hasWeakSections = moduleWeakSections.length > 0;

  const recommendedModules =
    data.modules?.filter((m) => m.level === recommendedLevel) || [];
  const statusLabel = {
    not_started: "Не розпочато",
    in_progress: "У процесі",
    completed: "Завершено",
  };
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/miniTestResult/result/latest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendedLevel(data?.suggested_level || null);
      });
  }, []);
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
  if (loading) return <p>Завантаження аналітики...</p>;

  return (
    <div className="analytics-page">
      <div>
        {recommendedLevel && (
          <div className="recommended-block">
            <h2 className="recommended-title">Результат міні-тесту</h2>

            <p className="recommended-subtitle">
              Вам визначено рівень
              <span className="level-badge">{recommendedLevel}</span>
            </p>

            <p className="recommended-hint">
              Спробуйте пройти курси цього рівня. Якщо відчуєте, що складно або
              легко - ви можете змінити рівень у профілі!
            </p>
          </div>
        )}
      </div>

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

                  <div className="percent-block">
                    <span className="percent">{Math.round(m.avg)}%</span>
                    <span className={`status ${m.status}`}>
                      {statusLabel[m.status] || ""}
                    </span>
                  </div>
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

              <div>
                {hasWeakSections ? (
                  <>
                    <h4>
                      Для успішного завершення курсу необхідно перепройти:
                    </h4>
                    {moduleWeakSections.map((s) => (
                      <p key={`${s.sectionId}-${s.moduleId}`}>
                        {s.sectionTitle} ({s.type})
                      </p>
                    ))}

                    <button
                      className="go-to-section-btn"
                      onClick={() => navigate(`/modules/${module.moduleId}`)}
                    >
                      Перейти до курсу
                    </button>
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
