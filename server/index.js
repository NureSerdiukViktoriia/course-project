require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./db");
const authRouter = require("./routes/auth");
const userRoutes = require("./routes/user");
const exercisesRouter = require("./routes/exercises");
const miniTestRouter = require("./routes/miniTest");
const miniTestResultRouter = require("./routes/miniTestResult");
const dictionaryRouter = require("./routes/dictionary");
const chatRouter = require("./routes/chat");
const modulesRouter = require("./routes/modules");
const moduleSectionRouter = require("./routes/moduleSection");
const moduleProgressRouter = require("./routes/moduleProgress");
const taskRouter = require("./routes/task");
const analyticsRouter = require("./routes/analytics");
const moduleSectionProgressRouter = require("./routes/moduleSectionProgress");
const app = express();
const PORT = 3001;
const rewardWheelRouter = require("./routes/rewardWheel");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/miniTest", miniTestRouter);
app.use("/api/miniTestResult", miniTestResultRouter);
app.use("/api/dictionary", dictionaryRouter);
app.use("/api/chat", chatRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/modules", moduleSectionRouter);
app.use("/api/progress", moduleSectionProgressRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/reward-wheel", rewardWheelRouter);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");

    await sequelize.sync();
    //await sequelize.sync({ alter: true });

    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
