import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import pencilIcon from "../../assets/pencil.png";
import deleteIcon from "../../assets/delete.png";
import catalogIcon from "../../assets/catalog.png";
import magnifierIcon from "../../assets/magnifier.png";
import targetIcon from "../../assets/target.png";

import "./Modules.css";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleMessage, setModuleMessage] = useState(null);
  const [filterLevels, setFilterLevels] = useState([]);
  const [sortType, setSortType] = useState("");
  const [recommendedLevel, setRecommendedLevel] = useState(null);

  const recommendedModules = modules.filter(
    (m) => m.level === recommendedLevel,
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/miniTestResult/result/latest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendedLevel(data?.suggested_level || null);
      });
  }, []);

  const validate = () => {
    if (!editMode && !image) {
      setModuleMessage({ type: "error", text: "Завантажте зображення" });
      return false;
    }
    if (!title.trim()) {
      setModuleMessage({ type: "error", text: "Назва не може бути порожньою" });
      return false;
    }

    if (!description.trim()) {
      setModuleMessage({ type: "error", text: "Опис не може бути порожнім" });
      return false;
    }

    if (!level) {
      setModuleMessage({ type: "error", text: "Оберіть рівень" });
      return false;
    }

    setModuleMessage(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("level", level);
    if (image) {
      formData.append("image", image);
    }

    const url = editMode
      ? `http://localhost:3001/api/modules/${editingId}`
      : "http://localhost:3001/api/modules";
    const method = editMode ? "PUT" : "POST";
    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then(() => {
      setOpen(false);
      fetchModules();
      setTitle("");
      setDescription("");
      setImage(null);
      setPreviewImage(null);
      setLevel("");
      setModuleMessage(null);
      setEditMode(false);
      setEditingId(null);
    });
  };
  const openCreateModal = () => {
    setEditMode(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setLevel("");
    setImage(null);
    setPreviewImage(null);
    setModuleMessage(null);
    setOpen(true);
  };
  const fetchModules = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/modules", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setModules(data));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const isAdmin = user && user.role === "admin";
  const navigate = useNavigate();
  const filteredModules = modules
    .filter((m) => {
      if (filterLevels.length === 0) return true;
      return filterLevels.includes(m.level);
    })
    .sort((a, b) => {
      if (sortType === "asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortType === "desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  const hasModules = filteredModules.length > 0;
  return (
    <div className="module-wrapper">
      <Header />
      {recommendedLevel && (
        <div className="recommended-section">
          <div className="recommended-header">
            <div className="recommended-icon">
              <img src={targetIcon} alt="Target" />
            </div>

            <div>
              <h2 className="recommended-title">Рекомендовані курси</h2>

              <p className="recommended-subtitle">
                Відповідно до результатів міні-тесту вам рекомендується рівень
                <span className="level-badge">{recommendedLevel}</span>
              </p>
            </div>
          </div>

          {recommendedModules.length > 0 ? (
            <div className="modules-container">
              {recommendedModules.map((m) => (
                <div className="new-module" key={m.id}>
                  <img
                    src={`http://localhost:3001/uploads/${m.image}`}
                    alt={m.title}
                  />

                  <div className="title-row">
                    <h3>{m.title}</h3>
                    <p>{m.level}</p>
                  </div>
                  <div className="description">
                    <p>{m.description}</p>
                  </div>
                  <button
                    className="module-learn"
                    onClick={() => navigate(`/modules/${m.id}`)}
                  >
                    Почати вивчати
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="recommended-empty">
              <div className="recommended-icon">
                <img src={magnifierIcon} alt="empty" />
              </div>
              Для вашого рівня курсів поки що немає
            </div>
          )}
        </div>
      )}
      <div className="section-title">
        <div className="section-icon">
          <img src={catalogIcon} alt="catalog" />
        </div>
        <h3>Усі курси</h3>
      </div>
      <div className="controls">
        <div className="controls-group">
          <label>Рівні</label>

          <div className="levels">
            {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
              <button
                key={lvl}
                className={`level-btn ${
                  filterLevels.includes(lvl) ? "active" : ""
                }`}
                onClick={() => {
                  setFilterLevels((prev) =>
                    prev.includes(lvl)
                      ? prev.filter((l) => l !== lvl)
                      : [...prev, lvl],
                  );
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="controls-group">
          <label>Сортування</label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">Без сортування</option>
            <option value="asc">А → Я</option>
            <option value="desc">Я → А</option>
          </select>
        </div>
      </div>

      <main className="modules-container">
        {modules.length === 0 ? (
          <p>Курсів немає</p>
        ) : !hasModules ? (
          <p>Немає курсів за цим фільтром</p>
        ) : (
          filteredModules.map((m) => (
            <div className="new-module" key={m.id}>
              <img
                src={`http://localhost:3001/uploads/${m.image}`}
                alt={m.title}
              />

              <div className="title-row">
                <h3>{m.title}</h3>
                <p>{m.level}</p>
              </div>
              <div className="description">
                <p>{m.description}</p>
              </div>
              <button
                className="module-learn"
                onClick={() => navigate(`/modules/${m.id}`)}
              >
                Почати вивчати
              </button>
              {isAdmin && (
                <div className="admin-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditMode(true);
                      setEditingId(m.id);
                      setTitle(m.title);
                      setDescription(m.description);
                      setLevel(m.level);
                      setPreviewImage(
                        `http://localhost:3001/uploads/${m.image}`,
                      );
                      setOpen(true);
                    }}
                  >
                    <img src={pencilIcon} alt="Edit" />
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => setDeleteId(m.id)}
                  >
                    <img src={deleteIcon} alt="Delete" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {isAdmin && (
        <button onClick={openCreateModal} className="add-module-button">
          Додати курс
        </button>
      )}
      {open && (
        <div className="modal-wrapper" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editMode ? "Редагувати курс" : "Новий курс"}</h3>
            {moduleMessage && (
              <div className={`moduleMessage ${moduleMessage.type}`}>
                {moduleMessage.text}
              </div>
            )}
            <label className="new-file">
              Завантажити зображення
              <input
                key={previewImage}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreviewImage(URL.createObjectURL(file));
                }}
              />
            </label>

            {previewImage && (
              <div className="preview-wrapper">
                <img src={previewImage} alt="preview" className="preview-img" />
              </div>
            )}
            <input
              placeholder="Назва"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Опис"
              className="textarea input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="select-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Вибери рівень</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>

            <button className="save-button" onClick={handleSave}>
              Зберегти
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-wrapper">
          <div className="modal">
            <h3>Видалити курс?</h3>

            <button
              className="save-button"
              onClick={() => {
                fetch(`http://localhost:3001/api/modules/${deleteId}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }).then(() => {
                  fetchModules();
                  setDeleteId(null);
                });
              }}
            >
              Так, видалити
            </button>

            <button className="cancel-button" onClick={() => setDeleteId(null)}>
              Скасувати
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Modules;
