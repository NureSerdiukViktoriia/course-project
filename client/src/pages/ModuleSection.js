import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./ModuleSection.css";

const ModuleSection = () => {
  const { id } = useParams();

  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    question: "",
    answer: false,
    options: [],
    category: "listening",
  });

  const [form, setForm] = useState({
    title: "",
    type: "reading",
    content: "",
    media: null,
  });
  const handleAnswer = (taskId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [taskId]: value,
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
    fetch("http://localhost:3001/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  const isAdmin = user?.role === "admin";

  const types = ["reading", "listening", "vocabulary", "grammar", "test"];

  const filtered = sections.filter((s) => s.type === activeTab);
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

    setSections((prev) => [...prev, newSection]);

    setForm({
      title: "",
      type: "reading",
      content: "",
      media: null,
    });
  };
  const saveTask = async (sectionId) => {
    const isEdit = !!editingTask;

    const url = editingTask
      ? `http://localhost:3001/api/reading-tasks/${editingTask.id}`
      : `http://localhost:3001/api/reading-tasks/${sectionId}`;

    const method = editingTask ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(taskForm),
    });

    const data = await res.json();

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              tasks: editingTask
                ? s.tasks.map((t) => (t.id === data.id ? data : t))
                : [...(s.tasks || []), data],
            }
          : s,
      ),
    );

    setTaskForm({
      question: "",
      answer: false,
      options: [],
      category: "listening",
    });
    setEditingTask(null);
  };
  const deleteTask = async (id) => {
    await fetch(`http://localhost:3001/api/reading-tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              tasks: s.tasks?.filter((t) => t.id !== id),
            }
          : s,
      ),
    );
  };
  const startEdit = (task) => {
    setEditingTask(task);

    setTaskForm({
      question: task.question,
      answer: task.answer ?? false,
      options: task.options ?? [],
      category: task.category ?? "listening",
    });
  };
  const loadTasks = async (sectionId) => {
    const res = await fetch(
      `http://localhost:3001/api/reading-tasks/${sectionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const reading = await res.json();

    const res2 = await fetch(
      `http://localhost:3001/api/test-listening-tasks/${sectionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const test = await res2.json();

    return [
      ...(Array.isArray(reading) ? reading : []),
      ...(Array.isArray(test) ? test : []),
    ];
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
            filtered.map((s) => (
              <div className="card" key={s.id}>
                <h3>{s.title}</h3>
                {s.media && (
                  <>
                    {s.media.endsWith(".mp3") || s.media.endsWith(".wav") ? (
                      <audio controls>
                        <source
                          src={`http://localhost:3001/uploads/${s.media}`}
                        />
                      </audio>
                    ) : (
                      <img
                        src={`http://localhost:3001/uploads/${s.media}`}
                        alt={s.title}
                        style={{ maxWidth: "100%", marginTop: "10px" }}
                      />
                    )}
                  </>
                )}
                {s.type === "vocabulary" && (
                  <div className="vocab-list">
                    {JSON.parse(s.content).map((w, i) => (
                      <div key={i}>
                        {w.word} — {w.translation}
                      </div>
                    ))}
                  </div>
                )}

                {s.type === "grammar" && (
                  <div className="grammar-block">
                    <div className="text" style={{ whiteSpace: "pre-line" }}>
                      {s.content}
                    </div>
                  </div>
                )}

                {s.type === "reading" && (
                  <div className="text">{s.content}</div>
                )}

                {s.tasks?.map((task) => (
                  <div key={task.id}>
                    <p>{task.question}</p>
                    {isAdmin && (
                      <div>
                        <button onClick={() => startEdit(task)}>Edit</button>
                        <button onClick={() => deleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                    {task.answer !== undefined ? (
                      <>
                        <label>
                          <input
                            type="radio"
                            name={task.id}
                            onChange={() => handleAnswer(task.id, true)}
                          />
                          True
                        </label>

                        <label>
                          <input
                            type="radio"
                            name={task.id}
                            onChange={() => handleAnswer(task.id, false)}
                          />
                          False
                        </label>
                      </>
                    ) : (
                      task.options?.map((opt, i) => (
                        <label key={i}>
                          <input
                            type="radio"
                            name={task.id}
                            onChange={() => handleAnswer(task.id, i)}
                          />
                          {opt}
                        </label>
                      ))
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="admin-panel">
          <h3>Create section</h3>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <input
            type="file"
            accept="image/*,audio/*"
            onChange={(e) => setForm({ ...form, media: e.target.files[0] })}
          />

          <button onClick={createSection}>Create section</button>

          <div>
            <h3>{editingTask ? "Edit task" : "Create task"}</h3>

            <input
              placeholder="Question"
              value={taskForm.question}
              onChange={(e) =>
                setTaskForm({ ...taskForm, question: e.target.value })
              }
            />

            <button onClick={() => saveTask(activeSectionId)}>Save task</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ModuleSection;
