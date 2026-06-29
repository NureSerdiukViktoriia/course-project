const express = require("express");
const MiniTest = require("../models/MiniTest");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.get("/:level", async (req, res) => {
  try {
    const map = {
      beginner: "початковий",
      intermediate: "середній",
      advanced: "просунутий",
    };

    const dbLevel = map[req.params.level];

    if (!dbLevel) {
      return res.status(400).json({ error: "Невірний рівень" });
    }

    const questions = await MiniTest.findAll({
      where: { level: dbLevel },
      attributes: ["question", "options", "correctAnswerIndex"],
      order: Sequelize.literal("RANDOM()"),
      limit: 15,
    });

    return res.json(questions);
  } catch (error) {
    console.error("Помилка MiniTest:", error);
    return res.status(500).json({ error: "Помилка сервера" });
  }
});
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const questions = await MiniTest.findAll({
      order: [["id", "DESC"]],
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Помилка запиту" });
  }
});
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      correctAnswerIndex,
      level,
    } = req.body;

    const newQuestion = await MiniTest.create({
      question,
      options: [option1, option2, option3, option4],
      correctAnswerIndex,
      level,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Помилка створення" });
  }
});
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      correctAnswerIndex,
      level,
    } = req.body;

    const [updated] = await MiniTest.update(
      {
        question,
        options: [option1, option2, option3, option4],
        correctAnswerIndex,
        level,
      },
      { where: { id: req.params.id } },
    );

    if (!updated) {
      return res.status(404).json({ error: "Не знайдено" });
    }

    res.json({ message: "Оновлено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка оновлення" });
  }
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await MiniTest.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Не знайдено" });
    }

    res.json({ message: "Видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка видалення" });
  }
});

module.exports = router;
