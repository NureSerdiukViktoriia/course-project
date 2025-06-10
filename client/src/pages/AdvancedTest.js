import React, { useState } from "react";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import "./EasyTest.css";
const advancedTestData = [
  {
    question: 'Оберіть найбільш підходящий варіант для завершення речення: "Had I known about the traffic jam, I ____ a different route."',
    options: ["would take", "had taken", "would have taken", "took"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть синонім до слова "ubiquitous":',
    options: ["rare", "scarce", "pervasive", "limited"],
    correctAnswerIndex: 2,
  },
  {
    question: 'Оберіть антонім до слова "benevolent":',
    options: ["kind", "generous", "malevolent", "compassionate"],
    correctAnswerIndex: 0,
  },
  {
    question: 'Оберіть правильний варіант, що демонструє інверсію: "____ did he realize the gravity of the situation."',
    options: ["Only then", "Then only", "He only then", "Only then he"],
    correctAnswerIndex: 0,
  },
  {
    question: 'Оберіть речення, яке найкраще передає значення: "He has a bone to pick with you."',
    options: ["He wants to share a meal with you.", "He needs your help with a problem.", "He has a grievance to discuss with you.", "He is fond of you."],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть правильний варіант: "Despite ____ hard, he failed the exam."',
    options: ["he studied", "of studying", "having studied", "to study"],
    correctAnswerIndex: 3,
  },
  {
    question: 'Оберіть слово, яке найкраще замінить виділене: "The **insidious** nature of the disease made it difficult to detect early."',
    options: ["harmless", "beneficial", "treacherous", "obvious"],
    correctAnswerIndex: 3,
  },
  {
    question: 'Оберіть правильний варіант: "Scarcely ____ the door when the phone rang."',
    options: ["he had opened", "had he opened", "he opened", "did he open"],
    correctAnswerIndex: 1,
  },
  {
    question: 'Оберіть найбільш формальний синонім до "to look into":',
    options: ["check out", "investigate", "examine", "scrutinize"],
    correctAnswerIndex: 0,
  },
  {
    question: 'Оберіть речення, яке містить помилку в уживанні умовного способу:',
    options: ["If I were a bird, I would fly.", "If he had come, we would have gone.", "If she would have known, she would tell us.", "If it rains, we will stay inside."],
    correctAnswerIndex: 2,
  },
];
const AdvancedTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === advancedTestData[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < advancedTestData.length) {
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
            Тест просунутого рівня <br />
           <p className="easy-test-question"> Питання {currentQuestion + 1} з {advancedTestData.length}</p>
          </h2>
          <p className="question-text">{advancedTestData[currentQuestion].question}</p>
          <div className="options-container">
            {advancedTestData[currentQuestion].options.map((option, idx) => (
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
            Ваш результат: {score} з {advancedTestData.length}
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

export default AdvancedTest;