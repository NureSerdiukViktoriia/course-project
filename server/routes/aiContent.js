const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const AITopic = require("../models/AITopic");
const AISuggestion = require("../models/AISuggestion");

router.get("/topics", authenticate, async (req, res) => {
  try {
    const topics = await AITopic.findAll({
      order: [["id", "ASC"]],
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Помилка при завантаженні тем" });
  }
});

router.post("/topics", authenticate, isAdmin, async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Назва теми обов'язкова" });
    }

    const topic = await AITopic.create({
      name,
      icon: icon || "💬",
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: "Помилка при додаванні теми" });
  }
});

router.put("/topics/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { name, icon } = req.body;

    const topic = await AITopic.findByPk(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: "Тему не знайдено" });
    }

    topic.name = name || topic.name;
    topic.icon = icon || topic.icon;

    await topic.save();

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: "Помилка при редагуванні теми" });
  }
});

router.delete("/topics/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const topic = await AITopic.findByPk(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: "Тему не знайдено" });
    }

    await topic.destroy();

    res.json({ message: "Тему видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка при видаленні теми" });
  }
});

router.get("/suggestions", authenticate, async (req, res) => {
  try {
    const suggestions = await AISuggestion.findAll({
      order: [["id", "ASC"]],
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: "Помилка при завантаженні підказок" });
  }
});

router.post("/suggestions", authenticate, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Текст підказки обов'язковий" });
    }

    const suggestion = await AISuggestion.create({ text });

    res.status(201).json(suggestion);
  } catch (error) {
    res.status(500).json({ error: "Помилка при додаванні підказки" });
  }
});

router.put("/suggestions/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;

    const suggestion = await AISuggestion.findByPk(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: "Підказку не знайдено" });
    }

    suggestion.text = text || suggestion.text;

    await suggestion.save();

    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: "Помилка при редагуванні підказки" });
  }
});

router.delete("/suggestions/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const suggestion = await AISuggestion.findByPk(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: "Підказку не знайдено" });
    }

    await suggestion.destroy();

    res.json({ message: "Підказку видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка при видаленні підказки" });
  }
});

module.exports = router;