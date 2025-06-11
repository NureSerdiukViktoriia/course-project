const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Question = require('../models/Question');
const User = require('../models/User'); 
const UserDictionary = require('../models/UserDictionary');

const authenticate = require('../middleware/auth');

router.get('/multiple-choice', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const userLevel = user.level;
        const limit = parseInt(req.query.limit, 10) || 10;

        const questions = await Question.findAll({
            where: {
                exercise_type: 'multiple_choice',
                difficulty_level: userLevel
            },
            order: [
                Sequelize.fn('RANDOM')
            ],
            limit: limit
        });

        res.json({ questions });

    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Ошибка сервера при получении вопросов" });
    }
});

router.post('/dictionary/add', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { word, translation } = req.body;

        if (!word) {
            return res.status(400).json({ error: "Слово не предоставлено" });
        }
        
        const [newWord, created] = await UserDictionary.findOrCreate({
            where: { userId: userId, word: word },
            defaults: {
                userId: userId,
                word: word,
                translation: translation || null
            }
        });

        if (!created) {
            return res.status(409).json({ message: "Это слово уже есть в вашем словаре" });
        }

        res.status(201).json({ message: "Слово успешно добавлено", newWord });

    } catch (err) {
        console.error("Error adding to dictionary:", err);
        res.status(500).json({ error: "Ошибка сервера при добавлении слова" });
    }
});

module.exports = router;
