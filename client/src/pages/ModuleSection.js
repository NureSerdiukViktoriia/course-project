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
    fetch(`http://localhost:3001/api/modules/${id}/sections`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSections(data));
  }, [id]);
  useEffect(() => {
    fetch("http://localhost:3001/user/", {
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

                {s.SectionTasks?.map((task) => (
                  <div key={task.id}>
                    {s.type === "reading" && (
                      <>
                        <p>{task.data.statement}</p>
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
                    )}

                    {s.type === "listening" && (
                      <>
                        <p>{task.data.question}</p>
                        {task.data.options.map((opt, i) => (
                          <label key={i}>
                            <input
                              type="radio"
                              name={task.id}
                              onChange={() => handleAnswer(task.id, i)}
                            />
                            {opt}
                          </label>
                        ))}
                      </>
                    )}

                    {s.type === "test" && (
                      <>
                        <p>{task.data.question}</p>
                        {task.data.options.map((opt, i) => (
                          <label key={i}>
                            <input
                              type="radio"
                              name={task.id}
                              checked={answers?.[task.id] === i}
                              onChange={() => handleAnswer(task.id, i)}
                            />
                            {opt}
                          </label>
                        ))}
                      </>
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
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ModuleSection;
