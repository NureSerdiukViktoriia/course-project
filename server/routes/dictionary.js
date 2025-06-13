const express = require("express");
const UserDictionary = require("../models/UserDictionary");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const id = req.user.id;

    const words = await UserDictionary.findAll({
      where: { user_id: id },
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

module.exports = router;
