const express = require("express");
const ModuleSection = require("../models/ModuleSection.js");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/:id/sections", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const sections = await ModuleSection.findAll({
      where: { module_id: id },
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання секцій" });
  }
});
router.get("/test", (req, res) => {
  res.json({ ok: true });
});
module.exports = router;
