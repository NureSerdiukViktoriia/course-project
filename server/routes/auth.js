const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Received /register request with body:", req.body);

  const { first_name, second_name, email, phone, password, level } = req.body;

  if (!first_name || !second_name || !email || !phone || !password || !level) {
    return res
      .status(400)
      .json({ error: "Всі поля є обов'язковими для заповнення" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Неправильний формат email" });
  }

  const phoneRegex = /^[0-9+\-\s()]*$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Неправильний формат телефону" });
  }

  const allowedLevels = ["початковий", "середній", "просунутий"];
  if (!allowedLevels.includes(level)) {
    return res
      .status(400)
      .json({ error: "Неправильне значення рівня (level)" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Користувач з таким email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      second_name,
      email,
      phone,
      password: hashedPassword,
      level,
    });

    console.log("User registered successfully:", user.id);
    res.status(201).json({ id: user.id });
  } catch (err) {
    console.error("Register error details:", err);
    res.status(500).json({
      error: "Помилка сервера при реєстрації користувача",
      details: err.message,
    });
  }
});

module.exports = router;
