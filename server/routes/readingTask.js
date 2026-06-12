const express = require("express");
const authenticate = require("../middleware/auth");
const ReadingTask = require("../models/ReadingTask.js");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.get("/:sectionId", authenticate, async (req, res) => {
  try {
    const tasks = await ReadingTask.findAll({
      where: { module_section_id: req.params.sectionId },
      order: [["id", "ASC"]],
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка отримання reading tasks" });
  }
});

router.post("/:sectionId", authenticate, isAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || answer === undefined) {
      return res.status(400).json({ error: "Заповніть всі поля" });
    }

    const task = await ReadingTask.create({
      module_section_id: req.params.sectionId,
      question,
      answer,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка створення reading task" });
  }
});

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;

    const task = await ReadingTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update({
      question,
      answer,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating reading task" });
  }
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const task = await ReadingTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting reading task" });
  }
});
module.exports = router;
