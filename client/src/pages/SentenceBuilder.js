import React, { useState } from 'react';
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

const tasks = [
    {
        id: 1,
        scrambled: "I / to / school / go",
        correctAnswer: "I go to school."
    },
    {
        id: 2,
        scrambled: "is / name / what / your / ?",
        correctAnswer: "What is your name?"
    },
];

const totalTasks = 10;

const SentenceBuilder = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    const currentTask = tasks[currentIndex];

    const handleCheckAnswer = () => {
        const formattedInput = inputValue.trim().replace(/\.$/, "") + "."; 
        
        if (formattedInput.toLowerCase() === currentTask.correctAnswer.toLowerCase()) {
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
        }
    };

    return (
        <div className="exercise-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <div className="exercise-content">
                <div className="task-header">
                    <img src={iconPuzzle} alt="Побудуй речення" className="task-icon" />
                    <h1>Побудуй речення</h1>
                </div>

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${((currentIndex + 1) / totalTasks) * 100}%` }}></div>
                </div>
                <div className="stats">
                    <span>Речення {currentIndex + 1} з {totalTasks}</span>
                    <span>Бали: {score}</span>
                </div>

                <div className="word-display-box">
                    {currentTask.scrambled}
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