const express = require("express");
const MiniTest = require("../models/MiniTest");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.get("/:level", async (req, res) => {
  const map = {
    beginner: "початковий",
    intermediate: "середній",
    advanced: "просунутий",
  };
  const dbLevel = map[req.params.level];
  const questions = await MiniTest.findAll({
    where: { level: dbLevel },
    attributes: ["question", "options", "correctAnswerIndex"],
    order: Sequelize.literal("RANDOM()"),
    limit: 10,
  });

  res.json(questions);
});
module.exports = router;
