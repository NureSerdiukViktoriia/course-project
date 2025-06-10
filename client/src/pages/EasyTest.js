import React, { useState } from "react";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import "./EasyTest.css";
const easyTestData = [
  {
    question: 'Оберіть правильний варіант перекладу слова: "apple"',
    options: ["апельсин", "яблуко", "груша", "лимон"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "cat"',
    options: ["собака", "кіт", "птах", "риба"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "water"',
    options: ["молоко", "сік", "вода", "чай"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "book"',
    options: ["ручка", "зошит", "книга", "олівець"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "hello"',
    options: ["до побачення", "добрий день", "дякую", "будь ласка"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "house"',
    options: ["школа", "будинок", "магазин", "лікарня"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "sun"',
    options: ["місяць", "зірка", "сонце", "хмара"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "table"',
    options: ["стілець", "стіл", "ліжко", "шафа"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "goodbye"',
    options: ["привіт", "до побачення", "вибачте", "так"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант перекладу слова: "friend"',
    options: ["ворог", "сусід", "друг", "колега"],
    correctAnswerIndex: 2,
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
            Тест початкового рівня <br />
           <p className="easy-test-question"> Питання {currentQuestion + 1} з {easyTestData.length}</p>
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