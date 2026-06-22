import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer.js';
import './WordsPage.css';
import iconChoice from '../assets/communication.png';
import iconPuzzle from '../assets/puzzle.png';
import iconTranslate from '../assets/www.png'; 
import iconMatching from '../assets/matching.png';
import iconListening from '../assets/listening.png';
import iconFlashcards from '../assets/flashcards.png';
import AdminExerciseSettings from "./AdminExerciseSettings";

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
    const startExercise = (path) => navigate(path);
    const [isWheelOpen, setIsWheelOpen] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [rewardResult, setRewardResult] = useState(null);
    const [rewardResultType, setRewardResultType] = useState("");
    const [wheelRewards, setWheelRewards] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setIsAdmin(payload.role === "admin");
}
        fetch("http://localhost:3001/api/reward-wheel/rewards", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setWheelRewards(data))
            .catch((err) => console.error(err));
    }, []);

    const spinWheel = async () => {
        if (isSpinning || wheelRewards.length === 0) return;

        setIsSpinning(true);
        setRewardResult(null);
        setRewardResultType("");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3001/api/reward-wheel/spin", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setRewardResult(data.message);
                setRewardResultType("error");
                setIsSpinning(false);
                return;
            }

            const rewardValue = data.reward.reward_value;
            const rewardIndex = wheelRewards.findIndex(
                (reward) => reward.reward_value === rewardValue
            );

            const sectorSize = 360 / wheelRewards.length;
            const sectorCenter = rewardIndex * sectorSize + sectorSize / 2;
            const targetRotation = 360 - sectorCenter;

            setRotation((prev) => {
                const currentRotation = prev % 360;
                const correction =
                    (targetRotation - currentRotation + 360) % 360;

                return prev + 1440 + correction;
            });

            setTimeout(() => {
                setRewardResult(`Ви виграли ${rewardValue} XP!`);
                setRewardResultType("success");
                setIsSpinning(false);
            }, 4000);
        } catch (error) {
            setRewardResult("Помилка при обертанні колеса.");
            setRewardResultType("error");
            setIsSpinning(false);
        }
    };
    return (
        <div className="words-home-page">
            <Header />
            <div className="words-home-content">
                <h1 className="main-title">Вивчення Нових Слів</h1>
                {isAdmin && (
                    <button
                        className="exercise-admin-btn"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        Налаштування вправ
                    </button>
                )}
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

            <button
                className="reward-floating-btn"
                onClick={() => setIsWheelOpen(true)}
            >
                🎁
            </button>

            {isWheelOpen && (
                <div className="reward-modal-overlay">
                    <div className="reward-modal">
                        <button
                            className="reward-close-btn"
                            onClick={() => setIsWheelOpen(false)}
                        >
                            ×
                        </button>

                        <h2>Щоденна нагорода</h2>
                        <p>Крути колесо один раз на день та отримуй XP.</p>
                        
                        <div className="reward-wheel-wrapper">
                            <div className="reward-pointer"></div>

                            <div
                                className="reward-wheel"
                                style={{
                                    transform: `rotate(${rotation}deg)`
                                }}
                            >
                                {wheelRewards.map((reward, index) => {
                                    const angle =
                                        (360 / wheelRewards.length) * index +
                                        360 / wheelRewards.length / 2;

                                    return (
                                        <span
                                            key={reward.id}
                                            className="wheel-label"
                                            style={{
                                                transform: `rotate(${angle}deg) translateY(-75px) rotate(90deg)`,
                                            }}
                                        >
                                            {reward.reward_value} XP
                                        </span>
                                    );
                                })}
                            </div>
                    </div>
                        <button
                            className="reward-spin-btn"
                            onClick={spinWheel}
                            disabled={isSpinning}
                        >
                            {isSpinning ? "Крутиться..." : "Крутити"}
                        </button>
                                            
                        {rewardResult && (
                            <div className={`reward-result ${rewardResultType}`}>
                                {rewardResult}
                            </div>
                        )}

                    </div>
                </div>
            )}
            <AdminExerciseSettings
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <Footer />
        </div>
    );
};

export default WordsPage;