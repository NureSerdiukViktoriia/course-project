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

    const rows = await ModuleSectionProgress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: ModuleSection,
          attributes: ["id", "title", "type", "module_id"],
          include: [
            {
              model: Modules,
              attributes: ["id", "title"],
            },
          ],
        },
      ],
    });

    const formatted = rows.map((r) => ({
      id: r.id,
      progress: r.progress,
      sectionTitle: r.ModuleSection?.title,
      type: r.ModuleSection?.type,
      moduleTitle: r.ModuleSection?.Module?.title,
      moduleId: r.ModuleSection?.module_id,
    }));

    const grouped = {};

    formatted.forEach((item) => {
      if (!grouped[item.moduleId]) {
        grouped[item.moduleId] = {
          title: item.moduleTitle,
          sections: [],
        };
      }

      grouped[item.moduleId].sections.push(item);
    });

    const result = Object.values(grouped).map((m) => {
      const avg = m.sections.length
        ? m.sections.reduce((s, i) => s + i.progress, 0) / m.sections.length
        : 0;

      return { ...m, avg };
    });

    const weak = formatted.filter((s) => s.progress < 50);

    res.json({
      modules: result,
      weakSections: weak,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Помилка аналітики" });
  }
});
// router.get("/profile/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const rows = await ModuleSectionProgress.findAll({
//       where: { user_id: userId },
//       include: [
//         {
//           model: ModuleSection,
//           attributes: ["id", "title", "type", "module_id"],
//           include: [
//             {
//               model: Modules,
//               attributes: ["id", "title"],
//             },
//           ],
//         },
//       ],
//     });

//     const formatted = rows.map((r) => ({
//       id: r.id,
//       progress: r.progress,
//       sectionTitle: r.ModuleSection?.title,
//       type: r.ModuleSection?.type,
//       moduleTitle: r.ModuleSection?.Module?.title,
//       moduleId: r.ModuleSection?.module_id,
//     }));

//     const grouped = {};

//     formatted.forEach((item) => {
//       if (!grouped[item.moduleId]) {
//         grouped[item.moduleId] = {
//           title: item.moduleTitle,
//           sections: [],
//         };
//       }

//       grouped[item.moduleId].sections.push(item);
//     });

//     const modules = Object.values(grouped).map((m) => {
//       const avg = m.sections.length
//         ? m.sections.reduce((s, i) => s + i.progress, 0) / m.sections.length
//         : 0;

//       return { ...m, avg };
//     });

//     const weakSections = formatted.filter((s) => s.progress < 50);

//     const testRows = await MiniTestResult.findAll({
//       where: { user_id: userId },
//       include: [
//         {
//           model: MiniTest,
//           attributes: ["level"],
//         },
//       ],
//       order: [["createdAt", "ASC"]],
//     });

//     const tests = testRows.map((t) => ({
//       id: t.id,
//       score: t.correct_answers,
//       level: t.suggested_level,
//       testLevel: t.MiniTest?.level,
//       date: t.createdAt,
//     }));

//     res.json({
//       modules,
//       weakSections,
//       tests,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Помилка аналітики" });
//   }
// });
module.exports = router;
