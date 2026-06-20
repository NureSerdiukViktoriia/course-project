const express = require("express");
const MiniTestResult = require("../models/MiniTestResult.js");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { Sequelize } = require("sequelize");
const router = express.Router();

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
router.post("/save", authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { mini_test_id, correct_answers, level } = req.body;

    const score = correct_answers;

    let suggested_level = null;

    if (level === "початковий") {
      suggested_level = score <= 5 ? "A1" : "A2";
    }

    if (level === "середній") {
      suggested_level = score <= 5 ? "B1" : "B2";
    }

    if (level === "просунутий") {
      suggested_level = score <= 5 ? "B2" : "C1";
    }

    const result = await MiniTestResult.create({
      user_id,
      mini_test_id,
      correct_answers: score,
      suggested_level,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
