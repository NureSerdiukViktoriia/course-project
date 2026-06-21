const express = require("express");
const ModuleSectionProgress = require("../models/ModuleSectionProgress.js");
const ModuleSection = require("../models/ModuleSection");
const ModuleProgress = require("../models/ModuleProgress");
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
    });
    const section = await ModuleSection.findByPk(sectionId);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    const moduleId = section.module_id;
    const allSections = await ModuleSection.findAll({
      where: { module_id: moduleId },
    });

    const progresses = await ModuleSectionProgress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: ModuleSection,
          where: { module_id: moduleId },
        },
      ],
    });
    const progressMap = new Map();
    progresses.forEach((p) => {
      progressMap.set(p.module_section_id, p.progress || 0);
    });
    const totalProgress = allSections.reduce((sum, s) => {
      return sum + (progressMap.get(s.id) || 0);
    }, 0);

    const avgProgress = Math.round(totalProgress / allSections.length);
    const allCompleted =
      allSections.length > 0 &&
      allSections.every((s) => (progressMap.get(s.id) || 0) >= 80);

    const anyStarted = progresses.some((p) => (p.progress || 0) > 0);

    let status = "not_started";

    if (allCompleted) {
      status = "completed";
    } else if (allSections.some((s) => (progressMap.get(s.id) || 0) > 0)) {
      status = "in_progress";
    }
    await ModuleProgress.upsert({
      user_id: userId,
      module_id: moduleId,
      progress: avgProgress,
      status,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "save error" });
  }
});

router.get("/module/:moduleId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId } = req.params;

    const progresses = await ModuleSectionProgress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: ModuleSection,
          where: { module_id: moduleId },
        },
      ],
    });

    const result = {};

    progresses.forEach((p) => {
      result[p.module_section_id] = p.progress;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "get progress error" });
  }
});
module.exports = router;
