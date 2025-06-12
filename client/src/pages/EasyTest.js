import React, { useState, useEffect } from "react";
import Footer from "../components/Footer.js";
import iconProfile from "../assets/userr.png";
import "./EasyTest.css";

const EasyTest = () => {
  const [easyTestData, setEasyTestData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(420);

  useEffect(() => {
    fetch("http://localhost:3001/api/miniTest/beginner")
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні даних");
        return res.json();
      })
      .then((data) => {
        setEasyTestData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showResult) return;

    if (timeLeft === 0) {
      setShowResult(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, showResult]);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === easyTestData[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < easyTestData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Завантаження питань...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (easyTestData.length === 0) return <p>Питань немає</p>;

  return (
    <div className="test-level-wrapper">
      <header className="header">
        <nav>
          <div className="nav-left">
            <a href="/home">Головна</a>
            <a href="/testLevel">Міні-тести</a>
          </div>
          <div className="nav-right">
            <a href="/languageBuddy">Language Buddy</a>
            <a href="/profile">
              <img src={iconProfile} alt="Profile" className="profile-icon" />
            </a>
          </div>
        </nav>
      </header>

      {!showResult ? (
        <>
          <div className="timer">Час: {formatTime(timeLeft)}</div>
          <h2>
            Тест початкового рівня <br />
            <p className="easy-test-question">
              Питання {currentQuestion + 1} з {easyTestData.length}
            </p>
          </h2>
          <p className="question-text">
            {easyTestData[currentQuestion].question}
          </p>
          <div className="options-container">
            {easyTestData[currentQuestion].options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)}>
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="result-container">
          <h2>Тест завершено!</h2>
          <p>
            Ваш результат: {score} з {easyTestData.length}
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
              setTimeLeft(420);
            }}
          >
            Пройти знову
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EasyTest;
