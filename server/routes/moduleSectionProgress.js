const express = require("express");
const ModuleSectionProgress = require("../models/ModuleSectionProgress.js");
const ModuleSection = require("../models/ModuleSection");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.post("/section", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sectionId, progress, completed } = req.body;

    await ModuleSectionProgress.upsert({
      user_id: userId,
      module_section_id: sectionId,
      progress,
      completed,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "save error" });
  }
});

router.get("/module/:moduleId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId } = req.params;

    const progress = await ModuleSectionProgress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: ModuleSection,
          where: { module_id: moduleId },
        },
      ],
    });

    const result = {};

    progress.forEach((p) => {
      result[p.module_section_id] = true;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "get progress error" });
  }
});
module.exports = router;
