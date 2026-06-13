import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import AdminPanel from "./AdminPanel";
import TaskList from "./TaskList";
import "./ModuleSection.css";

const ModuleSection = () => {
  const { id } = useParams();

  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [user, setUser] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [adminOpen, setAdminOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "reading",
    content: "",
    media: null,
  });

  const types = ["reading", "listening", "vocabulary", "grammar"];
  const isAdmin = user?.role === "admin";

  const filtered = sections.filter((s) => s.type === activeTab);

  const handleAnswer = (taskId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleCheck = async (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    let total = 0;
    let correct = 0;

    (section.tasks ?? []).forEach((task) => {
      const userAnswer = answers[task.id];

      if (userAnswer === undefined || userAnswer === null) return;

      total++;

      if (Number(userAnswer) === Number(task.correct_index)) {
        correct++;
      }
    });

    const score = total === 0 ? 0 : Math.round((correct / total) * 100);

    await fetch("http://localhost:3001/api/progress/section", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        sectionId,
        progress: score,
        completed: score >= 80,
      }),
    });

    setProgressMap((prev) => ({
      ...prev,
      [sectionId]: true,
    }));

    setResults((prev) => ({
      ...prev,
      [sectionId]: {
        score,
        correct,
        wrong: total - correct,
        total,
      },
    }));
  };
  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `http://localhost:3001/api/modules/${id}/sections`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      const withTasks = await Promise.all(
        data.map(async (section) => {
          const tasks = await loadTasks(section.id);
          return { ...section, tasks };
        }),
      );

      setSections(withTasks);
    };

    load();
  }, [id]);
  useEffect(() => {
    const loadProgress = async () => {
      const res = await fetch(
        `http://localhost:3001/api/progress/module/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();
      setProgressMap(data);
    };

    loadProgress();
  }, [id]);
  useEffect(() => {
    fetch("http://localhost:3001/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const loadTasks = async (sectionId) => {
    const res = await fetch(`http://localhost:3001/api/tasks/${sectionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  };

  const createSection = async () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("content", form.content);

    if (form.media) {
      formData.append("media", form.media);
    }

    const res = await fetch(
      `http://localhost:3001/api/modules/${id}/sections`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
    );

    const newSection = await res.json();
    setSections((prev) => [...prev, { ...newSection, tasks: [] }]);

    setForm({
      title: "",
      type: "reading",
      content: "",
      media: null,
    });
  };

  return (
    <div className="module-layout">
      <Header />

      <div className="module-body">
        <div className="sidebar">
          {types.map((t) => (
            <div
              key={t}
              className={`sidebar-item ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </div>
          ))}
        </div>

        <div className="content">
          {filtered.length === 0 ? (
            <p>Немає матеріалів</p>
          ) : (
            filtered.map((section) => (
              <div className="card" key={section.id}>
                <h3>{section.title}</h3>
                {section.type === "vocabulary" ? (
                  <div className="vocab-list">
                    {JSON.parse(section.content).map((w, i) => (
                      <div className="vocab-item" key={i}>
                        {w.word} — {w.translation}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ whiteSpace: "pre-line" }}>{section.content}</p>
                )}

                {section.media && (
                  <>
                    {section.media.endsWith(".mp3") ||
                    section.media.endsWith(".wav") ? (
                      <audio controls>
                        <source
                          src={`http://localhost:3001/uploads/${section.media}`}
                        />
                      </audio>
                    ) : (
                      <img
                        src={`http://localhost:3001/uploads/${section.media}`}
                        alt={section.title}
                      />
                    )}
                  </>
                )}

                <TaskList
                  section={section}
                  handleAnswer={handleAnswer}
                  answers={answers}
                  results={results}
                />
                {(section.tasks?.length ?? 0) > 0 && (
                  <button
                    className="save-button-tasks"
                    onClick={() => handleCheck(section.id)}
                    disabled={progressMap[section.id]}
                  >
                    {progressMap[section.id] ? "Вже пройдено" : "Перевірити"}
                  </button>
                )}
                {results[section.id] && (
                  <div className="results-box">
                    <p>Правильних: {results[section.id].correct}</p>
                    <p>Неправильних: {results[section.id].wrong}</p>
                    <p>Результат: {results[section.id].score}%</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <button className="open-admin-btn" onClick={() => setAdminOpen(true)}>
            Додати секцію
          </button>

          <AdminPanel
            open={adminOpen}
            onClose={() => setAdminOpen(false)}
            types={types}
            form={form}
            setForm={setForm}
            createSection={createSection}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default ModuleSection;
