import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import pencilIcon from "../../assets/pencil.png";
import deleteIcon from "../../assets/delete.png";
import AdminPanel from "./AdminPanel";
import TaskList from "./TaskList";
import "./ModuleSection.css";

const ModuleSection = () => {
  const { id } = useParams();

  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("reading");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [user, setUser] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [editSectionId, setEditSectionId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteSectionId, setDeleteSectionId] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "reading",
    content: "",
    media: null,
  });
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    question: "",
    options: ["", ""],
    correct_index: 0,
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
  const addOption = () => {
    setTaskForm((prev) => {
      if (prev.options.length >= 4) return prev;

      return {
        ...prev,
        options: [...prev.options, ""],
      };
    });
  };
  const handleCheck = async (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    let total = 0;
    let correct = 0;
    let wrong = 0;

    (section.tasks ?? []).forEach((task) => {
      const userAnswer = answers[task.id];

      total++;
      if (userAnswer === undefined || userAnswer === null) {
        wrong++;
        return;
      }

      if (Number(userAnswer) === Number(task.correct_index)) {
        correct++;
      } else {
        wrong++;
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
  const openCreateTask = (sectionId) => {
    setCurrentSectionId(sectionId);
    setEditTaskId(null);
    setTaskForm({
      question: "",
      options: ["", ""],
      correct_index: 0,
    });
    setTaskOpen(true);
  };

  const openEditTask = (task) => {
    setCurrentSectionId(task.module_section_id);
    setEditTaskId(task.id);

    setTaskForm({
      question: task.question,
      options: Array.isArray(task.options)
        ? task.options
        : JSON.parse(task.options || "[]"),
      correct_index: task.correct_index,
    });

    setTaskOpen(true);
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

    return Array.isArray(data)
      ? data.map((t) => ({
          ...t,
          options:
            typeof t.options === "string" ? JSON.parse(t.options) : t.options,
        }))
      : [];
  };

  const saveSection = async () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("content", form.content);

    if (form.media instanceof File) {
      formData.append("media", form.media);
    }

    const url = editSectionId
      ? `http://localhost:3001/api/modules/${id}/sections/${editSectionId}`
      : `http://localhost:3001/api/modules/${id}/sections`;

    const method = editSectionId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (editSectionId) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editSectionId ? { ...data, tasks: s.tasks } : s,
        ),
      );
    } else {
      setSections((prev) => [...prev, { ...data, tasks: [] }]);
    }

    setEditSectionId(null);
    setForm({ title: "", type: "reading", content: "", media: null });
    setPreview(null);
    setAdminOpen(false);
  };
  const saveTask = async () => {
    const url = editTaskId
      ? `http://localhost:3001/api/tasks/${editTaskId}`
      : `http://localhost:3001/api/tasks/${currentSectionId}`;

    const method = editTaskId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        question: taskForm.question,
        options: JSON.stringify(taskForm.options),
        correct_index: Number(taskForm.correct_index),
      }),
    });

    const data = await res.json();

    const normalized = {
      ...data,
      options:
        typeof data.options === "string"
          ? JSON.parse(data.options)
          : data.options,
    };

    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== currentSectionId) return s;
        let updatedTasks = s.tasks || [];
        if (editTaskId) {
          updatedTasks = (s.tasks || []).map((t) =>
            t.id === editTaskId ? normalized : t,
          );
        } else {
          updatedTasks = [...(s.tasks || []), normalized];
        }

        return {
          ...s,
          tasks: updatedTasks,
        };
      }),
    );

    setTaskOpen(false);
    setEditTaskId(null);
  };
  const deleteTask = async (taskId, sectionId) => {
    await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              tasks: (s.tasks || []).filter((t) => t.id !== taskId),
            }
          : s,
      ),
    );
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
                {isAdmin && (
                  <div className="admin-actions">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditSectionId(section.id);

                        setForm({
                          title: section.title,
                          type: section.type,
                          content: section.content,
                          media: section.media,
                        });

                        setPreview(
                          section.media
                            ? `http://localhost:3001/uploads/${section.media}`
                            : null,
                        );

                        setAdminOpen(true);
                      }}
                    >
                      <img src={pencilIcon} alt="Edit" />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => setDeleteSectionId(section.id)}
                    >
                      <img src={deleteIcon} alt="Delete" />
                    </button>
                  </div>
                )}
                <h3>{section.title}</h3>
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
                      <img className="card-image"
                        src={`http://localhost:3001/uploads/${section.media}`}
                        alt={section.title}
                      />
                    )}
                  </>
                )}
                {section.type === "vocabulary" ? (
                  <div className="vocab-list">
                    {section.content
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => {
                        const [word, translation] = line.split("—");

                        return (
                          <div className="vocab-item" key={i}>
                            <span>{word?.trim()}</span>
                            <span>{translation?.trim()}</span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text">{section.content}</p>
                )}

                <TaskList
                  section={section}
                  handleAnswer={handleAnswer}
                  answers={answers}
                  results={results}
                  isAdmin={isAdmin}
                  openCreateTask={openCreateTask}
                  openEditTask={openEditTask}
                  deleteTask={deleteTask}
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
            saveSection={saveSection}
          />
        </>
      )}
      {deleteSectionId && (
        <div className="modal-wrapper" onClick={() => setDeleteSectionId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Видалити секцію?</h3>
            <button
              className="save-button"
              onClick={async () => {
                await fetch(
                  `http://localhost:3001/api/modules/${id}/sections/${deleteSectionId}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
                );

                setSections((prev) =>
                  prev.filter((s) => s.id !== deleteSectionId),
                );

                setDeleteSectionId(null);
              }}
            >
              Так, видалити
            </button>

            <button
              className="cancel-button"
              onClick={() => setDeleteSectionId(null)}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
      {taskOpen && (
        <div className="modal-wrapper" onClick={() => setTaskOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editTaskId ? "Редагувати" : "Створити"} завдання</h3>

            <input
              className="input"
              value={taskForm.question}
              onChange={(e) =>
                setTaskForm({ ...taskForm, question: e.target.value })
              }
              placeholder="Питання"
            />

            {taskForm.options.map((opt, i) => (
              <div className="task-option" key={i}>
                <input
                  className="input"
                  value={opt}
                  placeholder={`Варіант ${i + 1}`}
                  onChange={(e) => {
                    const newOptions = [...taskForm.options];
                    newOptions[i] = e.target.value;
                    setTaskForm({ ...taskForm, options: newOptions });
                  }}
                />

                <label className="correct-answer">
                  <input
                    type="radio"
                    checked={taskForm.correct_index === i}
                    onChange={() =>
                      setTaskForm({
                        ...taskForm,
                        correct_index: i,
                      })
                    }
                  />
                </label>
              </div>
            ))}

            {taskForm.options.length < 4 && (
              <button className="save-button" type="button" onClick={addOption}>
                Додати варіант
              </button>
            )}

            <button className="save-button" onClick={saveTask}>
              {editTaskId ? "Оновити" : "Створити"}
            </button>

            {/* <button
              className="cancel-button"
              onClick={() => setTaskOpen(false)}
            >
              Закрити
            </button> */}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ModuleSection;
