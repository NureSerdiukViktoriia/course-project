import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExercisePage.css";
import iconProfile from "../assets/userr.png";
import iconMatching from "../assets/matching.png";

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

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const MatchingExercise = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongPair, setWrongPair] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        const response = await fetch("http://localhost:3001/api/exercises/matching", {
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
        setLeftWords(shuffleArray(data.tasks.map((task) => task.question_text)));
        setRightWords(shuffleArray(data.tasks.map((task) => task.correct_answer)));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const isMatched = (word, side) => {
    return matchedPairs.some((pair) =>
      side === "left" ? pair.left === word : pair.right === word
    );
  };

  const handleLeftClick = (word) => {
    if (isMatched(word, "left")) return;
    setSelectedLeft(word);
    setWrongPair(false);
  };

  const handleRightClick = (translation) => {
    if (!selectedLeft || isMatched(translation, "right")) return;

    const correctTask = tasks.find((task) => task.question_text === selectedLeft);

    if (correctTask.correct_answer === translation) {
      setMatchedPairs((prev) => [
        ...prev,
        { left: selectedLeft, right: translation },
      ]);
      setScore((prev) => prev + 10);
      setSelectedLeft(null);
      setWrongPair(false);
    } else {
      setWrongPair(true);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className="exercise-page">
      <AppHeader onProfileClick={handleProfileNavigation} />

      <div className="exercise-content">
        <div className="task-header">
          <img src={iconMatching} alt="Зіставлення слів" className="task-icon" />
          <h1>Зіставлення слів</h1>
        </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${(matchedPairs.length / tasks.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="stats">
        <span>
          Знайдено пар: {matchedPairs.length} з {tasks.length}
        </span>
        <span>Бали: {score}</span>
      </div>

        <p className="question-text">
          Натисни англійське слово, а потім його український переклад.
        </p>

        {wrongPair && (
          <p className="error">Неправильна пара. Спробуй ще раз.</p>
        )}

        <div className="matching-game">
          <div className="matching-column">
            {leftWords.map((word) => (
              <button
                key={word}
                className={`matching-card 
                  ${selectedLeft === word ? "selected" : ""}
                  ${isMatched(word, "left") ? "matched" : ""}
                `}
                onClick={() => handleLeftClick(word)}
              >
                {word}
              </button>
            ))}
          </div>

          <div className="matching-column">
            {rightWords.map((translation) => (
              <button
                key={translation}
                className={`matching-card 
                  ${isMatched(translation, "right") ? "matched" : ""}
                `}
                onClick={() => handleRightClick(translation)}
              >
                {translation}
              </button>
            ))}
          </div>
        </div>

      {matchedPairs.length === tasks.length && (
      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button className="next-btn" onClick={() => navigate("/words")}>
          Завершити
        </button>
      </div>
      )}
      </div>
    </div>
  );
};

export default MatchingExercise;