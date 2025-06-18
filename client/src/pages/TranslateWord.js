import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExercisePage.css'; 
import iconProfile from '../assets/userr.png'; 
import iconTranslate from '../assets/www.png';
import Notification from '../components/Notification';

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

const TranslateWord = () => {
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

    const [notification, setNotification] = useState({
        message: "",
        type: "",
        onConfirm: null,
    });

    const hideNotification = () => {
        if (notification.onConfirm) {
            notification.onConfirm();
        }
        setNotification({ message: "", type: "", onConfirm: null });
    };

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
                const response = await fetch('http://localhost:3001/api/exercises/translate-word', {
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
        if (inputValue.trim().toLowerCase() === currentTask.correct_answer.toLowerCase()) {
            setIsCorrect(true);
            setScore(prev => prev + 10);
        } else {
            setIsCorrect(false);
        }
        setIsChecked(true);
    };

    const handleNextTask = () => {
        if (currentIndex < tasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setInputValue(''); setIsChecked(false); setIsCorrect(null);
        } else {
            setNotification({
                message: `Вправа завершена! Ваш результат: ${score} балів`,
                type: 'info',
                onConfirm: () => navigate('/words'),
            });
        }
    };

    const handleAddToDictionary = async (word, translation) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3001/api/dictionary/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ word: word, translation: translation })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Не вдалося додати слово');
            setNotification({
                message: `Слово "${word}" успішно додано!`,
                type: 'success',
            });
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };
    
    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;

    const currentTask = tasks[currentIndex];
    if (!currentTask) return <div>Завдань не знайдено.</div>;

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
                    <img src={iconTranslate} alt="Переклад слів" className="task-icon" />
                    <h1>Переклад слів</h1>
                </div>

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${((currentIndex + 1) / tasks.length) * 100}%` }}></div>
                </div>
                <div className="stats">
                    <span>Слово {currentIndex + 1} з {tasks.length}</span>
                    <span>Бали: {score}</span>
                </div>

                {isChecked && (
                    <div className="add-to-dictionary-container">
                        <button 
                            className="add-to-dict-btn" 
                            onClick={() => handleAddToDictionary(currentTask.correct_answer, currentTask.question_text)}
                        >
                            <i className="fas fa-plus-circle"></i> 
                            Додати "{currentTask.correct_answer}" до словника
                        </button>
                    </div>
                )}

                <div className="word-translate-box">
                    <div className="word-to-translate">{currentTask.question_text}</div>
                    <input
                        type="text"
                        className={`input-field-inline ${isChecked ? (isCorrect ? 'correct-input' : 'incorrect-input') : ''}`}
                        placeholder="Введи англійський переклад..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isChecked}
                        autoFocus
                    />
                </div>

                <div className="action-buttons">
                    <button className="check-btn" onClick={handleCheckAnswer} disabled={!inputValue || isChecked}>Перевірити</button>
                    <button className="next-btn" onClick={handleNextTask} disabled={!isChecked}>Наступне</button>
                </div>
            </div>
        </div>
    );
};

export default TranslateWord;