const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Received /register request with body:", req.body);

  const {
    first_name,
    second_name,
    email,
    phone,
    password,
    level,
    inviteCode,
    secret_question,
    secret_answer,
  } = req.body;

  if (
    !first_name ||
    !second_name ||
    !email ||
    !phone ||
    !password ||
    !level ||
    !secret_question ||
    !secret_answer
  ) {
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
    return res.status(400).json({ error: "Неправильне значення рівня" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Користувач з таким email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecretAnswer = await bcrypt.hash(secret_answer, 10);
    let role = "user";

    if (inviteCode?.trim()) {
      if (inviteCode.trim() !== process.env.ADMIN_CODE?.trim()) {
        return res.status(400).json({ error: "Невірний код доступу" });
      }
      role = "admin";
    }
    const user = await User.create({
      first_name,
      second_name,
      email,
      phone,
      password: hashedPassword,
      secret_question,
      secret_answer: hashedSecretAnswer,
      level,
      role,
    });

    console.log("User registered successfully:", user.id);
    res.status(201).json({ id: user.id, role: user.role });
  } catch (err) {
    console.error("Register error details:", err);
    res.status(500).json({
      error: "Помилка сервера при реєстрації користувача",
      details: err.message,
    });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Невірна пошта або пароль" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Невірна пошта або пароль" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
    );

    res.status(200).json({
      message: "Успішний вхід",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        second_name: user.second_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Помилка сервера під час входу" });
  }
});
router.post("/forgot/check-user", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Користувача не знайдено" });
  }
  res.json({ secret_question: user.secret_question });
});

router.post("/forgot/verify-answer", async (req, res) => {
  try {
    const { email, secret_answer } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }
    const isMatch = await bcrypt.compare(
      secret_answer.trim(),
      user.secret_answer,
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Невірна відповідь" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/forgot/reset-password", async (req, res) => {
  try {
    const { email, new_password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    await User.update({ password: hashed }, { where: { email } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;
