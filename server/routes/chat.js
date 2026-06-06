const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authenticate = require('../middleware/auth');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', authenticate, async (req, res) => {
    const { message, topic, level, language } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let instruction = `
            You are Lexi, a friendly AI language tutor.

            Current conversation language: ${language || "english"}.

            Rules:
            - Reply in the current conversation language.
            - If the user asks to switch to another language, switch to that language.
            - When switching language, remember it for the rest of the conversation.
            - Correct grammar mistakes and explain them.
            - Help the user practice speaking and writing.

            At the end of every reply write:

            [LANGUAGE: english]

            or

            [LANGUAGE: ukrainian]

            depending on the language you are currently using.
        `;

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
        
        const fullResponse = result.response.text();

        let newLanguage = language || "english";

        if (fullResponse.includes("[LANGUAGE: ukrainian]")) {
            newLanguage = "ukrainian";
        }

        if (fullResponse.includes("[LANGUAGE: english]")) {
            newLanguage = "english";
        }

        const cleanResponse = fullResponse
            .replace("[LANGUAGE: english]", "")
            .replace("[LANGUAGE: ukrainian]", "")
            .trim();

        res.json({
            reply: cleanResponse,
            language: newLanguage
        });

    } catch (error) {
        console.error('Google Gemini API error:', error);

        if (error.status === 429) {
            return res.json({
                reply: 'AI тимчасово перевантажений. Спробуйте через хвилину.',
                language: language || "english"
            });
        }

        if (error.status === 503) {
            return res.json({
                reply: 'AI сервіс тимчасово недоступний. Спробуйте пізніше.',
                language: language || "english"
            });
        }

        return res.json({
            reply: 'Сталася помилка при зверненні до AI.',
            language: language || "english"
        });
    }
});

module.exports = router;