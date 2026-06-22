import React, { useState } from "react";
import "./AdminAIContent.css";

const emojiOptions = ["✈️", "🍽️", "💘", "🏥", "🛒", "🏨", "🚆", "💼", "📚", "💬"];

const AdminAIContent = ({
  open,
  onClose,
  topics,
  suggestions,
  refreshData,
}) => {
  const token = localStorage.getItem("token");

  const [topicForm, setTopicForm] = useState({
    id: null,
    name: "",
    icon: "💬",
  });

  const [suggestionForm, setSuggestionForm] = useState({
    id: null,
    text: "",
  });
 
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    type: "",
    id: null,
    message: "",
  });


  
  if (!open) return null;

  const resetTopicForm = () => {
    setTopicForm({
      id: null,
      name: "",
      icon: "💬",
    });
  };

  const resetSuggestionForm = () => {
    setSuggestionForm({
      id: null,
      text: "",
    });
  };

  const saveTopic = async () => {
    if (!topicForm.name.trim()) return;

    const url = topicForm.id
      ? `http://localhost:3001/api/ai-content/topics/${topicForm.id}`
      : "http://localhost:3001/api/ai-content/topics";

    const method = topicForm.id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: topicForm.name,
        icon: topicForm.icon,
      }),
    });

    resetTopicForm();
    refreshData();
  };

  const editTopic = (topic) => {
    setTopicForm({
      id: topic.id,
      name: topic.name,
      icon: topic.icon,
    });
  };

  const deleteTopic = (id) => {
    setDeleteConfirm({
        open: true,
        type: "topic",
        id,
        message: "Видалити цю тему?",
    });
  };

  const saveSuggestion = async () => {
    if (!suggestionForm.text.trim()) return;

    const url = suggestionForm.id
      ? `http://localhost:3001/api/ai-content/suggestions/${suggestionForm.id}`
      : "http://localhost:3001/api/ai-content/suggestions";

    const method = suggestionForm.id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: suggestionForm.text,
      }),
    });

    resetSuggestionForm();
    refreshData();
  };

  const editSuggestion = (suggestion) => {
    setSuggestionForm({
      id: suggestion.id,
      text: suggestion.text,
    });
  };

  const deleteSuggestion = (id) => {
    setDeleteConfirm({
        open: true,
        type: "suggestion",
        id,
        message: "Видалити цю підказку?",
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    const url =
        deleteConfirm.type === "topic"
        ? `http://localhost:3001/api/ai-content/topics/${deleteConfirm.id}`
        : `http://localhost:3001/api/ai-content/suggestions/${deleteConfirm.id}`;

    await fetch(url, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setDeleteConfirm({
        open: false,
        type: "",
        id: null,
        message: "",
    });

    refreshData();
  };

  return (
    <div className="ai-admin-overlay" onClick={onClose}>
      <div className="ai-admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Керування AI</h2>

        <section className="ai-admin-section">
          <h3>Теми</h3>

          <div className="ai-form-box">
            <input
              type="text"
              placeholder="Назва теми"
              value={topicForm.name}
              onChange={(e) =>
                setTopicForm({ ...topicForm, name: e.target.value })
              }
            />

            <div className="emoji-picker">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={topicForm.icon === emoji ? "selected" : ""}
                  onClick={() => setTopicForm({ ...topicForm, icon: emoji })}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button className="ai-save-btn" onClick={saveTopic}>
              {topicForm.id ? "Зберегти зміни" : "+ Додати тему"}
            </button>

            {topicForm.id && (
              <button className="ai-cancel-btn" onClick={resetTopicForm}>
                Скасувати редагування
              </button>
            )}
          </div>

          {topics.map((topic) => (
            <div className="ai-admin-item" key={topic.id}>
              <span>
                {topic.icon} {topic.name}
              </span>

              <div>
                <button onClick={() => editTopic(topic)}>Редагувати</button>
                <button onClick={() => deleteTopic(topic.id)}>Видалити</button>
              </div>
            </div>
          ))}
        </section>

        <section className="ai-admin-section">
          <h3>Швидкі підказки</h3>

          <div className="ai-form-box">
            <textarea
              placeholder="Текст швидкої підказки"
              value={suggestionForm.text}
              onChange={(e) =>
                setSuggestionForm({
                  ...suggestionForm,
                  text: e.target.value,
                })
              }
            />

            <button className="ai-save-btn" onClick={saveSuggestion}>
              {suggestionForm.id ? "Зберегти зміни" : "+ Додати підказку"}
            </button>

            {suggestionForm.id && (
              <button className="ai-cancel-btn" onClick={resetSuggestionForm}>
                Скасувати редагування
              </button>
            )}
          </div>

          {suggestions.map((suggestion) => (
            <div className="ai-admin-item" key={suggestion.id}>
              <span>{suggestion.text}</span>

              <div>
                <button onClick={() => editSuggestion(suggestion)}>
                  Редагувати
                </button>
                <button onClick={() => deleteSuggestion(suggestion.id)}>
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </section>

        <button className="ai-admin-close" onClick={onClose}>
          Закрити
        </button>
        {deleteConfirm.open && (
        <>
            <div className="ai-delete-backdrop"></div>

            <div className="ai-delete-box">
            <h3>Підтвердження</h3>
            <p>{deleteConfirm.message}</p>

            <div className="ai-delete-actions">
            <button className="ai-delete-confirm" onClick={confirmDelete}>
                Так, видалити
            </button>

            <button
                className="ai-delete-cancel"
                onClick={() =>
                setDeleteConfirm({
                    open: false,
                    type: "",
                    id: null,
                    message: "",
                })
                }
            >
                Скасувати
            </button>
            </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAIContent;