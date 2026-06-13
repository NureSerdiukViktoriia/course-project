const express = require("express");
const Task = require("../models/Task");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/:sectionId", authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        module_section_id: req.params.sectionId,
      },
      order: [["id", "ASC"]],
    });

    res.json(tasks);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/:sectionId", authenticate, isAdmin, async (req, res) => {
  try {
    const {
      question,
      options,
      correct_index,
      answer_boolean,
    } = req.body;

    const task = await Task.create({
      module_section_id: req.params.sectionId,
      question,
      options,
      correct_index,
      answer_boolean,
    });

    res.json(task);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;