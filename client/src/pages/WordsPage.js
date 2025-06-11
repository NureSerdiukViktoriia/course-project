import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Footer from '../components/Footer.js';
import './WordsPage.css';
import iconChoice from '../assets/communication.png';
import iconPuzzle from '../assets/puzzle.png';
import iconTranslate from '../assets/www.png';
import iconProfile from '../assets/userr.png'; 

const AppHeader = ({ onProfileClick }) => (
    <header className="app-header-words">
        <div className="header-nav-words">
            <Link to="/home" className="nav-link-words">
                <i className="fas fa-arrow-left"></i>
                <span>Головна</span>
            </Link>
            <Link to="/languageBuddy" className="nav-link-words">
                    Language Buddy
            </Link>
        </div>
        <div className="header-profile" onClick={onProfileClick}>
                    <img src={iconProfile} alt="Profile" />
        </div>
    </header>
);

const exercises = [
    { icon: iconChoice, title: "Вибір відповіді", description: "10 питань з варіантами — тренуй словниковий запас", path: "/exercise/multiple-choice" },
    { icon: iconPuzzle, title: "Побудова речень", description: "Склади правильне англійське речення зі слів", path: "/exercise/sentence-builder" },
    { icon: iconTranslate, title: "Переклад слів", description: "Перекладай українські слова на англійську", path: "/exercise/translate-word" }
];

const WordsPage = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');
    const startExercise = (path) => navigate(path);

    return (
        <div className="words-home-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <div className="words-home-content">
                <h1 className="main-title">Вивчення Нових Слів</h1>
                <p className="subtitle">
                    Обери тип вправи, проходь тести та збирай бали! Кожне завдання — це крок до вільного мовлення.
                </p>
                <div className="exercise-cards-container">
                    {exercises.map((exercise) => (
                        <div key={exercise.title} className="exercise-card">
                            <div className="card-header">
                                <img src={exercise.icon} alt={exercise.title} className="card-icon" />
                                <h2>{exercise.title}</h2>
                            </div>
                            <p>{exercise.description}</p>
                            <button onClick={() => startExercise(exercise.path)}>
                                Почати <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WordsPage;