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

router.get("/:id/sections", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const sections = await ModuleSection.findAll({
      where: { module_id: id },
    });

    res.json(sections);
  } catch (err) {
    console.error("GET sections error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/:id/sections",
  authenticate,
  isAdmin,
  upload.single("media"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type, title, content } = req.body;

      if (!title || !type || !content) {
        return res.status(400).json({ error: "Заповніть всі поля" });
      }

      const section = await ModuleSection.create({
        module_id: id,
        type,
        title,
        content,
        media: req.file ? req.file.filename : null,
      });

      res.json(section);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Помилка створення секції" });
    }
  },
);
module.exports = router;
