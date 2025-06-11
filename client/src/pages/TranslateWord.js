import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExercisePage.css'; 
import iconProfile from '../assets/userr.png'; 
import iconTranslate from '../assets/www.png'; 

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

const wordPairs = [
    {
        id: 1,
        ukrainian: "Стілець",
        english: "Chair"
    },
    {
        id: 2,
        ukrainian: "Стіл",
        english: "Table"
    },
    {
        id: 3,
        ukrainian: "Кіт",
        english: "Cat"
    },
];

const totalTasks = 10;

const TranslateWord = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    const currentWord = wordPairs[currentIndex];

    const handleCheckAnswer = () => {
        if (inputValue.trim().toLowerCase() === currentWord.english.toLowerCase()) {
            setIsCorrect(true);
            setScore(prev => prev + 10);
        } else {
            setIsCorrect(false);
        }
        setIsChecked(true);
    };

    const handleNextTask = () => {
        if (currentIndex < wordPairs.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setInputValue('');
            setIsChecked(false);
            setIsCorrect(null);
        } else {
            alert(`Вправа завершена! Ваш результат: ${score} балів`);
        }
    };

    return (
        <div className="exercise-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <div className="exercise-content">
                <div className="task-header">
                    <img src={iconTranslate} alt="Переклад слів" className="task-icon" />
                    <h1>Переклад слів</h1>
                </div>

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${((currentIndex + 1) / totalTasks) * 100}%` }}></div>
                </div>
                <div className="stats">
                    <span>Слово {currentIndex + 1} з {totalTasks}</span>
                    <span>Бали: {score}</span>
                </div>

                <div className="word-translate-box">
                    <div className="word-to-translate">{currentWord.ukrainian}</div>
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

export default TranslateWord;
