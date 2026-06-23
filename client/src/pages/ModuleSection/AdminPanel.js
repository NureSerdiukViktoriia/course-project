import React from "react";
import "./AdminPanel.css";

const AdminPanel = ({ open, onClose, types, form, setForm, saveSection }) => {
  if (!open) return null;
  const preview =
    form.media && typeof form.media === "object"
      ? URL.createObjectURL(form.media)
      : form.media
        ? `http://localhost:3001/uploads/${form.media}`
        : null;

  return (
    <div className="modal-wrapper" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Нова секція</h3>

        <input
          className="input"
          placeholder="Назва"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="select-level"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
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
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <label className="new-file">
          Завантажити зображення/аудіо
          <input
            type="file"
            accept="image/*,audio/*"
            onChange={(e) => setForm({ ...form, media: e.target.files[0] })}
          />
        </label>

        {preview && (
          <div className="preview-wrapper">
            {form.media?.type?.startsWith("audio") ||
            form.media?.name?.match(/mp3|wav/i) ? (
              <audio controls>
                <source src={preview} />
              </audio>
            ) : (
              <img src={preview} alt="preview" />
            )}
          </div>
        )}

        <button className="save-button" onClick={saveSection}>
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
