import React, { useState } from "react";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import "./EasyTest.css";
const intermediateTestData = [
  {
    question: 'Оберіть правильний варіант, щоб заповнити пропуск: "I ____ to the store yesterday."',
    options: ["go", "goes", "went", "going"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть найбільш підходящу відповідь на запитання: "How was your weekend?"',
    options: ["It is good.", "It was good.", "It will be good.", "It good."],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильну форму дієслова: "She ____ (read) a book right now."',
    options: ["reads", "is reading", "read", "has read"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть найбільш підходящий переклад речення: "Could you please pass me the salt?"',
    options: ["Можеш передати мені сіль?", "Чи могли б ви передати мені сіль?", "Передайте мені сіль.", "Передай мені сіль, будь ласка."],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний прийменник: "The cat is ____ the table."',
    options: ["in", "on", "under", "at"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть синонім до слова "happy":',
    options: ["sad", "angry", "joyful", "tired"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть правильний варіант: "He ____ (study) English for five years."',
    options: ["studies", "studied", "has studied", "is studying"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Завершіть діалог: "I\'m really hungry." "____"',
    options: ["Me too.", "So I am.", "I am also.", "I am too much."],
    correctAnswerIndex: 0,
  },
  {
    question: 'Оберіть правильний варіант: "If I ____ (have) more time, I would travel more."',
    options: ["have", "had", "will have", "would have"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть найбільш підходящу відповідь: "What do you do for a living?"',
    options: ["I live in a city.", "I am a student.", "I like to read books.", "I am fine, thank you."],
    correctAnswerIndex: 1,
  },
];
const IntermediateTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === intermediateTestData[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < intermediateTestData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="test-level-wrapper">
      <Header />
      {!showResult ? (
        <>
          <h2>
            Тест середнього рівня <br />
           <p className="easy-test-question"> Питання {currentQuestion + 1} з {intermediateTestData.length}</p>
          </h2>
          <p className="question-text">{intermediateTestData[currentQuestion].question}</p>
          <div className="options-container">
            {intermediateTestData[currentQuestion].options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)}>
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="result-container">
          <h2>Тест завершено!</h2>
          <p>
            Ваш результат: {score} з {intermediateTestData.length}
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
            }}
          >
            Пройти знову
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IntermediateTest;