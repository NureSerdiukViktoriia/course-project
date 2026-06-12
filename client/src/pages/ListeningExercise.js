import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExercisePage.css";
import iconProfile from "../assets/userr.png";
import iconListening from "../assets/listening.png";
import Notification from "../components/Notification";

const AppHeader = ({ onProfileClick }) => (
  <header className="app-header-words">
    <div className="header-nav-words">
      <Link to="/words" className="nav-link-words">
        <i className="fas fa-arrow-left"></i>
        <span>Назад</span>
      </Link>
    </div>
    <div className="header-profile" onClick={onProfileClick}>
      <img src={iconProfile} alt="Profile" />
    </div>
  </header>
);

const ListeningExercise = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    message: "",
    type: "",
    onConfirm: null,
  });
  
  const handleProfileNavigation = () => navigate("/profile");

  useEffect(() => {
    document.body.style.backgroundColor = "#f0b8b8";

    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Доступ заборонено. Будь ласка, увійдіть в систему.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/exercises/listening", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не вдалося завантажити завдання.");
        }

        const data = await response.json();

        if (!data.tasks || data.tasks.length === 0) {
          throw new Error("Для вашого рівня ще немає завдань цього типу.");
        }

        setTasks(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    return () => {
      document.body.style.backgroundColor = "";
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakWord = () => {
    const currentTask = tasks[currentIndex];

    if (!currentTask) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentTask.question_text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };
  
  const addXp = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3001/user/add-xp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === tasks[currentIndex].correct_answer) {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
      addXp();
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setNotification({
        message: `Тест завершено! Ваш результат: ${score} балів`,
        type: "info",
        onConfirm: () => navigate("/words"),
      });
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  const hideNotification = () => {
    if (notification.onConfirm) {
      notification.onConfirm();
    }

    setNotification({
      message: "",
      type: "",
      onConfirm: null,
    });
  };
  
  const currentTask = tasks[currentIndex];

  let options = Array.isArray(currentTask.options)
    ? currentTask.options
    : currentTask.options?.startsWith("[")
    ? JSON.parse(currentTask.options)
    : currentTask.options.split(",").map((item) => item.trim());

  return (
    <div className="exercise-page">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
      <AppHeader onProfileClick={handleProfileNavigation} />

        <div className="exercise-content">
            <div className="task-header">
            <img src={iconListening} alt="Аудіювання" className="task-icon" />
            <h1>Аудіювання</h1>
            </div>
        <div className="progress-bar">
            <div
                className="progress"
                style={{
                width: `${((currentIndex + 1) / tasks.length) * 100}%`,
                }}
            ></div>
        </div>

        <div className="stats">
        <span>
            Питання {currentIndex + 1} з {tasks.length}
        </span>
        <span>Бали: {score}</span>
        </div>

        <p className="question-text">
          Прослухай слово та обери правильний переклад.
        </p>

        <div className="answer-options">
          {options.map((option, index) => (
            <button
              key={index}
              className={`answer-btn 
                ${isAnswered && option === currentTask.correct_answer ? "correct" : ""}
                ${selectedAnswer === option && !isCorrect ? "incorrect" : ""}
              `}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="action-buttons">

            <button
                className="next-btn"
                onClick={speakWord}
            >
                🔊 Прослухати
            </button>

            {isAnswered && (
                <button
                    className="next-btn"
                    onClick={handleNext}
                >
                    Наступне →
                </button>
            )}

        </div>
      </div>
    </div>
  );
};

export default ListeningExercise;