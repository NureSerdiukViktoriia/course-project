const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authenticate = require('../middleware/auth');
const User = require('../models/User');
const AiConversation = require("../models/AiConversation");
const AiMessage = require("../models/AiMessage");
const UserStatistics = require("../models/UserStatistics");
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

const checkAchievements = async (user) => {
    const achievements = await Achievement.findAll();

    const statistics = await UserStatistics.findOne({
        where: { user_id: user.id },
    });

    for (const achievement of achievements) {
        let isUnlocked = false;

        if (
            achievement.condition_type === "first_chat" &&
            statistics &&
            statistics.first_chat_count >= achievement.condition_value
        ) {
            isUnlocked = true;
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

                user.xp = (user.xp || 0) + (achievement.xp_reward || 0);
                await user.save();
            }
        }
    }
};


router.post('/', authenticate, async (req, res) => {
    const { message, topic, level, language } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }
        
        const conversation = await AiConversation.create({
            user_id: user.id,
            topic: topic || null,
            language: language || "english",
        });

        let instruction = `
            You are a friendly AI language tutor.

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

        await AiMessage.create({
            conversation_id: conversation.id,
            sender_role: "user",
            text_content: message,
        });

        await AiMessage.create({
            conversation_id: conversation.id,
            sender_role: "assistant",
            text_content: cleanResponse,
        });

        let statistics = await UserStatistics.findOne({
            where: { user_id: user.id },
        });

        if (!statistics) {
            statistics = await UserStatistics.create({
                user_id: user.id,
                first_chat_count: 0,
            });
        }

        statistics.first_chat_count = (statistics.first_chat_count || 0) + 1;
        await statistics.save();

        await checkAchievements(user);

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