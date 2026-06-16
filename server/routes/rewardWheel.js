const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");
const WheelReward = require("../models/WheelReward");
const RewardWheel = require("../models/RewardWheel");

const getToday = () => new Date().toISOString().split("T")[0];

router.post("/spin", authenticate, async (req, res) => {
  try {
    const today = getToday();

    const alreadySpun = await RewardWheel.findOne({
      where: {
        user_id: req.user.id,
        spin_date: today,
      },
    });

    if (alreadySpun) {
      return res.status(400).json({
        message: "Сьогодні колесо вже було використано.",
        reward: alreadySpun,
      });
    }

    const rewards = await WheelReward.findAll();

    if (!rewards.length) {
    return res.status(400).json({
        message: "Нагороди для колеса ще не додані.",
        });
    }

    const totalChance = rewards.reduce((sum, reward) => sum + reward.chance, 0);
    let random = Math.floor(Math.random() * totalChance) + 1;

    let randomReward = rewards[0];

    for (const reward of rewards) {
    random -= reward.chance;

    if (random <= 0) {
        randomReward = reward;
        break;
        }
    }

    await RewardWheel.create({
      user_id: req.user.id,
      reward_type: randomReward.reward_type,
      reward_value: randomReward.reward_value,
      spin_date: today,
    });

    const user = await User.findByPk(req.user.id);
    user.xp = (user.xp || 0) + randomReward.reward_value;
    await user.save();

    res.json({
      message: `Вітаємо! Ви отримали ${randomReward.reward_value} XP.`,
      reward: randomReward,
      xp: user.xp,
    });
  } catch (error) {
    console.error("Reward wheel error:", error);
    res.status(500).json({
      error: "Помилка при обертанні колеса.",
    });
  }
});

router.get("/today", authenticate, async (req, res) => {
  try {
    const today = getToday();

    const spin = await RewardWheel.findOne({
      where: {
        user_id: req.user.id,
        spin_date: today,
      },
    });

    res.json({
      usedToday: !!spin,
      reward: spin,
    });
  } catch (error) {
    res.status(500).json({
      error: "Помилка перевірки колеса.",
    });
  }
});

router.get("/rewards", authenticate, async (req, res) => {
  try {
    const rewards = await WheelReward.findAll({
      order: [["reward_value", "ASC"]],
    });

    res.json(rewards);
  } catch (error) {
    res.status(500).json({
      error: "Помилка завантаження нагород",
    });
  }
});

module.exports = router;