const express = require("express");
const MiniTest = require("../models/MiniTest");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.get("/beginner", async (req, res) => {
  const level = req.query.level || "початковий";
  try {
    const questions = await MiniTest.findAll({
      where: { level },
      attributes: ["question", "options", "correctAnswerIndex"],
      order: Sequelize.literal("RANDOM()"),
      limit: 10,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.get("/intermediate", async (req, res) => {
  const level = req.query.level || "середній";
  try {
    const questions = await MiniTest.findAll({
      where: { level },
      attributes: ["question", "options", "correctAnswerIndex"],
      order: Sequelize.literal("RANDOM()"),
      limit: 10,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.get("/advanced", async (req, res) => {
  const level = req.query.level || "просунутий";
  try {
    const questions = await MiniTest.findAll({
      where: { level },
      attributes: ["question", "options", "correctAnswerIndex"],
      order: Sequelize.literal("RANDOM()"),
      limit: 10,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});
module.exports = router;
