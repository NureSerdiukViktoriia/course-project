import React from "react";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import { useNavigate } from "react-router-dom";
import TimeIcon from "../assets/newWords1.png";
import QuestionIcon from "../assets/newWords2.png";
import Puzzle from "../assets/puzzle.png";
import "./TestLevel.css";

const TestPage = () => {
  const navigate = useNavigate();

  const easytest = () => {
    navigate("/easyTest");
  };
   const intermediatetest = () => {
    navigate("/intermediateTest");
  };
     const advancedtest = () => {
    navigate("/advancedTest");
  };
  return (
    <div className="test-level-wrapper">
      <Header />

      <h2>Міні-тест</h2>

      <p className="mini-test-p">
        Пройди міні-тест і закріпи нові слова та граматику!
      </p>

      <div className="test-info">
        <div className="test-detail">
          <img src={TimeIcon} alt="time" />
          <span>7 хвилин</span>
        </div>
        <div className="test-detail">
          <img src={QuestionIcon} alt="questions" />
          <span>10 питань</span>
        </div>
      </div>
      <div className="difficulty-header">
        <img src={Puzzle} alt="puzzle" />
        <h3 className="difficulty-title">Оберіть рівень складності</h3>
      </div>

      <div className="difficulty-options">
        <div className="difficulty-card">
          <h4>Початковий (A1–A2)</h4>
          <p>Базова лексика, прості речення, переклади слів</p>
          <button onClick={easytest}>Почати</button>
        </div>
        <div className="difficulty-card">
          <h4>Середній (B1–B2)</h4>
          <p>Ситуаційні діалоги, словосполучення, базова граматика</p>
          <button onClick={intermediatetest}>Почати</button>
          
        </div>
        <div className="difficulty-card">
          <h4>Просунутий (C1–C2)</h4>
          <p>Складні граматичні структури, синоніми/антоніми</p>
          <button onClick={advancedtest}>Почати</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TestPage;
