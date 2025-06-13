const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authenticate = require('../middleware/auth');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', authenticate, async (req, res) => {
    try {
        const { message, topic, level } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let instruction = `You are Lexi, an English tutor. Your response MUST be ONLY in English. The user's level is ${user.level}.`;

        if (topic) {
            instruction += ` The current topic is "${topic}".`;
        }

        if (message.includes("Please give me a simple language exercise")) {
            instruction += ` The user requested an exercise. Provide a simple, short language task.`;
        } else {
            instruction += ` The user sent a message. Continue the conversation naturally.`;
        }

        const prompt = `${instruction}\n\nUser's message: "${message}"\n\nYour response:`;

        const result = await model.generateContent(prompt);
        const botResponse = result.response.text();
        
        res.json({ reply: botResponse });

    } catch (error) {
        console.error('Google Gemini API error:', error);
        res.status(500).json({ error: 'Произошла ошибка при обращении к AI.' });
    }
});

module.exports = router;