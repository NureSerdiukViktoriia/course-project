const express = require("express");
const Notification = require("../models/Notification.js");
const authenticate = require("../middleware/auth");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { type, title, message } = req.body;

    const notification = await Notification.create({
      user_id: req.user.id,
      type,
      title,
      message,
    });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/read", authenticate, async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      {
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;