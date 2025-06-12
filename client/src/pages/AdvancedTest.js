import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer.js";
import iconProfile from "../assets/userr.png";
import "./EasyTest.css";

const AdvancedTest = () => {
  const [easyTestData, setEasyTestData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(420);
  const timerId = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/miniTest/advanced")
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
    if (showResult) {
      clearInterval(timerId.current);
      return;
    }
    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId.current);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId.current);
  }, [showResult]);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === easyTestData[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < easyTestData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      clearInterval(timerId.current);
      setShowResult(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
          <div className="timer">{formatTime(timeLeft)}</div>

          <h2>
            Тест просунутого рівня <br />
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

export default AdvancedTest;
