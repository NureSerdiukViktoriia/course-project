import React, { useEffect, useState } from "react";
import "./AdminExerciseSettings.css";
import Notification from "../components/Notification";

const AdminExerciseSettings = ({ open, onClose }) => {
  const [settings, setSettings] = useState([]);

  const [hasChanges, setHasChanges] = useState(false);

  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const exerciseNames = {
    "multiple-choice": "Вибір відповіді",
    "sentence-builder": "Побудова речень",
    "translate-word": "Переклад слів",
    listening: "Аудіювання",
    matching: "Зіставлення слів",
    flashcards: "Флеш-картки",
  };

  const loadSettings = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3001/api/exercise-settings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    setSettings(data);
  };

  const updateSetting = (id, field, value) => {
  setSettings((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: Number(value),
          }
        : item
      )
    );
  };

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const saveSettings = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      "http://localhost:3001/api/exercise-settings",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      }
    );

    setNotification({
        message: "Налаштування успішно збережено",
        type: "success",
    });

    setHasChanges(false);
  };

  const hideNotification = () => {
    setNotification({
        message: "",
        type: "",
    });
  };

  if (!open) return null;

  return (
    <div className="exercise-settings-overlay">
      <div className="exercise-settings-modal">
        <Notification
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        />
        <h2>Налаштування вправ</h2>
        <p className="exercise-settings-subtitle">
            Налаштування XP та кількості завдань для кожного типу вправ.
        </p>
        {settings.map((item, index) => (
          <div className="exercise-settings-row" key={item.id}>
            <div className="exercise-name">
            {exerciseNames[item.exercise_type]}
            </div>

            <div className="setting-field">
            <label>XP</label>

            <input
                type="number"
                value={item.xp_amount}
                onChange={(e) => {
                updateSetting(item.id, "xp_amount", e.target.value);
                setHasChanges(true);
                }}
            />
            </div>

            <div className="setting-field">
            <label>Питань</label>

            <input
                type="number"
                value={item.question_limit}
                onChange={(e) => {
                updateSetting(item.id, "question_limit", e.target.value);
                setHasChanges(true);
                }}
            />
            </div>
          </div>
        ))}

        {hasChanges && (
        <button
            className="exercise-save-btn"
            onClick={saveSettings}
        >
            Зберегти
        </button>
        )}

        <button
          className="exercise-close-btn"
          onClick={onClose}
        >
          Закрити
        </button>
      </div>
    </div>
  );
};

export default AdminExerciseSettings;