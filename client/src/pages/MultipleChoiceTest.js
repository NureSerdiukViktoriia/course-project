import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExercisePage.css";
import iconChoice from "../assets/communication.png";
import iconProfile from "../assets/userr.png";

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

const MultipleChoiceTest = () => {
  const navigate = useNavigate();
  const handleProfileNavigation = () => navigate("/profile");

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Доступ заборонено. Будь ласка, увійдіть в систему.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/exercises/multiple-choice",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Не вдалося завантажити питання.");
        }
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error("Для вашого рівня ще немає питань цього типу.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return;
    const currentQuestion = questions[currentIndex];
    setSelectedAnswer(option);
    if (option === currentQuestion.correct_answer) {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      alert(`Тест завершен! Ваш результат: ${score} балів`);
      navigate("/words");
    }
  };
  const handleAddToDictionary = async (word, translation) => {
    const token = localStorage.getItem("token");
    if (!word) {
      alert("Немає слова для додавання.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/dictionary/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ word, translation }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Не вдалося додати слово");
      }
      alert(`Слово "${word}" успішно додано!`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;
  if (questions.length === 0) return <div>Питань не знайдено.</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exercise-page">
      <AppHeader onProfileClick={handleProfileNavigation} />
      <div className="exercise-content">
        <div className="task-header">
          <img src={iconChoice} alt="Вибір відповіді" className="task-icon" />
          <h1>Вибір правильної відповіді</h1>
        </div>

        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="stats">
          <span>
            Питання {currentIndex + 1} з {questions.length}
          </span>
          <span>Бали: {score}</span>
        </div>
        <h2 className="question-text">{currentQuestion.question_text}</h2>

        {selectedAnswer && (
          <div className="add-to-dictionary-container">
            <button
              className="add-to-dict-btn"
              onClick={() =>
                handleAddToDictionary(
                  currentQuestion.word_to_learn,
                  currentQuestion.translation
                )
              }
            >
              <i className="fas fa-plus-circle"></i>
              Додати "{currentQuestion.word_to_learn}" до словника
            </button>
          </div>
        )}

        <div className="answer-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`answer-btn 
                                ${
                                  selectedAnswer &&
                                  option === currentQuestion.correct_answer
                                    ? "correct"
                                    : ""
                                }
                                ${
                                  selectedAnswer === option && !isCorrect
                                    ? "incorrect"
                                    : ""
                                }
                            `}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button
            className="next-btn"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            Наступне
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceTest;
