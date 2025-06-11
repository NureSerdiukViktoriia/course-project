import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExercisePage.css'; 
import iconProfile from '../assets/userr.png'; 
import iconChoice from '../assets/communication.png'; 

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

const questions = [
    {
        id: 1,
        question: "Як перекласти слово «яблуко»?",
        options: ["Apple", "Pear", "Orange", "Banana"],
        correctAnswer: "Apple"
    },
    {
        id: 2,
        question: "Що означає слово «house»?",
        options: ["Машина", "Дім", "Кіт", "Стіл"],
        correctAnswer: "Дім"
    },
];

const totalQuestions = 10;

const MultipleChoiceTest = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (option) => {
        if (selectedAnswer) return; 

        setSelectedAnswer(option);
        if (option === currentQuestion.correctAnswer) {
            setIsCorrect(true);
            setScore(prev => prev + 10); 
        } else {
            setIsCorrect(false);
        }
    };
    
    const handleNextQuestion = () => {
        if(currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            alert(`Тест завершен! Ваш результат: ${score} балів`);
        }
    };
    
    return (
        <div className="exercise-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <div className="exercise-content">
                <div className="task-header">
                    <img src={iconChoice} alt="Вибір відповіді" className="task-icon" />
                    <h1>Вибір правильної відповіді</h1>
                </div>
                
                <div className="progress-bar">
                    <div className="progress" style={{width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`}}></div>
                </div>
                <div className="stats">
                    <span>Питання {currentQuestionIndex + 1} з {totalQuestions}</span>
                    <span>Бали: {score}</span>
                </div>

                <h2 className="question-text">{currentQuestion.question}</h2>

                <div className="answer-options">
                    {currentQuestion.options.map((option, index) => (
                        <button 
                            key={index} 
                            className={`answer-btn 
                                ${selectedAnswer && option === currentQuestion.correctAnswer ? 'correct' : ''}
                                ${selectedAnswer === option && !isCorrect ? 'incorrect' : ''}
                            `}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={!!selectedAnswer}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                
                <div className="action-buttons">
                    <button className="next-btn" onClick={handleNextQuestion} disabled={!selectedAnswer}>
                        Наступне
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MultipleChoiceTest;