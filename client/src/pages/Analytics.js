import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const Analytics = ({ userId }) => {
  const [data, setData] = useState({
    modules: [],
    weakSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [recommendedLevel, setRecommendedLevel] = useState(null);
  const module = data.modules?.find((m) => m.moduleId === openModuleId);
  const [testHistory, setTestHistory] = useState([]);
  const moduleWeakSections =
    module?.sections?.filter((s) => s.progress < 80) || [];

  const hasWeakSections = moduleWeakSections.length > 0;

  const statusLabel = {
    not_started: "Не розпочато",
    in_progress: "У процесі",
    completed: "Завершено",
  };
  const navigate = useNavigate();
  const levelMap = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
  };
  const chartData = testHistory.map((t) => ({
    id: t.id,
    rawDate: t.date,
    label: new Date(t.date).toISOString(),
    displayDate: new Date(t.date).toLocaleDateString("uk-UA"),
    level: t.level,
    levelNum: levelMap[t.level],
    score: t.correct,
  }));
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const d = payload[0].payload;

    return (
      <div className="tooltip-box">
        <p>{new Date(d.rawDate).toLocaleDateString("uk-UA")}</p>
        <p>Рівень: {d.level}</p>
        <p>Правильні відповіді: {d.score}</p>
      </div>
    );
  };
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/api/analytics/mini-tests/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTestHistory(data.timeline || []);
      });
  }, [userId]);
  if (loading) return <p>Завантаження аналітики...</p>;

  return (
    <div className="analytics-page">
      <div className="recommended-level-section">
        {recommendedLevel && (
          <div className="recommended-level-card">
            <h3>Рекомендований рівень навчання</h3>

            <p className="recommended-subtitle">
              За результатами міні-тесту рекомендований рівень
              <span className="level-badge">{recommendedLevel}</span>
            </p>

            <p className="recommended-hint">
              Цей рівень підібрано на основі вашого результату. Рекомендуємо
              почати з курсів цього рівня та за потреби скоригувати його в
              налаштуваннях профілю.
            </p>
          </div>
        )}
      </div>
      <div className="chart-card">
        <h3>Прогрес міні-тестів</h3>

        {testHistory.length === 0 ? (
          <div className="chart-empty">
            <p>
              Ви ще не проходили міні-тести. Пройдіть тест, щоб побачити свій
              прогрес та отримати рекомендації.
            </p>

            <button
              className="go-to-section-btn"
              onClick={() => navigate("/testLevel")}
            >
              Пройти тест
            </button>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("uk-UA")
                  }
                />

                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(v) =>
                    ({
                      1: "A1",
                      2: "A2",
                      3: "B1",
                      4: "B2",
                      5: "C1",
                    })[v]
                  }
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="levelNum"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="chart-insight">
              <h4>Аналіз прогресу</h4>

              {testHistory.length === 1 ? (
                <p>
                  Поки що у вас лише один результат тесту. Після кількох
                  проходжень система зможе побудувати вашу динаміку рівня.
                </p>
              ) : (
                <p>
                  {(() => {
                    const first = testHistory[0]?.level;
                    const last = testHistory[testHistory.length - 1]?.level;

                    const levelUp = levelMap[last] > levelMap[first];
                    const levelDown = levelMap[last] < levelMap[first];

                    if (levelUp) {
                      return "Вітаємо! Ваш рівень покращується! Ви рухаєтесь у правильному напрямку.";
                    }

                    if (levelDown) {
                      return "Результати трохи знизилися. Варто повторити матеріал.";
                    }

                    return "Рівень стабільний. Рекомендується більше практики для подальшого прогресу.";
                  })()}
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="analytics-section">
        <h2 className="analytics-title">Аналітика по курсах</h2>

        {loading ? (
          <p>Завантаження...</p>
        ) : !data?.modules || data.modules.length === 0 ? (
          <div className="chart-empty">
            <p>
              У вас ще немає пройдених курсів. Пройдіть хоча б один курс, щоб побачити аналітику прогресу!
            </p>

            <button
              className="go-to-section-btn"
              onClick={() => navigate("/modules")}
            >
              Перейти до курсів
            </button>
          </div>
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
                    <div
                      className="course-fill"
                      style={{ width: `${m.avg}%` }}
                    />
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
    </div>
  );
};

export default Analytics;
