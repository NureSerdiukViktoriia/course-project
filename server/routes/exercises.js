const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Question = require('../models/Question');
const User = require('../models/User'); 

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

router.get('/sentence-builder', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        
        const userLevel = user.level;
        const limit = 10;

        const tasks = await Question.findAll({
            where: {
                exercise_type: 'sentence_builder',
                difficulty_level: userLevel
            },
            order: [ Sequelize.fn('RANDOM') ],
            limit: limit
        });

        res.json({ tasks });

    } catch (err) {
        console.error("Error fetching sentence builder tasks:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.get('/translate-word', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        
        const userLevel = user.level;
        const limit = 10;

        const tasks = await Question.findAll({
            where: {
                exercise_type: 'translate_word',
                difficulty_level: userLevel
            },
            order: [ Sequelize.fn('RANDOM') ],
            limit: limit
        });

        res.json({ tasks });

    } catch (err) {
        console.error("Error fetching translate word tasks:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;
