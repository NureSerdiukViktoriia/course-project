import React from "react";
import "./AdminPanel.css";

const AdminPanel = ({
  open,
  onClose,
  types,
  form,
  setForm,
  createSection,
}) => {
  if (!open) return null;

  return (
    <div className="modal-wrapper" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Нова секція</h3>

        <input
          className="input"
          placeholder="Назва"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="select-level"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          className="input-description"
          placeholder="Зміст"
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        <label className="new-file">
          Завантажити зображення
          <input
            type="file"
            accept="image/*,audio/*"
            onChange={(e) =>
              setForm({ ...form, media: e.target.files[0] })
            }
          />
        </label>

        <button className="save-button" onClick={createSection}>
         Додати секцію
        </button>

        <button className="cancel-button" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;