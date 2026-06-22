const express = require("express");
const ModuleSection = require("../models/ModuleSection.js");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/:moduleId/sections", async (req, res) => {
  try {
    const { moduleId } = req.params;

    const sections = await ModuleSection.findAll({
      where: { module_id: moduleId, deleted: false },
    });

    res.json(sections);
  } catch (err) {
    console.error("GET sections error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/:moduleId/sections",
  authenticate,
  isAdmin,
  upload.single("media"),
  async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { type, title, content } = req.body;

      if (!title || !type || !content) {
        return res.status(400).json({ error: "Заповніть всі поля" });
      }

      const section = await ModuleSection.create({
        module_id: moduleId,
        type,
        title,
        content,
        media: req.file ? req.file.filename : null,
      });

      res.json(section);
    } catch (err) {
      console.error("CREATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

router.delete(
  "/:moduleId/sections/:sectionId",
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const { sectionId } = req.params;

      await ModuleSection.update(
        { deleted: true },
        { where: { id: sectionId } },
      );

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Помилка видалення секції" });
    }
  },
);
router.put(
  "/:moduleId/sections/:sectionId",
  authenticate,
  isAdmin,
  upload.single("media"),
  async (req, res) => {
    try {
      const { sectionId } = req.params;
      const { title, type, content } = req.body;
      const section = await ModuleSection.findOne({
        where: {
          id: sectionId,
          deleted: false,
        },
      });
      if (!section) {
        return res.status(404).json({ error: "Не знайдено" });
      }

      await section.update({
        title,
        type,
        content,
        media: req.file ? req.file.filename : section.media,
      });

      res.json(section);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Помилка оновлення секції" });
    }
  },
);
module.exports = router;
