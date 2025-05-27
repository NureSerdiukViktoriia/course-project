import React from "react";
import "./Home.css";

import HomePicture from "../assets/HomePicture.png";
import WhyPicture1 from "../assets/WhyPicture1.png";
import WhyPicture2 from "../assets/WhyPicture2.png";
import WhyPicture3 from "../assets/WhyPicture3.png";

import NewWords1 from "../assets/newWords1.png";
import NewWords2 from "../assets/newWords2.png";
import NewWords3 from "../assets/newWords3.png";

const Home = () => {
  return (
    <div className="home-wrapper">
      <header className="header">
        <nav>
          <div>
            <a href="#">Головна</a>
            <a href="#">Вивчення слів</a>
          </div>
          <div>
            <a href="#">Профіль</a>
            <a href="#">Чат-бот</a>
          </div>
        </nav>
      </header>

      <section className="header-container">
        <div>
          <img src={HomePicture} alt="Study" />
        </div>
        <div className="study-text">
          <h1>Почни вивчати іноземні слова з нуля: весело та ефективно!</h1>
          <p>Індивідуальний план, трекінг прогресу, нові слова щодня.</p>
          <button>Спробувати безкоштовно</button>
        </div>
      </section>

      <section className="header-container-why">
        <h2>Чому саме LexiLearn?</h2>
        <div className="cards">
          <div className="card">
            <img src={WhyPicture1} alt="" />
            <p>Персоналізоване навчання</p>
          </div>
          <div className="card">
            <img src={WhyPicture2} alt="" />
            <p>Розумний підбір слів</p>
          </div>
          <div className="card">
            <img src={WhyPicture3} alt="" />
            <p>Візуальний прогрес</p>
          </div>
        </div>
      </section>

      <section className="recommended-exercises">
        <h2>Рекомендовані вправи</h2>
        <div className="exercise-cards">
          <div className="exercise-card">
            <h3>Вивчення нових слів</h3>

            <div className="mini-exercises">
              <div className="mini-exercise">
                <img src={NewWords1} alt="" />
                <p>Інтерактивні картки + приклади вживання</p>
              </div>
              <div className="mini-exercise">
                <img src={NewWords2} alt="" />
                <p>Час: 10 хвилин</p>
              </div>
              <div className="mini-exercise">
                <img src={NewWords3} alt="" />
                <p>Ціль: Додати нові слова до активного словникового запасу</p>
              </div>
            </div>

            <button>Почати вправу</button>
          </div>

          <div className="exercise-card">
            <h3>Міні-тест</h3>

            <div className="mini-exercises">
              <div className="mini-exercise">
                <img src={NewWords1} alt="" />
                <p>10 питань</p>
              </div>
              <div className="mini-exercise">
                <img src={NewWords2} alt="" />
                <p>7 хвилин</p>
              </div>
              <div className="mini-exercise">
                <img src={NewWords3} alt="" />
                <p>Ціль: Перевірити знання на практиці</p>
              </div>
            </div>

            <button>Почати вправу</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
