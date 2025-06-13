import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import tick from "../assets/tick.png";
import cross from "../assets/cross.png";
import audio from "../assets/audio.png";
import "./Dictionary.css";

const Dictionary = () => {
  const [words, setWords] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ви не авторизовані");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3001/api/dictionary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні словника");
        return res.json();
      })
      .then((data) => {
        setWords(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Помилка при завантаженні");
        setLoading(false);
      });
  }, []);

  const handleChange = (id, value) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
    setResults((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleCheck = (id) => {
    const correctAnswer = words
      .find((w) => w.id === id)
      ?.translation?.toLowerCase()
      .trim();
    const userAnswer = (userAnswers[id] || "").toLowerCase().trim();

    setResults((prev) => ({
      ...prev,
      [id]: userAnswer === correctAnswer && userAnswer !== "",
    }));
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Ваш браузер не підтримує озвучку");
    }
  };

  if (loading) return <p>Завантаження...</p>;

  if (error) return <p className="error">Помилка: {error}</p>;

  return (
    <div className="dictionary-wrapper">
      <Header />
      <div className="dictionary-content">
        <h2 className="dictionary-title">Словник</h2>

        {words.length === 0 ? (
          <p>Слів у словнику ще немає</p>
        ) : (
          <div className="dictionary-list">
            {words.map((entry) => (
              <div key={entry.id} className="dictionary-item">
                <div
                  className="dictionary-item-row"
                  style={{ alignItems: "center" }}
                >
                  <strong className="dictionary-word">{entry.word}</strong>
                  <button
                    onClick={() => speak(entry.word)}
                    className="audio-button"
                    aria-label={`Озвучити слово ${entry.word}`}
                    title="Озвучити слово"
                  >
                    <img src={audio} alt="Audio icon" className="audio-icon" />
                  </button>
                  <input
                    className="dictionary-input"
                    type="text"
                    placeholder="Ваш переклад"
                    value={userAnswers[entry.id] || ""}
                    onChange={(e) => handleChange(entry.id, e.target.value)}
                  />
                </div>
                <button
                  className="dictionary-button"
                  onClick={() => handleCheck(entry.id)}
                >
                  Перевірити
                </button>
                {(results[entry.id] === true ||
                  results[entry.id] === false) && (
                  <p className="dictionary-answer">
                    {results[entry.id] ? (
                      <>
                        <img
                          src={tick}
                          alt="Вірно"
                          className="dictionary-icon"
                        />
                        Правильно!
                      </>
                    ) : (
                      <>
                        <img
                          src={cross}
                          alt="Невірно"
                          className="dictionary-icon"
                        />
                        Неправильно. Правильний переклад:{" "}
                        <strong>{entry.translation || "немає"}</strong>
                      </>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dictionary;
