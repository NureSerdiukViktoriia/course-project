import React, { useState } from "react";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import "./EasyTest.css";
const easyTestData = [
  {
    question: 'Оберіть правильний варіант перекладу слова: "apple" – це…',
    options: ["апельсин", "яблуко", "груша", "лимон"],
    correctAnswerIndex: 1,
  },
];
const EasyTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === easyTestData[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < easyTestData.length) {
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
            Легкий тест <br />
            Питання {currentQuestion + 1} з {easyTestData.length}
          </h2>
          <p className="question-text">{easyTestData[currentQuestion].question}</p>
          <div className="options-container">
            {easyTestData[currentQuestion].options.map((option, idx) => (
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
            Ваш результат: {score} з {easyTestData.length}
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

export default EasyTest;