const express = require("express");
const router = express.Router();
const Modules = require("../models/Modules.js");
const { Sequelize } = require("sequelize");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", authenticate, async (req, res) => {
  try {
    const modules = await Modules.findAll();
    res.json(modules);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Помилка при отриманні модулів", details: error.message });
  }
});

router.post(
  "/",
  authenticate,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, level } = req.body;
      if (!title || !req.file || !description || !level) {
        return res.status(400).json({ message: "Заповність всі поля" });
      }
      const image = req.file.filename;
      const module = await Modules.create({
        title,
        image,
        description,
        level,
      });
      res.status(201).json(module);
    } catch (err) {
      res.status(500).json({ error: "Помилка створення модуля" });
    }
  },
);

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Modules.findByPk(id);
    if (!module) {
      return res.status(404).json({ error: "Модуль не знайдено" });
    }

    await module.destroy();

    res.json({ message: "Модуль видалено" });
  } catch (err) {
    res.status(500).json({ error: "Помилка видалення модуля" });
  }
});

module.exports = router;
