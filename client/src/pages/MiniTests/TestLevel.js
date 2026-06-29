import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer.js";
import Header from "../../components/Header.js";
import { useNavigate } from "react-router-dom";
import TimeIcon from "../../assets/newWords1.png";
import QuestionIcon from "../../assets/newWords2.png";
import pencilIcon from "../../assets/pencil.png";
import deleteIcon from "../../assets/delete.png";
import Puzzle from "../../assets/puzzle.png";
import AdminPanelMiniTests from "./AdminPanelMiniTests";
import "./TestLevel.css";

const TestLevel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("усі");
  const initialForm = {
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswerIndex: 0,
    level: "початковий",
  };

  const [form, setForm] = useState(initialForm);

  const resetForm = () => {
    setForm(initialForm);
  };

  const saveQuestion = async () => {
    const url = editId
      ? `http://localhost:3001/api/miniTest/${editId}`
      : "http://localhost:3001/api/miniTest";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);

    setOpen(false);
    setEditId(null);
    resetForm();
    fetchQuestions();
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  const fetchQuestions = async () => {
    const res = await fetch("http://localhost:3001/api/miniTest", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setQuestions(data);
  };
  const deleteQuestion = async (id) => {
    await fetch(`http://localhost:3001/api/miniTest/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchQuestions();
  };
  const easytest = () => {
    navigate("/test/beginner");
  };
  const intermediatetest = () => {
    navigate("/test/intermediate");
  };
  const advancedtest = () => {
    navigate("/test/advanced");
  };
  const filteredQuestions =
    selectedLevel === "усі"
      ? questions
      : questions.filter((q) => q.level === selectedLevel);
  return (
    <div className="test-level-wrapper">
      <Header />

      <h2>Міні-тест</h2>

      <p className="mini-test-p">
        Пройди міні-тест і закріпи нові слова та граматику!
      </p>

      <div className="test-info">
        <div className="test-detail">
          <img src={TimeIcon} alt="time" />
          <span>15 питань</span>
        </div>
        <div className="test-detail">
          <img src={QuestionIcon} alt="questions" />
          <span>7 хвилин</span>
        </div>
      </div>
      <div className="difficulty-header">
        <img src={Puzzle} alt="puzzle" />
        <h3 className="difficulty-title">Оберіть рівень складності</h3>
      </div>

      <div className="difficulty-options">
        <div className="difficulty-card">
          <h4>Початковий (A1–A2)</h4>
          <p>Базова лексика, прості речення, переклади слів</p>
          <button onClick={easytest}>Почати</button>
        </div>
        <div className="difficulty-card">
          <h4>Середній (B1–B2)</h4>
          <p>Ситуаційні діалоги, словосполучення, базова граматика</p>
          <button onClick={intermediatetest}>Почати</button>
        </div>
        <div className="difficulty-card">
          <h4>Просунутий (C1)</h4>
          <p>Складні граматичні структури, синоніми/антоніми</p>
          <button onClick={advancedtest}>Почати</button>
        </div>
      </div>
      {isAdmin && (
        <>
          <button
            className="add-mini-button"
            onClick={() => {
              setEditId(null);
              resetForm();
              setOpen(true);
            }}
          >
            Додати питання
          </button>
          <button
            className="add-mini-button"
            onClick={() => {
              setShowList(!showList);
              if (!showList) fetchQuestions();
            }}
          >
            {showList ? "Сховати питання" : "Всі питання"}
          </button>
        </>
      )}
      {isAdmin && showList && (
        <div className="mini-admin-list">
          <div className="mini-filter">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="усі">Усі питання</option>
              <option value="початковий">Початковий</option>
              <option value="середній">Середній</option>
              <option value="просунутий">Просунутий</option>
            </select>
          </div>
          <div className="mini-grid">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="mini-card">
                <div className="mini-actions">
                  <button
                    className="edit-button-mini-test"
                    onClick={() => {
                      setEditId(q.id);
                      setForm({
                        question: q.question,
                        option1: q.options?.[0] || "",
                        option2: q.options?.[1] || "",
                        option3: q.options?.[2] || "",
                        option4: q.options?.[3] || "",
                        correctAnswerIndex: q.correctAnswerIndex,
                        level: q.level,
                      });
                      setOpen(true);
                    }}
                  >
                    <img src={pencilIcon} alt="Edit" />
                  </button>

                  <button
                    className="delete-button-mini-test"
                    onClick={() => deleteQuestion(q.id)}
                  >
                    <img src={deleteIcon} alt="Delete" />
                  </button>
                </div>

                <p className="mini-test-question">{q.question}</p>

                {q.options?.map((opt, i) => (
                  <div key={i}>
                    {i + 1}. {opt}
                  </div>
                ))}

                <div className="mini-level">{q.level}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <AdminPanelMiniTests
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        saveQuestion={saveQuestion}
      />
      <Footer />
    </div>
  );
};

export default TestLevel;
