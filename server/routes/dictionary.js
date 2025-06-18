const express = require("express");
const UserDictionary = require("../models/UserDictionary");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const id = req.user.id;

    const words = await UserDictionary.findAll({
      where: { userId: id },

      attributes: ["id", "word", "translation"],
    });
    res.json(words);
  } catch (error) {
    console.error("Error fetching dictionary:", error);
    res
      .status(500)
      .json({ error: "Помилка при отриманні слів", details: error.message });
  }
});

router.post("/add", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { word, translation } = req.body;
    console.log("translation:", translation);

    if (!word) {
      return res.status(400).json({ message: "Слово не може бути порожнім" });
    }

    const [newWord, created] = await UserDictionary.findOrCreate({
      where: {
        userId: userId,
        word: word,
      },
      defaults: {
        userId: userId,
        word: word,
        translation: translation,
      },
    });

    if (!created) {
      return res
        .status(409)
        .json({ message: "Це слово вже є у вашому словнику" });
    }

    res.status(201).json({ message: "Слово успішно додано!", word: newWord });
  } catch (err) {
    console.error("Error adding to dictionary:", err);
    res.status(500).json({ error: "Помилка сервера при додаванні слова" });
  }
});

module.exports = router;
