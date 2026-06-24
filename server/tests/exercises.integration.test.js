const request = require("supertest");
const app = require("../index");

describe("Інтеграційне тестування API", () => {
  test("маршрут вправ listening обробляє запит", async () => {
    const response = await request(app).get("/api/exercises/listening");

    expect([200, 401]).toContain(response.statusCode);
  });

  test("маршрут вправ matching обробляє запит", async () => {
    const response = await request(app).get("/api/exercises/matching");

    expect([200, 401]).toContain(response.statusCode);
  });

  test("маршрут вправ flashcards обробляє запит", async () => {
    const response = await request(app).get("/api/exercises/flashcards");

    expect([200, 401]).toContain(response.statusCode);
  });

  test("маршрут AI-асистента обробляє запит", async () => {
    const response = await request(app)
        .post("/api/chat")
        .send({
        message: "How can I order food in a restaurant?",
        topic: "Restaurant",
        level: "beginner",
        language: "english",
        });

    expect([200, 401]).toContain(response.statusCode);
  });
});