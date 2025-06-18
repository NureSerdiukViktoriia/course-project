import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExercisePage.css'; 
import iconProfile from '../assets/userr.png'; 
import iconPuzzle from '../assets/puzzle.png'; 

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

    const SentenceBuilder = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        document.body.style.backgroundColor = "#f0b8b8";
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Доступ заборонено.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:3001/api/exercises/sentence-builder', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Не вдалося завантажити завдання.');
                const data = await response.json();
                if (data.tasks && data.tasks.length > 0) {
                    setTasks(data.tasks);
                } else {
                    throw new Error('Для вашого рівня ще немає завдань цього типу.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
                  return () => {
      document.body.style.backgroundColor = '';
       };
    }, []);

    const handleCheckAnswer = () => {
        const currentTask = tasks[currentIndex];
        const formattedInput = inputValue.trim().replace(/[.?]$/, "");
        const formattedAnswer = currentTask.correct_answer.trim().replace(/[.?]$/, "");

        if (formattedInput.toLowerCase() === formattedAnswer.toLowerCase()) {
            setIsCorrect(true);
            setScore(prev => prev + 15);
        } else {
            setIsCorrect(false);
        }
        setIsChecked(true);
    };

    const handleNextTask = () => {
        if (currentIndex < tasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setInputValue('');
            setIsChecked(false);
            setIsCorrect(null);
        } else {
            alert(`Вправа завершена! Ваш результат: ${score} балів`);
            navigate('/words');
        }
    };
    
    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;

    const currentTask = tasks[currentIndex];

    return (
        <div className="exercise-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <div className="exercise-content">
                <div className="task-header">
                    <img src={iconPuzzle} alt="Побудуй речення" className="task-icon" />
                    <h1>Побудуй речення</h1>
                </div>

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${((currentIndex + 1) / tasks.length) * 100}%` }}></div>
                </div>
                <div className="stats">
                    <span>Речення {currentIndex + 1} з {tasks.length}</span>
                    <span>Бали: {score}</span>
                </div>

                <div className="word-display-box">
                    {currentTask.question_text}
                </div>

                <input
                    type="text"
                    className={`input-field ${isChecked ? (isCorrect ? 'correct-input' : 'incorrect-input') : ''}`}
                    placeholder="Введи речення..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isChecked}
                />

                <div className="action-buttons">
                    <button className="check-btn" onClick={handleCheckAnswer} disabled={!inputValue || isChecked}>
                        Перевірити
                    </button>
                    <button className="next-btn" onClick={handleNextTask} disabled={!isChecked}>
                        Наступне
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SentenceBuilder;