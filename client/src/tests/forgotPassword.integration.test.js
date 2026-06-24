describe("Відновлення пароля користувача", () => {
  test("Процес відновлення пароля користувача", async () => {
    const check = await fetch(
      "http://localhost:3001/api/auth/forgot/check-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "serdukvika1@gmail.com" }),
      },
    );
    const checkData = await check.json();
    expect(check.status).toBe(200);
    expect(checkData).toHaveProperty("secret_question");

    const verify = await fetch(
      "http://localhost:3001/api/auth/forgot/verify-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "serdukvika1@gmail.com",
          secret_answer: "Харків",
        }),
      },
    );
    expect(verify.status).toBe(200);

    const reset = await fetch(
      "http://localhost:3001/api/auth/forgot/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "serdukvika1@gmail.com",
          new_password: "123456",
        }),
      },
    );
    expect(reset.status).toBe(200);
  });
});
