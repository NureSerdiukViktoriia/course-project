const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authenticate = require('../middleware/auth');
const User = require('../models/User');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

router.post('/', authenticate, async (req, res) => {
    const { message, topic, level, language } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        let instruction = `
            You are Lexi, a friendly AI language tutor.

            Current conversation language: ${language || "english"}.
            Current user level: ${level || "beginner"}.

            Rules:
            - Reply in the current conversation language.
            - If the user asks to switch to another language, switch to that language.
            - Correct grammar mistakes and explain them.
            - Help the user practice speaking and writing.
            - Use simple and clear explanations.

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

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                { role: "system", content: instruction },
                { role: "user", content: message }
            ],
        });

        const fullResponse = completion.choices[0].message.content;

        let newLanguage = language || "ukrainian";

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
        console.error('OpenRouter API error:', error);

        return res.json({
            reply: 'Сталася помилка при зверненні до AI.',
            language: language || "english"
        });
    }
});

module.exports = router;