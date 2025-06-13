const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./db");
const authRouter = require("./routes/auth");
const userRoutes = require("./routes/user");
const exercisesRouter = require("./routes/exercises");
const miniTestRouter = require("./routes/miniTest");
const dictionaryRouter = require("./routes/dictionary");
const chatRouter = require('./routes/chat');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/miniTest", miniTestRouter);
app.use("/api/dictionary", dictionaryRouter);
app.use('/api/chat', chatRouter);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");

    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
