const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "first_name",
        "second_name",
        "email",
        "phone",
        "level",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Помилка при завантаженні профілю:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.put("/", authenticate, async (req, res) => {
  try {
    const { first_name, second_name, email, phone, level } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    user.first_name = first_name ?? user.first_name;
    user.second_name = second_name ?? user.second_name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.level = level ?? user.level;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Помилка оновлення профілю:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.delete("/", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    await user.destroy();

    res.status(200).json({ message: "Акаунт успішно видалено" });
  } catch (err) {
    console.error("Помилка видалення акаунту:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Вкажіть обидва паролі" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Старий пароль невірний" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Пароль успішно змінено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;
