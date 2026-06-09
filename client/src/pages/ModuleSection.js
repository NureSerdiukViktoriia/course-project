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

  const types = ["reading", "listening", "vocabulary", "grammar", "test"];

  const filtered = sections.filter((s) => s.type === activeTab);

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

      <Footer />
    </div>
  );
};

export default ModuleSection;
