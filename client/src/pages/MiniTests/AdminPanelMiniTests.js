import React from "react";
import "./AdminPanelMiniTests.css";

const AdminPanelMiniTests = ({
  open,
  onClose,
  form,
  setForm,
  saveQuestion,
}) => {
  if (!open) return null;

  const options = ["option1", "option2", "option3", "option4"];

  return (
    <div className="mini-overlay" onClick={onClose}>
      <div className="mini-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Нове питання</h3>

        <input
          className="mini-input"
          placeholder="Питання"
          value={form.question}
          onChange={(e) =>
            setForm({ ...form, question: e.target.value })
          }
        />

        <div className="mini-options">
          {options.map((opt, i) => (
            <div className="mini-option" key={i}>
              <input
                className="mini-option-input"
                placeholder={`Варіант ${i + 1}`}
                value={form[opt]}
                onChange={(e) =>
                  setForm({ ...form, [opt]: e.target.value })
                }
              />

              <input
                type="radio"
                name="correct"
                checked={form.correctAnswerIndex === i}
                onChange={() =>
                  setForm({ ...form, correctAnswerIndex: i })
                }
              />
            </div>
          ))}
        </div>

        <select
          className="mini-select"
          value={form.level}
          onChange={(e) =>
            setForm({ ...form, level: e.target.value })
          }
        >
          <option value="початковий">Початковий</option>
          <option value="середній">Середній</option>
          <option value="просунутий">Просунутий</option>
        </select>

        <button className="mini-save" onClick={saveQuestion}>
          Зберегти
        </button>

        <button className="mini-cancel" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );
};

export default AdminPanelMiniTests;