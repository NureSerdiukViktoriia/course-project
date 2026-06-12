const express = require("express");
const authenticate = require("../middleware/auth");
const TestListeningTask = require("../models/TestListeningTask.js");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.get("/:sectionId", authenticate, async (req, res) => {
  try {
    const tasks = await TestListeningTask.findAll({
      where: { module_section_id: req.params.sectionId },
      order: [["id", "ASC"]],
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка отримання test/listening tasks" });
  }
});

router.post("/:sectionId", authenticate, isAdmin, async (req, res) => {
  try {
    const { question, options, correct_index, category } = req.body;

    if (!question || !options || correct_index === undefined || !category) {
      return res.status(400).json({ error: "Заповніть всі поля" });
    }

    const task = await TestListeningTask.create({
      module_section_id: req.params.sectionId,
      question,
      options,
      correct_index,
      category,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка створення task" });
  }
});

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { question, options, correct_index, category } = req.body;

    const task = await TestListeningTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update({
      question,
      options,
      correct_index,
      category,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating task" });
  }
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const task = await TestListeningTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
