import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExercisePage.css';
import iconProfile from '../assets/userr.png';
import iconFlashcards from '../assets/flashcards.png';
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

const FlashCards = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');

    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
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

        const fetchCards = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Доступ заборонено.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/exercises/flashcards', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Не вдалося завантажити флеш-картки.');
                }

                const data = await response.json();

                if (data.tasks && data.tasks.length > 0) {
                    setCards(data.tasks);
                } else {
                    throw new Error('Флеш-карток поки немає.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const addXp = async (xpAmount) => {
        const token = localStorage.getItem("token");

        await fetch("http://localhost:3001/user/add-xp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                xp: xpAmount,
            }),
        });
    };

    const completeExerciseType = async () => {
        const token = localStorage.getItem("token");

        await fetch("http://localhost:3001/user/complete-exercise-type", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                exerciseType: "flashcards",
            }),
        });
    };

    const handleKnow = async () => {
        setScore(prev => prev + 10);

        const token = localStorage.getItem("token");

        await fetch("http://localhost:3001/user/flashcard-correct", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        handleNextCard();
    };

    const handleDontKnow = () => {
        handleNextCard();
    };

    const handleNextCard = async () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            const finalScore = score + 10;

            await addXp(finalScore);
            await completeExerciseType();

            setNotification({
                message: `Вправа завершена! Ваш результат: ${finalScore} балів`,
                type: 'info',
                onConfirm: () => navigate('/words'),
            });
        }
    };

    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;

    const currentCard = cards[currentIndex];

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
                    <img src={iconFlashcards} alt="Флеш-картки" className="task-icon" />
                    <h1>Флеш-картки</h1>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                    ></div>
                </div>

                <div className="stats">
                    <span>Картка {currentIndex + 1} з {cards.length}</span>
                    <span>Бали: {score}</span>
                </div>

            <div className="flip-card-wrapper">
                <div
                    className={`flip-card ${isFlipped ? "flipped" : ""}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <div className="card-side-label">Українська</div>

                            <h2>{currentCard.question_text}</h2>

                            <p>Натисни, щоб побачити переклад</p>
                        </div>

                        <div className="flip-card-back">
                            <div className="card-side-label">English</div>

                            <h2>{currentCard.correct_answer}</h2>

                            <button
                                className="card-sound-btn"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    window.speechSynthesis.cancel();

                                    const utterance = new SpeechSynthesisUtterance(
                                        currentCard.correct_answer
                                    );

                                    utterance.lang = "en-US";
                                    utterance.rate = 0.9;

                                    window.speechSynthesis.speak(utterance);
                                }}
                            >
                                🔊 Прослухати
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                <div className="action-buttons">
                    <button className="flashcard-dont-btn" onClick={handleDontKnow}>
                        Не знав
                    </button>

                    <button className="flashcard-know-btn" onClick={handleKnow}>
                        Знав
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlashCards;