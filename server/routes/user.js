const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;
