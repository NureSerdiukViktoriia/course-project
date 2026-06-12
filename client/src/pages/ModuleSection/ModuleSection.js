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
  const [user, setUser] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "reading",
    content: "",
    media: null,
  });

  const types = ["reading", "listening", "vocabulary", "grammar", "test"];
  const isAdmin = user?.role === "admin";

  const filtered = sections.filter((s) => s.type === activeTab);

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

                <TaskList section={section} handleAnswer={handleAnswer} />
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
