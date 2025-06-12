import React from "react";
import "./Home.css";
import Footer from "../components/Footer.js";
import Header from "../components/Header.js";
import { useNavigate } from "react-router-dom";
import HomePicture from "../assets/HomePicture.png";
import WhyPicture1 from "../assets/WhyPicture1.png";
import WhyPicture2 from "../assets/WhyPicture2.png";
import WhyPicture3 from "../assets/WhyPicture3.png";

import NewWords1 from "../assets/newWords1.png";
import NewWords2 from "../assets/newWords2.png";
import NewWords3 from "../assets/newWords3.png";

const Home = () => {
  const navigate = useNavigate();

  const startTest = () => {
    navigate("/testLevel");
  };
  const goToLanguageBuddy = () => {
    navigate("/languageBuddy");
  };
  return (
    <div className="home-wrapper">
      <Header />

      <section className="header-container">
        <div>
          <img src={HomePicture} alt="Study" />
        </div>
        <div className="study-text-home">
          <h1>Почни вивчати іноземні слова з нуля: весело та ефективно!</h1>
          <p>Індивідуальний план, трекінг прогресу, нові слова щодня.</p>
          <button onClick={goToLanguageBuddy}>Спробувати безкоштовно</button>
        </div>
      </section>

      <section className="header-container-why">
        <h2>Чому саме LexiLearn?</h2>
        <div className="cards-home">
          <div className="card-home">
            <img src={WhyPicture1} alt="" />
            <p>Персоналізоване навчання</p>
          </div>
          <div className="card-home">
            <img src={WhyPicture2} alt="" />
            <p>Розумний підбір слів</p>
          </div>
          <div className="card-home">
            <img src={WhyPicture3} alt="" />
            <p>Візуальний прогрес</p>
          </div>
        </div>
      </section>

      <section className="recommended-exercises-home">
        <h2>Рекомендовані вправи</h2>
        <div className="exercise-cards-home">
          <div className="exercise-card-home">
            <h3>Вивчення нових слів</h3>

            <div className="mini-exercises-home">
              <div className="mini-exercise-home">
                <img src={NewWords1} alt="" />
                <p>Інтерактивні картки + приклади вживання</p>
              </div>
              <div className="mini-exercise-home">
                <img src={NewWords2} alt="" />
                <p>Час: 10 хвилин</p>
              </div>
              <div className="mini-exercise-home">
                <img src={NewWords3} alt="" />
                <p>Ціль: Додати нові слова до активного словникового запасу</p>
              </div>
            </div>

            <button>Розпочати</button>
          </div>

          <div className="exercise-card-home">
            <h3>Міні-тест</h3>

            <div className="mini-exercises-home">
              <div className="mini-exercise-home">
                <img src={NewWords1} alt="" />
                <p>10 питань</p>
              </div>
              <div className="mini-exercise-home">
                <img src={NewWords2} alt="" />
                <p>7 хвилин</p>
              </div>
              <div className="mini-exercise-home">
                <img src={NewWords3} alt="" />
                <p>Ціль: Перевірити знання на практиці</p>
              </div>
            </div>

            <button onClick={startTest}>Розпочати</button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
