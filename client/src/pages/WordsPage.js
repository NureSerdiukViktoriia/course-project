import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Header from "../components/Header";
import Footer from '../components/Footer.js';
import './WordsPage.css';
import iconChoice from '../assets/communication.png';
import iconPuzzle from '../assets/puzzle.png';
import iconTranslate from '../assets/www.png';
import iconProfile from '../assets/userr.png'; 
import iconMatching from '../assets/matching.png';
import iconListening from '../assets/listening.png';
import iconFlashcards from '../assets/flashcards.png';

const exercises = [
    { 
        icon: iconChoice, 
        title: "Вибір відповіді", 
        description: "10 питань з варіантами — тренуй словниковий запас", 
        path: "/exercise/multiple-choice" 
    },
    { 
        icon: iconPuzzle, 
        title: "Побудова речень", 
        description: "Склади правильне англійське речення зі слів", 
        path: "/exercise/sentence-builder" 
    },
    { 
        icon: iconTranslate, 
        title: "Переклад слів", 
        description: "Перекладай українські слова на англійську", 
        path: "/exercise/translate-word" 
    },
    { 
        icon: iconListening, 
        title: "Аудіювання", 
        description: "Прослухай слово або фразу та обери правильний переклад", 
        path: "/exercise/listening" 
    },
    { 
        icon: iconMatching, 
        title: "Зіставлення слів", 
        description: "Знайди правильні пари англійських слів та перекладів", 
        path: "/exercise/matching" 
    },
    {
    icon: iconFlashcards,
    title: "Флеш-картки",
    description: "Переглядай слова, запам’ятовуй переклад та перевіряй себе",
    path: "/exercise/flashcards"
    }
];

const WordsPage = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');
    const startExercise = (path) => navigate(path);

    return (
        <div className="words-home-page">
            <Header />
            <div className="words-home-content">
                <h1 className="main-title">Вивчення Нових Слів</h1>
                <p className="subtitle">
                    Обери тип вправи, проходь тести та збирай бали! Кожне завдання — це крок до вільного мовлення.
                </p>
                <div className="exercise-cards-container">

                    <div className="exercise-row">
                        {exercises.slice(0, 3).map((exercise) => (
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

                    <div className="exercise-row bottom-row">
                        {exercises.slice(3).map((exercise) => (
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
            </div>
            <Footer />
        </div>
    );
};

export default WordsPage;