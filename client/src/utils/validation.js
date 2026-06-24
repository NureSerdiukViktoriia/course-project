export const validateForm = (formData) => {
  const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ'-\s]+$/;
  if (!formData.first_name.trim()) {
    return "Введіть ім'я";
  }
  if (!nameRegex.test(formData.first_name)) {
    return "Ім'я може містити лише літери";
  }
  if (!formData.second_name.trim()) {
    return "Введіть прізвище";
  }
  if (!nameRegex.test(formData.second_name)) {
    return "Прізвище може містити лише літери";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Введіть коректний email";
  }
  const phoneRegex = /^[+()\-0-9\s]{6,15}$/;
  if (!phoneRegex.test(formData.phone)) {
    return "Введіть коректний номер телефону";
  }
  if (formData.password.length < 6) {
    return "Пароль повинен містити мінімум 6 символів";
  }
  if (!formData.level) {
    return "Будь ласка, оберіть рівень";
  }
  if (!formData.secret_question) {
    return "Оберіть секретне питання";
  }
  if (!formData.secret_answer.trim()) {
    return "Введіть відповідь на секретне питання";
  }
  return null;
};
