const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const ExerciseSetting = require("../models/ExerciseSetting");

const defaultSettings = [
  { exercise_type: "multiple-choice", xp_amount: 10, question_limit: 10 },
  { exercise_type: "sentence-builder", xp_amount: 10, question_limit: 10 },
  { exercise_type: "translate-word", xp_amount: 10, question_limit: 10 },
  { exercise_type: "listening", xp_amount: 10, question_limit: 10 },
  { exercise_type: "matching", xp_amount: 10, question_limit: 10 },
  { exercise_type: "flashcards", xp_amount: 10, question_limit: 10 },
];

router.get("/", authenticate, async (req, res) => {
  try {
    for (const item of defaultSettings) {
      await ExerciseSetting.findOrCreate({
        where: { exercise_type: item.exercise_type },
        defaults: item,
      });
    }

    const settings = await ExerciseSetting.findAll({
      order: [["id", "ASC"]],
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося завантажити налаштування вправ" });
  }
});

router.put("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { settings } = req.body;

    for (const item of settings) {
      await ExerciseSetting.update(
        {
          xp_amount: item.xp_amount,
          question_limit: item.question_limit,
        },
        {
          where: { exercise_type: item.exercise_type },
        }
      );
    }

    res.json({ message: "Налаштування збережено" });
  } catch (error) {
    res.status(500).json({ error: "Не вдалося зберегти налаштування" });
  }
});

module.exports = router;