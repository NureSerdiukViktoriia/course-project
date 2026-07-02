import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer.js";
import iconProfile from "../../assets/userr.png";
import "./TestPage.css";

const TestPage = () => {
  const { level } = useParams();
  const [testData, setTestData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(420);

  useEffect(() => {
    fetch(`http://localhost:3001/api/miniTest/${level}`)
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні даних");
        return res.json();
      })
      .then((data) => {
        setTestData(data);
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
  const mapLevel = {
    beginner: "початковий",
    intermediate: "середній",
    advanced: "просунутий",
  };
  const saveResult = async (finalScore) => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3001/api/miniTestResult/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mini_test_id: 1,
        correct_answers: finalScore,
        level: mapLevel[level],
      }),
    });
  };
  const handleAnswer = (selectedIndex) => {
    const isCorrect =
      selectedIndex === testData[currentQuestion].correctAnswerIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }
    if (currentQuestion + 1 < testData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      saveResult(newScore);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Завантаження питань...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (testData.length === 0) return <p>Питань немає</p>;

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
              Питання {currentQuestion + 1} з {testData.length}
            </p>
          </h2>
          <p className="question-text">{testData[currentQuestion].question}</p>
          <div className="options-container">
            {testData[currentQuestion].options.map((option, idx) => (
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
            Ваш результат: {score} з {testData.length}
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

export default TestPage;
