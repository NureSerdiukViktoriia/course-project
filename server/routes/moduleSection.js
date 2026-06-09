const express = require("express");
const ModuleSection = require("../models/ModuleSection.js");
const SectionTask = require("../models/SectionTask.js");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/:id/sections", authenticate, async (req, res) => {
try {
    const { id } = req.params;

    const sections = await ModuleSection.findAll({
      where: { module_id: id },
      include: [
        {
          model: SectionTask,
        },
      ],
      order: [
        ["id", "ASC"],
        [SectionTask, "order", "ASC"],
      ],
    });

    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка отримання секцій" });
  }
});
module.exports = router;
