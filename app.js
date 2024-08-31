const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");
require("dotenv").config();

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("You have connected successfully to your local database");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
