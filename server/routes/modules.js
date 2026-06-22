const express = require("express");
const router = express.Router();
const Modules = require("../models/Modules.js");
const MiniTestResult = require("../models/MiniTestResult.js");
const ModuleSection = require("../models/ModuleSection");
const Task = require("../models/Task");
const ModuleSectionProgress = require("../models/ModuleSectionProgress");
const ModuleProgress = require("../models/ModuleProgress");
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
    const modules = await Modules.findAll({
      where: { deleted: false },
    });
    res.json(modules);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Помилка при отриманні модулів", details: error.message });
  }
});
router.get("/result/latest", authenticate, async (req, res) => {
  try {
    const result = await MiniTestResult.findOne({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!result) {
      return res.json(null);
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const module = await Modules.findByPk(id);
      if (!module) {
        return res.status(404).json({ error: "Модуль не знайдено" });
      }
      const { title, description, level } = req.body;
      module.title = title;
      module.description = description;
      module.level = level;
      if (req.file) {
        module.image = req.file.filename;
      }
      await module.save();
      res.json(module);
    } catch (err) {
      res.status(500).json({ error: "Помилка редагування модуля" });
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

    await module.update({ deleted: true });

    res.json({ message: "Модуль приховано" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
