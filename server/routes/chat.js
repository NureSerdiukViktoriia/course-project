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
            
            IMPORTANT:
            Before answering, always check the user's message for grammar mistakes.

            Only correct grammar mistakes when the user is writing
            in the language they are learning (English).

            If the user writes in Ukrainian, do not provide corrections.
            Simply answer the question.

            If there are mistakes, ALWAYS respond using this format:

            Correction:
            (correct sentence)

            Explanation:
            (short explanation)

            Answer:
            (answer the user's question)

            If the sentence is already correct, skip the correction section and answer normally.

            Never ignore grammar mistakes.
            Never automatically rewrite the user's sentence and pretend it was correct.
            
            Rules:
            - Reply in the current conversation language.
            - If the user asks in English, answer in English.
            - If the user asks in Ukrainian, answer in Ukrainian.
            - Correct grammar mistakes and explain them.
            - Always correct mistakes before answering.
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
            instruction += `
                The user requested an exercise.
                Do NOT use Correction / Explanation / Answer format.
                Create only a language exercise according to the selected topic and level.
                Make the exercise harder if the level is advanced.
            `;
        } else {
            instruction += `
                The user sent a message.
                If the user writes in English and makes mistakes, use this format:

                Correction:
                corrected sentence

                Explanation:
                short explanation

                Answer:
                answer to the user's question

                If the user writes in Ukrainian, do not correct Ukrainian grammar. Just answer normally.
            `;
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                { role: "system", content: instruction },
                { role: "user", content: message }
            ],
        });

        const fullResponse = completion.choices[0].message.content;

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
        console.error('OpenRouter API error:', error);

        return res.json({
            reply: 'Сталася помилка при зверненні до AI.',
            language: language || "english"
        });
    }
});

module.exports = router;