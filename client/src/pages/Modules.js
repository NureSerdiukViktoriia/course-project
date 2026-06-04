import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./Modules.css";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  const handleCreate = () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("image", image);

    fetch("http://localhost:3001/api/modules", {
      method: "POST",
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
      setLevel("");
    });
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
  return (
    <div className="module-wrapper">
      <Header />
      <div class="newModule">
        {modules.length === 0 ? (
          <p>Курсів немає</p>
        ) : (
          modules.map((m) => (
            <div key={m.id}>
              <h3>{m.title}</h3>
              <img
                src={`http://localhost:3001/uploads/${m.image}`}
                alt={m.title}
              ></img>
              <p>{m.description}</p>
              <p>{m.level}</p>
            </div>
          ))
        )}
      </div>
      {isAdmin && (
        <button onClick={() => setOpen(true)}>+ Додати модуль</button>
      )}
      {open && (
        <div className="modal-wrapper">
          <div className="modal">
            <h3>Новий модуль</h3>

            <input
              placeholder="Назва"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <input
              placeholder="Опис"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select onChange={(e) => setLevel(e.target.value)}>
              <option value="">Вибери рівень</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>

            <button className="save-button" onClick={handleCreate}>
              Зберегти
            </button>

            <button className="close-button" onClick={() => setOpen(false)}>
              Закрити
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Modules;
