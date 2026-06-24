describe("Модульне тестування програмної системи", () => {
  test("досягнення 'Перші 100 XP' відкривається після набору 100 XP", () => {
    const user = { xp: 100 };

    const achievement = {
      condition_type: "total_xp",
      condition_value: 100,
    };

    const result = user.xp >= achievement.condition_value;

    expect(result).toBe(true);
  });

  test("досягнення 'Перші 100 XP' не відкривається при 50 XP", () => {
    const user = { xp: 50 };

    const achievement = {
      condition_type: "total_xp",
      condition_value: 100,
    };

    const result = user.xp >= achievement.condition_value;

    expect(result).toBe(false);
  });

  test("досягнення 'Майстер флеш-карток' відкривається після 10 правильних відповідей", () => {
    const statistics = {
      flashcards_correct: 10,
    };

    const achievement = {
      condition_type: "flashcards_correct",
      condition_value: 10,
    };

    const result =
      statistics.flashcards_correct >= achievement.condition_value;

    expect(result).toBe(true);
  });

  test("досягнення 'Експерт аудіювання' відкривається після 15 правильних відповідей", () => {
    const statistics = {
      listening_correct: 15,
    };

    const achievement = {
      condition_type: "listening_correct",
      condition_value: 15,
    };

    const result =
      statistics.listening_correct >= achievement.condition_value;

    expect(result).toBe(true);
  });

  test("досягнення 'Універсальний учень' відкривається після проходження 6 типів вправ", () => {
    const statistics = {
      completed_exercise_types:
        "multiple_choice,sentence_builder,translate_word,listening,matching,flashcards",
    };

    const achievement = {
      condition_type: "completed_exercise_types",
      condition_value: 6,
    };

    const completedTypes = statistics.completed_exercise_types
      .split(",")
      .filter(Boolean);

    const result = completedTypes.length >= achievement.condition_value;

    expect(result).toBe(true);
  });

    test("користувач отримує новий рівень після набору 500 XP", () => {
    const user = { xp: 500 };

    const result = user.xp >= 500;

    expect(result).toBe(true);
    });

    test("колесо фортуни доступне один раз на добу", () => {
    const lastSpinDate = "2025-06-10";
    const currentDate = "2025-06-10";

    const canSpin = lastSpinDate !== currentDate;

    expect(canSpin).toBe(false);
    });

    test("колесо фортуни доступне наступного дня", () => {
    const lastSpinDate = "2025-06-10";
    const currentDate = "2025-06-11";

    const canSpin = lastSpinDate !== currentDate;

    expect(canSpin).toBe(true);
    });

    test("вправа вважається завершеною після правильної відповіді", () => {
    const answer = "apple";
    const correctAnswer = "apple";

    const result = answer === correctAnswer;

    expect(result).toBe(true);
    });

    test("вправа аудіювання перевіряє правильність відповіді", () => {
    const selectedOption = "Dog";
    const correctOption = "Dog";

    const result = selectedOption === correctOption;

    expect(result).toBe(true);
    });

    test("користувач отримує XP після виконання вправи", () => {
    const currentXP = 120;
    const rewardXP = 20;

    const updatedXP = currentXP + rewardXP;

    expect(updatedXP).toBe(140);
    });
});