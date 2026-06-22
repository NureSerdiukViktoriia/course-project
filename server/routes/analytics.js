const express = require("express");
const router = express.Router();
const MiniTestResult = require("../models/MiniTestResult");
const MiniTest = require("../models/MiniTest");
const ModuleSectionProgress = require("../models/ModuleSectionProgress");
const ModuleSection = require("../models/ModuleSection");
const Modules = require("../models/Modules");

router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const sectionRows = await ModuleSectionProgress.findAll({
      where: { user_id: userId },
      include: {
        model: ModuleSection,
        attributes: ["id", "title", "type", "module_id"],
        include: {
          model: Modules,
          attributes: ["id", "title", "level"],
        },
      },
      order: [["id", "DESC"]],
    });

    const latest = new Map();

    for (const r of sectionRows) {
      const id = r.ModuleSection?.id;
      if (id && !latest.has(id)) latest.set(id, r);
    }

    const sections = [...latest.values()].map((r) => ({
      progress: Number(r.progress),
      sectionId: r.ModuleSection?.id,
      sectionTitle: r.ModuleSection?.title,
      type: r.ModuleSection?.type,
      moduleId: r.ModuleSection?.module_id,
      moduleTitle: r.ModuleSection?.Module?.title,
      moduleLevel: r.ModuleSection?.Module?.level,
    }));

    const modulesMap = new Map();

    for (const s of sections) {
      if (!modulesMap.has(s.moduleId)) {
        modulesMap.set(s.moduleId, {
          moduleId: s.moduleId,
          title: s.moduleTitle,
          level: s.moduleLevel,
          sections: [],
        });
      }

      modulesMap.get(s.moduleId).sections.push(s);
    }

    const moduleProgress = await require("../models/ModuleProgress").findAll({
      where: { user_id: userId },
    });

    const progressMap = new Map(
      moduleProgress.map((m) => [
        m.module_id,
        {
          progress: m.progress,
          status: m.status,
        },
      ]),
    );

    const modules = [...modulesMap.values()].map((m) => {
      const data = progressMap.get(m.moduleId);

      return {
        ...m,
        avg: data?.progress || 0,
        status: data?.status || "not_started",
      };
    });

    res.json({
      modules,
      weakSections: sections.filter((s) => s.progress < 80),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Помилка аналітики" });
  }
});

router.get("/mini-tests/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await MiniTestResult.findAll({
      where: { user_id: userId },
      order: [["createdAt", "ASC"]],
    });

    const timeline = results.map((r) => ({
      id: r.id,
      date: r.createdAt,
      correct: r.correct_answers,
      level: r.suggested_level,
    }));

    res.json({ timeline });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Помилка міні-тестів" });
  }
});

module.exports = router;
