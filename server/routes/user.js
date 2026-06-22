const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const UserStatistics = require("../models/UserStatistics");
const Badge = require("../models/Badge");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "first_name",
        "second_name",
        "email",
        "phone",
        "level",
        "role",
        "xp",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Помилка при завантаженні профілю:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.put("/", authenticate, async (req, res) => {
  try {
    const { first_name, second_name, email, phone, level } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    user.first_name = first_name ?? user.first_name;
    user.second_name = second_name ?? user.second_name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.level = level?.toLowerCase() ?? user.level;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Помилка оновлення профілю:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.delete("/", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    await user.destroy();

    res.status(200).json({ message: "Акаунт успішно видалено" });
  } catch (err) {
    console.error("Помилка видалення акаунту:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Вкажіть обидва паролі" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Старий пароль невірний" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Пароль успішно змінено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.get("/achievements", authenticate, async (req, res) => {
  try {
    const achievements = await Achievement.findAll();

    const userAchievements = await UserAchievement.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    const earnedIds = userAchievements.map((item) => item.achievement_id);

    const result = achievements.map((achievement) => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      condition_type: achievement.condition_type,
      condition_value: achievement.condition_value,
      xp_reward: achievement.xp_reward,
      completed: earnedIds.includes(achievement.id),
    }));

    res.json(result);
  } catch (error) {
    console.error("Achievements error:", error);
    res.status(500).json({
      error: "Помилка при завантаженні досягнень",
    });
  }
});

const checkAchievements = async (user) => {
  const achievements = await Achievement.findAll();

  const statistics = await UserStatistics.findOne({
    where: { user_id: user.id },
  });

  for (const achievement of achievements) {
    let isUnlocked = false;

    if (
      achievement.condition_type === "total_xp" &&
      user.xp >= achievement.condition_value
    ) {
      isUnlocked = true;
    }

    if (
      achievement.condition_type === "flashcards_correct" &&
      statistics &&
      statistics.flashcards_correct >= achievement.condition_value
    ) {
      isUnlocked = true;
    }

    if (
      achievement.condition_type === "listening_correct" &&
      statistics &&
      statistics.listening_correct >= achievement.condition_value
    ) {
      isUnlocked = true;
    }

    if (
      achievement.condition_type === "completed_exercise_types" &&
      statistics &&
      statistics.completed_exercise_types
    ) {
      const completedTypes = statistics.completed_exercise_types
        .split(",")
        .filter(Boolean);

      if (completedTypes.length >= achievement.condition_value) {
        isUnlocked = true;
      }
    }

    if (isUnlocked) {
      const alreadyExists = await UserAchievement.findOne({
        where: {
          user_id: user.id,
          achievement_id: achievement.id,
        },
      });

      if (!alreadyExists) {
        await UserAchievement.create({
          user_id: user.id,
          achievement_id: achievement.id,
        });

        user.xp += achievement.xp_reward || 0;
        await user.save();
      }
    }
  }
};

router.post("/add-xp", authenticate, async (req, res) => {
  try {
    const { xp } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const xpToAdd = Number(xp) || 0;

    if (xpToAdd <= 0) {
      return res.status(400).json({ error: "Некоректна кількість XP" });
    }

    user.xp = (user.xp || 0) + xpToAdd;

    await user.save();
    await checkAchievements(user);

    res.json({ xp: user.xp, added: xpToAdd });
  } catch (error) {
    console.error("Add XP error:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/flashcard-correct", authenticate, async (req, res) => {
  try {
    let statistics = await UserStatistics.findOne({
      where: { user_id: req.user.id },
    });

    if (!statistics) {
      statistics = await UserStatistics.create({
        user_id: req.user.id,
        flashcards_correct: 0,
      });
    }

    statistics.flashcards_correct += 1;
    await statistics.save();

    const user = await User.findByPk(req.user.id);

    await checkAchievements(user);

    res.json({
      flashcards_correct: statistics.flashcards_correct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

router.post("/listening-correct", authenticate, async (req, res) => {
  try {
    let statistics = await UserStatistics.findOne({
      where: { user_id: req.user.id },
    });

    if (!statistics) {
      statistics = await UserStatistics.create({
        user_id: req.user.id,
        listening_correct: 0,
      });
    }

    statistics.listening_correct += 1;
    await statistics.save();

    const user = await User.findByPk(req.user.id);

    await checkAchievements(user);

    res.json({
      listening_correct: statistics.listening_correct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

router.post( "/complete-exercise-type", authenticate, async (req, res) => {
    try {
      const { exerciseType } = req.body;

      let statistics = await UserStatistics.findOne({
        where: { user_id: req.user.id },
      });

      if (!statistics) {
        statistics = await UserStatistics.create({
          user_id: req.user.id,
        });
      }

      const currentTypes = statistics.completed_exercise_types
        ? statistics.completed_exercise_types.split(",")
        : [];

      if (!currentTypes.includes(exerciseType)) {
        currentTypes.push(exerciseType);

        statistics.completed_exercise_types =
          currentTypes.join(",");

        await statistics.save();
      }

      const user = await User.findByPk(req.user.id);
      await checkAchievements(user);

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Помилка сервера",
      });
    }
  }
);

router.get("/badges", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const badges = await Badge.findAll({
      order: [["min_xp", "ASC"]],
    });

    const xp = user.xp || 0;

    const currentBadge =
      badges.filter((badge) => xp >= badge.min_xp).pop() || badges[0];

    const nextBadge =
      badges.find((badge) => xp < badge.min_xp) || currentBadge;

    res.json({
      currentBadge,
      nextBadge,
      badges,
    });
  } catch (error) {
    res.status(500).json({ error: "Помилка при завантаженні бейджів" });
  }
});

router.get("/leaderboard", authenticate, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "first_name", "second_name", "xp"],
      order: [["xp", "DESC"]],
      limit: 5,
    });

    res.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Помилка при завантаженні рейтингу" });
  }
});

module.exports = router;
