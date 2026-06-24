import { validateForm } from "../utils/validation";

describe("Функція валідації форми реєстрації", () => {
  test("Помилка якщо ім'я неправильне", () => {
    const formData = {
      first_name: "11",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123456",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Ім'я може містити лише літери");
  });
  test("Помилка якщо прізвище неправильне", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "123",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123456",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Прізвище може містити лише літери");
  });

  test("Помилка якщо пошта неправильна", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika",
      phone: "+380986547854",
      password: "123456",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Введіть коректний email");
  });

  test("Помилка якщо номер телефону неправильний", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "856",
      password: "123456",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Введіть коректний номер телефону");
  });

  test("Помилка якщо пароль неправильний", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe(
      "Пароль повинен містити мінімум 6 символів",
    );
  });

  test("Помилка якщо рівень неправильний", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123567",
      level: "",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Будь ласка, оберіть рівень");
  });

  test("Помилка якщо питання неправильне", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123567",
      level: "середній",
      secret_question: "",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe("Оберіть секретне питання");
  });

  test("Помилка якщо відповідь неправильна", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986547854",
      password: "123567",
      level: "середній",
      secret_question: "pet",
      secret_answer: "",
    };

    expect(validateForm(formData)).toBe(
      "Введіть відповідь на секретне питання",
    );
  });

  test("Усіпшна валідація", () => {
    const formData = {
      first_name: "Вікторія",
      second_name: "Сердюк",
      email: "serdukvika@gmail.com",
      phone: "+380986574885",
      password: "111111",
      level: "середній",
      secret_question: "pet",
      secret_answer: "dog",
    };

    expect(validateForm(formData)).toBe(null);
  });
});
