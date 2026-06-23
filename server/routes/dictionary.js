const express = require("express");
const UserDictionary = require("../models/UserDictionary");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;

    const words = await UserDictionary.findAll({
      where: { user_id },

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
    const user_id = req.user.id;
    const { word, translation } = req.body;
    console.log("translation:", translation);

    if (!word) {
      return res.status(400).json({ message: "Слово не може бути порожнім" });
    }

    const [newWord, created] = await UserDictionary.findOrCreate({
      where: {
        user_id,
        word,
      },
      defaults: {
        user_id,
        word,
        translation,
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

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const deleted = await UserDictionary.destroy({
      where: {
        id,
        user_id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        error: "Слово не знайдено",
      });
    }

    res.json({
      message: "Слово видалено",
    });
  } catch (err) {
    console.error("Поилка видалення слова:", err);
    res.status(500).json({
      error: "Помилка сервера при видаленні слова",
    });
  }
});

module.exports = router;
