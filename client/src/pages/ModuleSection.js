import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./ModuleSection.css";

const ModuleSection = () => {
  const { id } = useParams();

  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("vocabulary");

  useEffect(() => {
    fetch(`http://localhost:3001/api/modules/${id}/sections`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSections(data));
  }, [id]);

  const types = ["vocabulary", "grammar", "reading", "listening", "test"];

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
                <p className="type">{s.type}</p>
                <div className="text">{s.content}</div>
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
